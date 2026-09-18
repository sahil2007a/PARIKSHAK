import React, { useEffect, useState } from 'react';
import {
  Award,
  Search,
  CheckCircle,
  Ban,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Eye,
  FileDown,
  X,
  QrCode
} from 'lucide-react';
import { adminApi } from '../services/api';
import { CertificateRow, CertificateStats } from '../types';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [stats, setStats] = useState<CertificateStats>({ total: 0, valid: 0, revoked: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedCert, setSelectedCert] = useState<CertificateRow | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<CertificateRow | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    const result = await adminApi.getCertificates(search, status);
    setCertificates(result.certificates);
    setStats(result.stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, [status]);

  const handleRevokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeTarget) return;

    const ok = await adminApi.revokeCertificate(revokeTarget.id, revokeReason);
    if (ok) {
      setCertificates((prev) =>
        prev.map((c) =>
          c.id === revokeTarget.id
            ? { ...c, status: 'REVOKED', revocationReason: revokeReason }
            : c
        )
      );
      setStats((prev) => ({
        ...prev,
        valid: Math.max(0, prev.valid - 1),
        revoked: prev.revoked + 1
      }));
      setRevokeTarget(null);
      setRevokeReason('');
    }
  };

  const handleDownloadPdf = (certId: string) => {
    window.open(`http://localhost:5000/api/v1/certificates/${encodeURIComponent(certId)}/pdf`, '_blank');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
            Issued Safety Certificates & Ledger
          </h1>
          <p className="text-sm text-[#7A8793] mt-0.5">
            Real-time authoritative register of worker certifications, QR validation endpoints, and compliance status.
          </p>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E1E8E6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E8F8F5] text-[#16A085] flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#14213D]">{stats.total}</div>
            <div className="text-xs font-semibold text-[#7A8793] uppercase tracking-wider">
              Total Certificates Issued
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E1E8E6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EAFAF1] text-[#27AE60] flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#27AE60]">{stats.valid}</div>
            <div className="text-xs font-semibold text-[#7A8793] uppercase tracking-wider">
              Active & Valid
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E1E8E6] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600">{stats.revoked}</div>
            <div className="text-xs font-semibold text-[#7A8793] uppercase tracking-wider">
              Revoked
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E1E8E6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCertificates();
          }}
          className="flex-1 w-full flex items-center gap-2 bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl px-3 py-2"
        >
          <Search className="w-4 h-4 text-[#7A8793]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Certificate ID (PRS-CERT-...), Worker Name, Worker ID..."
            className="bg-transparent text-xs text-[#14213D] focus:outline-none w-full placeholder:text-[#7A8793]"
          />
          <button type="submit" className="text-xs font-semibold text-[#16A085] px-2">
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-[#F5F8F7] border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="ALL">All Status</option>
          <option value="VALID">Valid / Active</option>
          <option value="REVOKED">Revoked</option>
          <option value="EXPIRED">Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E1E8E6] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7A8793] text-sm">Loading certificate ledger...</div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center text-[#7A8793] text-sm">
            No certificates found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F5F8F7]/80 border-b border-[#E1E8E6] text-[#7A8793] uppercase font-bold tracking-wider text-[10px]">
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Worker Details</th>
                  <th className="py-3 px-4">Qualification Module</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E8E6]/60">
                {certificates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#16A085]">{c.certificateId}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#14213D]">{c.workerName}</div>
                      <div className="text-[10px] text-[#7A8793]">
                        {c.workerId} • {c.organizationName}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#14213D]">{c.moduleTitle}</td>
                    <td className="py-3.5 px-4 font-bold text-[#14213D]">{c.score}%</td>
                    <td className="py-3.5 px-4 text-[#7A8793]">
                      {new Date(c.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'VALID'
                            ? 'bg-[#EAFAF1] text-[#27AE60]'
                            : c.status === 'EXPIRED'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {c.status === 'VALID' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <ShieldAlert className="w-3 h-3" />
                        )}
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedCert(c)}
                          className="p-1.5 text-[#14213D] hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Certificate Details & QR"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Download PDF */}
                        <button
                          onClick={() => handleDownloadPdf(c.certificateId)}
                          className="p-1.5 text-[#16A085] hover:bg-[#E8F8F5] rounded-lg transition-colors"
                          title="Download Certificate PDF"
                        >
                          <FileDown className="w-4 h-4" />
                        </button>

                        {/* Public Verify Link */}
                        <a
                          href={`/verify/${c.certificateId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-[#7A8793] hover:text-[#16A085] hover:bg-[#E8F8F5] rounded-lg transition-colors"
                          title="Open Public QR Verification"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* Revoke Button */}
                        {c.status === 'VALID' && (
                          <button
                            onClick={() => {
                              setRevokeTarget(c);
                              setRevokeReason('Compliance review or regulatory update');
                            }}
                            className="p-1.5 text-[#7A8793] hover:text-[#E74C3C] hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revoke Certificate"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Certificate Details Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-[#E1E8E6] shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E6]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E8F8F5] text-[#16A085] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#14213D] text-sm">Certificate Record Details</h3>
                  <p className="text-[10px] text-[#7A8793] font-mono">{selectedCert.certificateId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 text-[#7A8793] hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#F8FAF9] rounded-2xl border border-[#E1E8E6]">
              {selectedCert.qrCodeDataUrl ? (
                <img
                  src={selectedCert.qrCodeDataUrl}
                  alt="QR Code"
                  className="w-32 h-32 rounded-xl bg-white p-2 border border-[#E1E8E6] shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-white flex items-center justify-center border border-[#E1E8E6]">
                  <QrCode className="w-16 h-16 text-[#7A8793]" />
                </div>
              )}

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[#7A8793] text-[10px] uppercase font-bold block">Worker</span>
                  <span className="font-bold text-[#14213D]">{selectedCert.workerName}</span>
                  <span className="text-[#7A8793] ml-1">({selectedCert.workerId})</span>
                </div>
                <div>
                  <span className="text-[#7A8793] text-[10px] uppercase font-bold block">Qualification</span>
                  <span className="font-semibold text-[#14213D]">{selectedCert.moduleTitle}</span>
                </div>
                <div>
                  <span className="text-[#7A8793] text-[10px] uppercase font-bold block">Score</span>
                  <span className="font-bold text-[#16A085]">{selectedCert.score}% — Passed</span>
                </div>
                <div>
                  <span className="text-[#7A8793] text-[10px] uppercase font-bold block">Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedCert.status === 'VALID'
                        ? 'bg-[#EAFAF1] text-[#27AE60]'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {selectedCert.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E1E8E6]">
                <span className="text-[10px] text-[#7A8793] uppercase font-bold block">Issue Date</span>
                <span className="font-medium text-[#14213D]">
                  {new Date(selectedCert.issueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E1E8E6]">
                <span className="text-[10px] text-[#7A8793] uppercase font-bold block">Organization</span>
                <span className="font-medium text-[#14213D] truncate block">
                  {selectedCert.organizationName}
                </span>
              </div>
            </div>

            {selectedCert.revocationReason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                <strong>Revocation Reason:</strong> {selectedCert.revocationReason}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href={`/verify/${selectedCert.certificateId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#16A085] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Public Registry View
              </a>

              <button
                onClick={() => handleDownloadPdf(selectedCert.certificateId)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#16A085] text-white px-4 py-2 rounded-xl shadow-sm hover:bg-[#138A72]"
              >
                <FileDown className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revocation Modal */}
      {revokeTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E1E8E6] shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-[#E74C3C]">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="font-bold text-[#14213D] text-base">Revoke Safety Certificate</h3>
            </div>

            <p className="text-xs text-[#7A8793]">
              Are you sure you want to revoke certificate{' '}
              <strong className="text-[#14213D]">{revokeTarget.certificateId}</strong> issued to{' '}
              <strong className="text-[#14213D]">{revokeTarget.workerName}</strong>?
            </p>

            <form onSubmit={handleRevokeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">Official Revocation Reason</label>
                <textarea
                  required
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Safety standard refresher not completed / compliance review"
                  className="w-full bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl p-2.5 text-xs text-[#14213D] focus:outline-none focus:border-[#E74C3C]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRevokeTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A8793]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E74C3C] hover:bg-[#C0392B] text-white text-xs font-semibold rounded-xl"
                >
                  Confirm Revocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
