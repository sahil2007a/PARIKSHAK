import React, { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Database,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { adminApi } from '../services/api';
import { DashboardStats } from '../types';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dbStatus, setDbStatus] = useState<string>('CONNECTED');

  const fetchStats = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const [data, health] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.checkHealth()
      ]);
      setStats(data);
      setDbStatus(health.database || 'CONNECTED');
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Auto-refresh from MongoDB every 15 seconds
    const timer = setInterval(() => {
      fetchStats(false);
    }, 15000);
    return () => clearInterval(timer);
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#16A085]">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-sm">Connecting to MongoDB & fetching real-time safety metrics...</span>
        </div>
      </div>
    );
  }

  const uncertifiedCount = Math.max(0, stats.totalWorkers - stats.certifiedWorkersCount);
  const complianceDonut = [
    { name: 'Certified Compliant', value: stats.certifiedWorkersCount, color: '#16A085' },
    {
      name: 'Training In Progress',
      value: uncertifiedCount,
      color: '#CBD5E1'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
              Industrial Safety & Compliance Dashboard
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Database className="w-3 h-3" />
              <span>MongoDB Live ({dbStatus})</span>
            </div>
          </div>
          <p className="text-sm text-[#7A8793] mt-0.5">
            Real-time worker training certification, safety simulation metrics, and DGMS compliance posture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            title={`Last updated at ${lastUpdated.toLocaleTimeString()}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#16A085] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <Link
            to="/compliance"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-[#16A085]" />
            <span>Audit Report</span>
          </Link>
          <Link
            to="/modules"
            className="flex items-center gap-2 px-4 py-2 bg-[#16A085] hover:bg-[#117A65] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#16A085]/20"
          >
            <span>Manage Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Pending Worker Registrations Alert Banner */}
      {Boolean((stats.pendingApprovalsCount ?? 0) > 0) && (
        <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#14213D]">
                {stats.pendingApprovalsCount ?? 0} Worker Registration{(stats.pendingApprovalsCount ?? 0) > 1 ? 's' : ''} Awaiting Admin Approval
              </h3>
              <p className="text-xs text-[#7A8793] mt-0.5">
                New plant workers have registered and cannot access training modules until safety approval is granted.
              </p>
            </div>
          </div>
          <Link
            to="/workers"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <span>Review & Approve ({stats.pendingApprovalsCount ?? 0})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Workers"
          value={stats.totalWorkers.toLocaleString()}
          subtitle={`${stats.activeWorkers} active on plant floor`}
          icon={Users}
          trend={`${stats.activeWorkers} Active`}
          trendPositive={true}
          colorVariant="blue"
        />

        <StatCard
          title="Certified Workers"
          value={stats.certifiedWorkersCount.toLocaleString()}
          subtitle={`${stats.compliancePercentage}% of workforce certified`}
          icon={Award}
          trend={`${stats.compliancePercentage}% Pass Rate`}
          trendPositive={stats.compliancePercentage >= 70}
          colorVariant="green"
        />

        <StatCard
          title="Expiring Within 30 Days"
          value={stats.expiringCertificates}
          subtitle="Scheduled for annual recertification"
          icon={Clock}
          trend="Annual Refresher"
          trendPositive={false}
          colorVariant="amber"
        />

        <StatCard
          title="Lapsed / Retraining Required"
          value={stats.expiredCertificates}
          subtitle="Prohibited from hazardous plant zones"
          icon={AlertTriangle}
          trend="Action required"
          trendPositive={false}
          colorVariant="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Monthly Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#14213D] text-base">Monthly Safety Training Activity</h3>
              <p className="text-xs text-[#7A8793]">
                Completed simulation drills and issued certified safety badges (MongoDB Aggregates)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#16A085]">
                <span className="w-3 h-3 rounded-full bg-[#16A085]"></span> Completions
              </span>
              <span className="flex items-center gap-1.5 text-[#0E6655]">
                <span className="w-3 h-3 rounded-full bg-[#0E6655]"></span> Badges Issued
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A085" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16A085" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E1E8E6',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="#16A085"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCompletions)"
                />
                <Area
                  type="monotone"
                  dataKey="certifications"
                  stroke="#0E6655"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Gauge / Ratio */}
        <div className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#14213D] text-base">Workforce Compliance Ratio</h3>
            <p className="text-xs text-[#7A8793] mt-0.5">Statutory mandatory safety coverage</p>

            <div className="h-48 relative flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {complianceDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#14213D]">{stats.compliancePercentage}%</span>
                <span className="text-[10px] text-[#7A8793] uppercase font-bold tracking-wider">Compliant</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#E1E8E6]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7A8793] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A085]"></span> Certified Workforce
              </span>
              <span className="font-bold text-[#14213D]">{stats.certifiedWorkersCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7A8793] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CBD5E1]"></span> Uncertified / In Training
              </span>
              <span className="font-bold text-[#14213D]">{uncertifiedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Performance Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#14213D] text-base">Curriculum Mastery Breakdown</h3>
            <p className="text-xs text-[#7A8793]">
              Live pass rate and completion statistics from MongoDB database
            </p>
          </div>
          <Link
            to="/modules"
            className="text-xs font-semibold text-[#16A085] hover:text-[#0E6655] transition-colors"
          >
            View all modules →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E1E8E6] text-[#7A8793] uppercase font-bold tracking-wider text-[10px]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Module Name</th>
                <th className="py-3 px-4">Total Attempts</th>
                <th className="py-3 px-4">Passed</th>
                <th className="py-3 px-4">Pass Rate</th>
                <th className="py-3 px-4">Certified Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E8E6]/60">
              {stats.moduleStats && stats.moduleStats.length > 0 ? (
                stats.moduleStats.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#7A8793]">M{m.moduleNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-[#14213D]">{m.title}</td>
                    <td className="py-3.5 px-4 text-[#7A8793]">{m.attempts.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-[#14213D] font-medium">{m.passes.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#16A085] h-full rounded-full"
                            style={{ width: `${m.passRate}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-[#14213D]">{m.passRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#16A085]">
                      {m.certifications.toLocaleString()} badges
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#7A8793]">
                    No module attempts recorded in MongoDB yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
