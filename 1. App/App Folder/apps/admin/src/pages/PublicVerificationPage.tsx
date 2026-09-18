import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Award,
  Calendar,
  Building,
  CheckCircle,
  ExternalLink,
  Printer,
  FileDown,
  ArrowLeft
} from 'lucide-react';

interface VerificationResult {
  status: 'VALID' | 'EXPIRED' | 'REVOKED' | 'NOT_FOUND';
  certificateId: string;
  workerName?: string;
  workerIdMasked?: string;
  moduleTitle?: string;
  organizationName?: string;
  issueDate?: string;
  expiryDate?: string;
  score?: number;
  isValid: boolean;
  message: string;
}

export const PublicVerificationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:5000/api/v1/certificates/verify/${encodeURIComponent(id)}`)
        .then((res) => res.json())
        .then((data) => {
          const verification = data.data?.verification || data.data || data;
          if (data.success && verification) {
            setResult(verification);
          } else {
            setResult({
              status: 'NOT_FOUND',
              certificateId: id,
              isValid: false,
              message: data.message || 'No certificate found matching the provided code.'
            });
          }
        })
        .catch((err) => {
          console.error('Verification query failed', err);
          setResult({
            status: 'NOT_FOUND',
            certificateId: id,
            isValid: false,
            message: 'Unable to connect to the safety registry server.'
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#16A085] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-[#14213D]">Querying PARIKSHAK Verification Registry...</p>
        <p className="text-xs text-[#7A8793] mt-1">Verifying safety credentials against official records</p>
      </div>
    );
  }

  const isValid = result?.isValid && result?.status === 'VALID';

  const handleDownloadPdf = () => {
    if (!result?.certificateId) return;
    window.open(
      `http://localhost:5000/api/v1/certificates/${encodeURIComponent(result.certificateId)}/pdf`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F4F3] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#16A085] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to PARIKSHAK Portal
          </Link>
          <div className="flex items-center gap-2">
            {isValid && (
              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#16A085] text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#138A72] transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download PDF
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-[#E1E8E6] text-[#14213D] px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#7A8793]" />
              Print
            </button>
          </div>
        </div>

        {/* Official Registry Credential Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#D4E2DE] overflow-hidden">
          {/* Official Registry Top Header */}
          <div className="bg-gradient-to-r from-[#14213D] to-[#1E293B] text-white p-8 text-center relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#16A085]/20 border border-[#16A085]/40 mb-3 shadow-inner">
              <ShieldCheck className="w-9 h-9 text-[#00F2FE]" />
            </div>
            <h1 className="text-xl font-black tracking-wider uppercase text-[#00F2FE]">
              PARIKSHAK
            </h1>
            <p className="text-xs text-slate-300 font-medium tracking-wide mt-1">
              NATIONAL SAFETY CREDENTIAL REGISTRY • PUBLIC VERIFICATION
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Status Callout Banner */}
            {isValid ? (
              <div className="bg-[#EAFAF1] border border-[#27AE60]/30 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#27AE60] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-[#14213D] uppercase">
                      OFFICIALLY VERIFIED & ACTIVE
                    </h2>
                    <span className="bg-[#27AE60] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      VALID
                    </span>
                  </div>
                  <p className="text-xs text-[#27AE60] font-semibold mt-0.5">
                    {result.message}
                  </p>
                  <p className="text-[11px] text-[#7A8793] mt-1">
                    Record is authentic and confirmed active in the PARIKSHAK central database.
                  </p>
                </div>
              </div>
            ) : result?.status === 'REVOKED' ? (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-black text-rose-900 uppercase">
                    CREDENTIAL REVOKED
                  </h2>
                  <p className="text-xs text-rose-800 font-semibold mt-0.5">{result.message}</p>
                  <p className="text-[11px] text-rose-700 mt-1">
                    This certificate is no longer active.
                  </p>
                </div>
              </div>
            ) : result?.status === 'EXPIRED' ? (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-black text-amber-900 uppercase">
                    CREDENTIAL EXPIRED
                  </h2>
                  <p className="text-xs text-amber-800 font-semibold mt-0.5">{result.message}</p>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-base font-black text-rose-900 uppercase">
                    NO RECORD FOUND
                  </h2>
                  <p className="text-xs text-rose-800 font-semibold mt-0.5">
                    No active safety certificate matching ID "{id}" exists in the official registry.
                  </p>
                </div>
              </div>
            )}

            {/* Credential Data Grid */}
            {result && result.status !== 'NOT_FOUND' && (
              <div className="space-y-4">
                <div className="bg-[#F8FAF9] rounded-2xl p-6 border border-[#E1E8E6] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        CERTIFICATE IDENTIFIER
                      </span>
                      <span className="text-base font-mono font-black text-[#16A085] tracking-tight">
                        {result.certificateId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        STATUS
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                          result.status === 'VALID'
                            ? 'text-[#27AE60] bg-[#EAFAF1]'
                            : 'text-rose-700 bg-rose-50'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        {result.status}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        WORKER NAME
                      </span>
                      <span className="text-sm font-bold text-[#14213D]">
                        {result.workerName || 'Certified Worker'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        WORKER ID (MASKED)
                      </span>
                      <span className="text-xs font-mono font-bold text-[#14213D]">
                        {result.workerIdMasked || '***'}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        SAFETY QUALIFICATION MODULE
                      </span>
                      <span className="text-sm font-extrabold text-[#14213D]">
                        {result.moduleTitle}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        ORGANIZATION
                      </span>
                      <span className="text-xs font-semibold text-[#14213D]">
                        {result.organizationName || 'PARIKSHAK Enterprise'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        EXAMINATION SCORE
                      </span>
                      <span className="text-xs font-bold text-[#16A085]">
                        {result.score !== undefined ? `${result.score}%` : 'Passed'}
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-bold text-[#7A8793] uppercase tracking-wider block">
                        ISSUE DATE
                      </span>
                      <span className="text-xs text-[#14213D] font-medium">
                        {result.issueDate ? new Date(result.issueDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="bg-[#F8FAF9] p-4 border-t border-[#E1E8E6] text-center text-[10px] text-[#7A8793]">
            PARIKSHAK Safety Platform • Central Registry • Current Date: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
