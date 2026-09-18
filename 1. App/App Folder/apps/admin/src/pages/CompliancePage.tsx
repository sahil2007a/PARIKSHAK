import React, { useEffect, useState } from 'react';
import { ShieldCheck, Database, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/api';
import { DashboardStats, WorkerRow } from '../types';

export const CompliancePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComplianceData = async (spinner = false) => {
    if (spinner) setIsRefreshing(true);
    try {
      const [s, w] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getWorkers()
      ]);
      setStats(s);
      setWorkers(w);
    } catch (err) {
      console.error('Failed to load compliance data from MongoDB:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#16A085]">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-sm">Auditing statutory compliance from MongoDB...</span>
        </div>
      </div>
    );
  }

  // Calculate sector breakdowns dynamically from MongoDB worker dataset
  const sectorMap: Record<string, { total: number; certified: number; risks: string[] }> = {
    MINING: {
      total: 0,
      certified: 0,
      risks: ['Underground Methane & CO Gas', 'Haul Road Heavy Machinery', 'Blasting Rock Fall Zone']
    },
    STEEL: {
      total: 0,
      certified: 0,
      risks: ['Blast Furnace Molten Metal Spill', 'Overhead Crane Loads', 'LOTO Energy Isolation']
    },
    MICA: {
      total: 0,
      certified: 0,
      risks: ['Silica Dust Lung Inhalation (P100)', 'Hopper Confined Space Access', 'Pinch Point Guards']
    },
    CONSTRUCTION: {
      total: 0,
      certified: 0,
      risks: ['Fall from Heights & Scaffolding', 'Excavation Trench Collapse', 'Electrical Ground Faults']
    },
    GENERAL: {
      total: 0,
      certified: 0,
      risks: ['Industrial Fire & Evacuation', 'First Aid Response', 'Chemical Splash Defense']
    }
  };

  workers.forEach((w) => {
    const sec = w.sector || 'GENERAL';
    if (!sectorMap[sec]) {
      sectorMap[sec] = { total: 0, certified: 0, risks: ['General Industrial Safety Adherence'] };
    }
    sectorMap[sec].total += 1;
    if (w.certificateStatus === 'CERTIFIED' || (w.completedModulesCount && w.completedModulesCount > 0)) {
      sectorMap[sec].certified += 1;
    }
  });

  const sectorCards = Object.entries(sectorMap)
    .filter(([_, data]) => data.total > 0)
    .map(([sec, data]) => {
      const rate = data.total > 0 ? Math.round((data.certified / data.total) * 100) : 0;
      return {
        sector: sec,
        name: `${sec.charAt(0) + sec.slice(1).toLowerCase()} Industrial Sector`,
        workersCount: data.total,
        certifiedCount: data.certified,
        complianceRate: rate,
        keyRisks: data.risks,
        status: rate >= 75 ? 'HIGH_COMPLIANCE' : 'AUDIT_ATTENTION'
      };
    });

  const overallRate = stats?.compliancePercentage || 0;
  const totalWorkersCount = stats?.totalWorkers || workers.length;
  const certifiedCount = stats?.certifiedWorkersCount || 0;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
              Enterprise Safety & Statutory DGMS Compliance Matrix
            </h1>
            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-semibold">
              <Database className="w-3 h-3" />
              <span>MongoDB Dynamic Matrix</span>
            </div>
          </div>
          <p className="text-sm text-[#7A8793] mt-0.5">
            Auditing statutory industrial safety adherence according to Mines Act & Factory Safety Directorate.
          </p>
        </div>

        <button
          onClick={() => fetchComplianceData(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#16A085] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Score Banner */}
      <div className="bg-gradient-to-r from-[#16A085] to-[#0E6655] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Overall Plant Compliance Index
          </span>
          <h2 className="text-3xl font-extrabold mt-2">{overallRate}% Statutory Adherence</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            Total of {certifiedCount} out of {totalWorkersCount} registered field personnel hold active safety certifications in MongoDB database.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center shrink-0">
          <div className="text-2xl font-bold">{stats?.expiringCertificates || 0}</div>
          <div className="text-[10px] uppercase font-bold text-emerald-200">Expiring Certs in 30 Days</div>
        </div>
      </div>

      {/* Sector Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sectorCards.length > 0 ? (
          sectorCards.map((s, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'HIGH_COMPLIANCE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {s.status === 'HIGH_COMPLIANCE' ? 'Audit Compliant' : 'Target In Progress'}
                  </span>
                  <span className="text-xs font-bold text-[#14213D]">{s.complianceRate}%</span>
                </div>

                <h3 className="font-bold text-[#14213D] text-base mt-2">{s.name}</h3>

                <div className="mt-3 space-y-2">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        s.complianceRate >= 75 ? 'bg-[#16A085]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${s.complianceRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#7A8793]">
                    <span>{s.certifiedCount} certified</span>
                    <span>{s.workersCount} total personnel</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E1E8E6]">
                  <div className="text-[10px] font-bold uppercase text-[#7A8793] tracking-wider mb-1.5">
                    High-Priority Risk Controls
                  </div>
                  <ul className="space-y-1 text-xs text-[#14213D]">
                    {s.keyRisks.map((r, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A085]"></span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button className="w-full mt-4 py-2 bg-[#F5F8F7] hover:bg-[#E8F8F5] text-[#16A085] font-semibold text-xs rounded-xl border border-[#E1E8E6] transition-colors">
                Schedule Recertification Wave
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-white p-8 rounded-2xl text-center text-xs text-[#7A8793]">
            No worker sector profiles registered in database yet.
          </div>
        )}
      </div>
    </div>
  );
};
