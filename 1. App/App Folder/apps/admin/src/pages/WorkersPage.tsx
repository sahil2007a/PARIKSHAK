import React, { useEffect, useState } from 'react';
import { Search, Filter, Shield, Eye, UserX, UserCheck, Award, CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/api';
import { WorkerRow } from '../types';
import { Link } from 'react-router-dom';

export const WorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWorkers = async () => {
    setLoading(true);
    const data = await adminApi.getWorkers(search, sector, status);
    setWorkers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkers();
  }, [sector, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkers();
  };

  const handleApproveWorker = async (worker: WorkerRow) => {
    try {
      setActionLoading(worker.id);
      const ok = await adminApi.updateWorkerStatus(worker.id, 'ACTIVE');
      if (ok) {
        setWorkers((prev) =>
          prev.map((w) => (w.id === worker.id ? { ...w, status: 'ACTIVE' } : w))
        );
        setFeedbackMessage({
          type: 'success',
          text: `Worker ${worker.fullName} (${worker.workerId}) has been APPROVED! They can now log in.`
        });
        setTimeout(() => setFeedbackMessage(null), 5000);
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: `Failed to approve worker ${worker.workerId}` });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectWorker = async (worker: WorkerRow) => {
    try {
      setActionLoading(worker.id);
      const ok = await adminApi.updateWorkerStatus(worker.id, 'SUSPENDED');
      if (ok) {
        setWorkers((prev) =>
          prev.map((w) => (w.id === worker.id ? { ...w, status: 'SUSPENDED' } : w))
        );
        setFeedbackMessage({
          type: 'success',
          text: `Worker registration for ${worker.workerId} rejected/suspended.`
        });
        setTimeout(() => setFeedbackMessage(null), 5000);
      }
    } catch {
      setFeedbackMessage({ type: 'error', text: `Failed to reject worker ${worker.workerId}` });
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (worker: WorkerRow) => {
    const nextStatus = worker.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const ok = await adminApi.updateWorkerStatus(worker.id, nextStatus);
    if (ok) {
      setWorkers((prev) =>
        prev.map((w) => (w.id === worker.id ? { ...w, status: nextStatus } : w))
      );
    }
  };

  const pendingCount = workers.filter((w) => w.status === 'PENDING').length;
  const activeCount = workers.filter((w) => w.status === 'ACTIVE').length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
            Workforce Safety & Approval Registry
          </h1>
          <p className="text-sm text-[#7A8793] mt-0.5">
            Review new worker registrations, approve access, and track live module assessments from MongoDB.
          </p>
        </div>

        <button
          onClick={fetchWorkers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#16A085]' : ''}`} />
          Refresh Registry
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatus('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            status === 'ALL'
              ? 'bg-[#14213D] text-white shadow-sm'
              : 'bg-white border border-[#E1E8E6] text-[#7A8793] hover:text-[#14213D]'
          }`}
        >
          All Workers ({workers.length})
        </button>
        <button
          onClick={() => setStatus('PENDING')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            status === 'PENDING'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Approvals
          {pendingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
              status === 'PENDING' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setStatus('ACTIVE')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            status === 'ACTIVE'
              ? 'bg-[#16A085] text-white shadow-sm'
              : 'bg-white border border-[#E1E8E6] text-[#7A8793] hover:text-[#14213D]'
          }`}
        >
          Active Workers ({activeCount})
        </button>
        <button
          onClick={() => setStatus('SUSPENDED')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
            status === 'SUSPENDED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white border border-[#E1E8E6] text-[#7A8793] hover:text-[#14213D]'
          }`}
        >
          Suspended
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E1E8E6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2 bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-[#7A8793]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by worker name, worker ID (e.g. WRK-1001), phone..."
            className="bg-transparent text-xs text-[#14213D] focus:outline-none w-full placeholder:text-[#7A8793]"
          />
          <button type="submit" className="text-xs font-semibold text-[#16A085] px-2">
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="bg-[#F5F8F7] border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Sectors</option>
            <option value="MINING">Mining</option>
            <option value="STEEL">Steel</option>
            <option value="MICA">Mica</option>
            <option value="GENERAL">General</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E1E8E6] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7A8793] text-sm font-semibold flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#16A085]" />
            Loading workforce registry from MongoDB...
          </div>
        ) : workers.length === 0 ? (
          <div className="p-12 text-center text-[#7A8793] text-sm">
            No workers match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F8F7]/80 border-b border-[#E1E8E6] text-[#7A8793] uppercase font-bold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Worker ID</th>
                  <th className="py-3 px-4">Name & Role</th>
                  <th className="py-3 px-4">Organization & Sector</th>
                  <th className="py-3 px-4">Training Progress</th>
                  <th className="py-3 px-4">Latest Score</th>
                  <th className="py-3 px-4">Cert Status</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Approval & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E8E6]/60">
                {workers.map((w) => {
                  const isPending = w.status === 'PENDING';
                  return (
                    <tr
                      key={w.id}
                      className={`transition-colors ${
                        isPending
                          ? 'bg-amber-50/40 hover:bg-amber-50/80 border-l-4 border-l-amber-500'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#14213D]">{w.workerId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#14213D]">{w.fullName}</div>
                        <div className="text-[11px] text-[#7A8793]">{w.jobRole}</div>
                        <div className="text-[10px] text-[#7A8793]">{w.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#14213D] font-medium truncate max-w-[200px]">{w.organizationName}</div>
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-slate-100 text-[#7A8793] rounded text-[9px] font-bold">
                          {w.sector}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#16A085] h-full rounded-full"
                              style={{ width: `${w.trainingProgress}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-[#14213D]">{w.trainingProgress}%</span>
                        </div>
                        <span className="text-[10px] text-[#7A8793]">{w.completedModulesCount}/5 modules</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {w.latestScore !== null ? (
                          <span className="font-bold text-[#14213D]">{w.latestScore}%</span>
                        ) : (
                          <span className="text-[#7A8793] italic">0 attempts</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            w.certificateStatus === 'CERTIFIED'
                              ? 'bg-[#EAFAF1] text-[#27AE60]'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Award className="w-3 h-3" />
                          {w.certificateStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            w.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : w.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {w.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {w.status === 'PENDING' ? 'PENDING APPROVAL' : w.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleApproveWorker(w)}
                                disabled={actionLoading === w.id}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#16A085] hover:bg-[#138d75] text-white text-[11px] font-bold rounded-lg shadow-sm transition-all"
                                title="Approve Worker Registration"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {actionLoading === w.id ? 'Approving...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleRejectWorker(w)}
                                disabled={actionLoading === w.id}
                                className="inline-flex items-center gap-1 px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg transition-all"
                                title="Reject Worker Registration"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                to={`/workers/${w.id}`}
                                className="p-1.5 text-[#7A8793] hover:text-[#16A085] hover:bg-[#E8F8F5] rounded-lg transition-colors"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleToggleStatus(w)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  w.status === 'ACTIVE'
                                    ? 'text-[#7A8793] hover:text-[#E74C3C] hover:bg-rose-50'
                                    : 'text-[#7A8793] hover:text-[#27AE60] hover:bg-emerald-50'
                                }`}
                                title={w.status === 'ACTIVE' ? 'Suspend Access' : 'Activate Access'}
                              >
                                {w.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
