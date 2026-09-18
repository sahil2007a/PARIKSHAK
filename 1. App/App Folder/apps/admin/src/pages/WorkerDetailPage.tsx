import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle, Clock, Shield, User, FileCheck, ExternalLink } from 'lucide-react';
import { adminApi } from '../services/api';

export const WorkerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      adminApi.getWorkerById(id).then((data) => {
        setWorker(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !worker) {
    return (
      <div className="p-8 text-center text-[#7A8793] text-sm">
        Loading worker profile...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/workers"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A8793] hover:text-[#16A085] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Workers Directory</span>
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#16A085]/10 text-[#16A085] font-bold text-2xl flex items-center justify-center border border-[#16A085]/20">
            {worker.fullName ? worker.fullName.charAt(0) : 'W'}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#14213D]">{worker.fullName}</h2>
              <span className="px-2 py-0.5 bg-[#E8F8F5] text-[#16A085] rounded-full text-xs font-mono font-bold">
                {worker.workerId}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  worker.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {worker.status}
              </span>
            </div>
            <p className="text-xs text-[#7A8793] mt-1">
              {worker.jobRole} • {worker.experienceYears || 0} years experience • {worker.organizationName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-[#7A8793]">Preferred Language</div>
            <div className="text-xs font-bold text-[#14213D] uppercase">{worker.preferredLanguage || 'English'}</div>
          </div>
        </div>
      </div>

      {/* Grid: Certificates & Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificates Section */}
        <div className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#14213D]">
            <Award className="w-4 h-4 text-[#16A085]" />
            <span>Earned Safety Badges & Certificates</span>
          </div>

          {worker.certificates && worker.certificates.length > 0 ? (
            <div className="space-y-3">
              {worker.certificates.map((c: any) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-[#E1E8E6] bg-[#F5F8F7]/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-[#14213D]">{c.moduleTitle}</div>
                    <div className="text-[10px] font-mono text-[#7A8793] mt-0.5">{c.certificateId}</div>
                    <div className="text-[10px] text-[#7A8793] mt-1">
                      Score: <span className="font-bold text-[#16A085]">{c.score}%</span> • Expires:{' '}
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                  <a
                    href={c.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[#16A085] hover:bg-[#E8F8F5] rounded-xl transition-colors"
                    title="Verify Online"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A8793] italic py-4">No active certificates issued yet.</p>
          )}
        </div>

        {/* Assessment Attempts Section */}
        <div className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#14213D]">
            <FileCheck className="w-4 h-4 text-[#16A085]" />
            <span>Assessment Drill History</span>
          </div>

          {worker.attempts && worker.attempts.length > 0 ? (
            <div className="space-y-3">
              {worker.attempts.map((att: any) => (
                <div
                  key={att.id}
                  className="p-4 rounded-xl border border-[#E1E8E6] bg-[#F5F8F7]/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-[#14213D]">{att.moduleTitle}</div>
                    <div className="text-[10px] text-[#7A8793] mt-1">
                      Date: {new Date(att.date).toLocaleDateString()} • Time spent: {att.timeSpentSeconds}s
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold ${
                        att.passed ? 'text-[#27AE60]' : 'text-[#E74C3C]'
                      }`}
                    >
                      {att.score}%
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase ${
                        att.passed ? 'text-[#27AE60]' : 'text-[#E74C3C]'
                      }`}
                    >
                      {att.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#7A8793] italic py-4">No assessments logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
