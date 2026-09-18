import React, { useEffect, useState } from 'react';
import { FileText, Shield, User, Clock, Terminal } from 'lucide-react';
import { adminApi } from '../services/api';
import { AuditLogRow } from '../types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getAuditLogs().then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
          System & Compliance Security Audit Logs
        </h1>
        <p className="text-sm text-[#7A8793] mt-0.5">
          Immutable audit record of user authentication, assessment completions, credential issuance, and certificate revocations.
        </p>
      </div>

      {/* Audit List Table */}
      <div className="bg-white rounded-2xl border border-[#E1E8E6] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7A8793] text-sm">Loading security logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F8F7]/80 border-b border-[#E1E8E6] text-[#7A8793] uppercase font-bold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details / Metadata</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E8E6]/60">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70 transition-colors font-mono text-[11px]">
                    <td className="py-3 px-4 text-[#7A8793]">
                      {new Date(l.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#14213D]">
                      {l.userWorkerId || 'SYSTEM'}
                      {l.userRole && (
                        <span className="ml-1 text-[9px] px-1 py-0.2 bg-slate-100 rounded text-[#7A8793]">
                          {l.userRole}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#E8F8F5] text-[#16A085] font-bold text-[10px]">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#14213D]">{l.entity}</td>
                    <td className="py-3 px-4 text-[#7A8793] truncate max-w-xs">
                      {JSON.stringify(l.details)}
                    </td>
                    <td className="py-3 px-4 text-[#7A8793]">{l.ipAddress || '127.0.0.1'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
