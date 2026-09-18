import { DashboardStats, WorkerRow, CertificateRow, CertificateStats, AuditLogRow } from '../types';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE) || 'http://localhost:5000/api/v1';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('parishak_admin_token');
};

export const setAuthData = (token: string, user: any) => {
  localStorage.setItem('parishak_admin_token', token);
  localStorage.setItem('parishak_admin_user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('parishak_admin_token');
  localStorage.removeItem('parishak_admin_user');
};

const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Automatic admin session bootstrap
let authPromise: Promise<string | null> | null = null;
export const ensureAdminAuth = async (): Promise<string | null> => {
  let token = getAuthToken();
  if (token) return token;

  if (authPromise) return authPromise;

  authPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'ADM-9001',
          password: 'Safety@2026'
        })
      });
      const data = await res.json();
      if (data.success && data.data?.tokens?.accessToken) {
        const accessToken = data.data.tokens.accessToken;
        setAuthData(accessToken, data.data.user);
        return accessToken;
      }
    } catch (err) {
      console.warn('Could not auto-login admin session:', err);
    } finally {
      authPromise = null;
    }
    return null;
  })();

  return authPromise;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  await ensureAdminAuth();
  let res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  // If unauthorized, re-authenticate and retry once
  if (res.status === 401 || res.status === 403) {
    clearAuthData();
    const freshToken = await ensureAdminAuth();
    if (freshToken) {
      res = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          Authorization: `Bearer ${freshToken}`,
          ...(options.headers || {})
        }
      });
    }
  }

  return res;
};

export const adminApi = {
  // Check backend server connection & live database state
  checkHealth: async (): Promise<{ status: string; database: string }> => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const json = await res.json();
      const dbStatus =
        json.database?.status ||
        json.data?.database?.status ||
        (json.database?.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED');
      return { status: json.status || 'HEALTHY', database: dbStatus };
    } catch {
      return { status: 'OFFLINE', database: 'DISCONNECTED' };
    }
  },

  // 1. Dashboard Aggregate Statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/admin/dashboard`);
      const json = await res.json();
      if (json.success && json.data?.stats) {
        return json.data.stats;
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats from MongoDB:', err);
    }
    // Fallback if network completely down
    return {
      totalWorkers: 0,
      activeWorkers: 0,
      totalCertificates: 0,
      certifiedWorkersCount: 0,
      compliancePercentage: 0,
      expiringCertificates: 0,
      expiredCertificates: 0,
      totalModules: 5,
      monthlyActivity: [],
      moduleStats: []
    };
  },

  // 2. Workers Directory
  getWorkers: async (search?: string, sector?: string, status?: string): Promise<WorkerRow[]> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (sector && sector !== 'ALL') params.append('sector', sector);
      if (status && status !== 'ALL') params.append('status', status);

      const res = await fetchWithAuth(`${API_BASE}/admin/workers?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data?.workers) {
        return json.data.workers;
      }
    } catch (err) {
      console.error('Failed to fetch workers from MongoDB:', err);
    }
    return [];
  },

  // 3. Worker Details & History
  getWorkerById: async (id: string): Promise<any> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/admin/workers/${id}`);
      const json = await res.json();
      if (json.success && json.data?.worker) {
        return json.data.worker;
      }
    } catch (err) {
      console.error('Failed to fetch worker details from MongoDB:', err);
    }
    return null;
  },

  // 4. Update Worker Status (Active / Suspended)
  updateWorkerStatus: async (id: string, status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/admin/workers/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      const json = await res.json();
      return !!json.success;
    } catch (err) {
      console.error('Failed to update worker status in MongoDB:', err);
      return false;
    }
  },

  // 5. Certificates Directory
  getCertificates: async (
    search?: string,
    status?: string,
    moduleId?: string
  ): Promise<{ certificates: CertificateRow[]; stats: CertificateStats }> => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status && status !== 'ALL') params.append('status', status);
      if (moduleId && moduleId !== 'ALL') params.append('moduleId', moduleId);

      const res = await fetchWithAuth(`${API_BASE}/admin/certificates?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        return {
          certificates: json.data.certificates || [],
          stats: json.data.stats || {
            total: (json.data.certificates || []).length,
            valid: (json.data.certificates || []).filter((c: any) => c.status === 'VALID').length,
            revoked: (json.data.certificates || []).filter((c: any) => c.status === 'REVOKED').length
          }
        };
      }
    } catch (err) {
      console.error('Failed to fetch certificates from MongoDB:', err);
    }
    return { certificates: [], stats: { total: 0, valid: 0, revoked: 0 } };
  },

  // 5b. Get Single Certificate Details
  getCertificateById: async (id: string): Promise<CertificateRow | null> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/admin/certificates/${id}`);
      const json = await res.json();
      if (json.success && json.data?.certificate) {
        return json.data.certificate;
      }
    } catch (err) {
      console.error('Failed to fetch certificate detail:', err);
    }
    return null;
  },

  // 6. Revoke Certificate
  revokeCertificate: async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/admin/certificates/${id}/revoke`, {
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      const json = await res.json();
      return !!json.success;
    } catch (err) {
      console.error('Failed to revoke certificate in MongoDB:', err);
      return false;
    }
  },

  // 6b. Verify / Re-validate Certificate
  verifyCertificate: async (id: string, verified: boolean = true): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/admin/certificates/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ verified })
      });
      const json = await res.json();
      return !!json.success;
    } catch (err) {
      console.error('Failed to verify certificate in MongoDB:', err);
      return false;
    }
  },

  // 7. Audit Logs
  getAuditLogs: async (action?: string, limit?: number): Promise<AuditLogRow[]> => {
    try {
      const params = new URLSearchParams();
      if (action && action !== 'ALL') params.append('action', action);
      if (limit) params.append('limit', String(limit));

      const res = await fetchWithAuth(`${API_BASE}/admin/audit-logs?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data?.logs) {
        return json.data.logs;
      }
    } catch (err) {
      console.error('Failed to fetch audit logs from MongoDB:', err);
    }
    return [];
  },

  // 8. Modules Curriculum
  getModules: async (): Promise<any[]> => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/modules`);
      const json = await res.json();
      if (json.success && json.data?.modules) {
        return json.data.modules;
      }
    } catch (err) {
      console.error('Failed to fetch training modules from MongoDB:', err);
    }
    return [];
  }
};
