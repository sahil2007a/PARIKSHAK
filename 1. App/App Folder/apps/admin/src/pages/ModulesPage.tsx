import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Flame, Wind, Settings, HardHat, AlertTriangle, Layers, Edit, Database, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/api';

const getModuleIcon = (category: string, moduleNumber: number) => {
  if (category === 'FIRE_SAFETY' || moduleNumber === 1) return Flame;
  if (category === 'GAS_SAFETY' || moduleNumber === 2) return Wind;
  if (category === 'MACHINERY' || moduleNumber === 3) return Settings;
  if (category === 'PPE' || moduleNumber === 4) return HardHat;
  if (category === 'EMERGENCY' || moduleNumber === 5) return AlertTriangle;
  return Layers;
};

export const ModulesPage: React.FC = () => {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSector, setNewSector] = useState('MINING');
  const [newPassingScore, setNewPassingScore] = useState(75);

  const fetchModules = useCallback(async (spinner = false) => {
    if (spinner) setIsRefreshing(true);
    try {
      const data = await adminApi.getModules();
      if (data && data.length > 0) {
        setModules(data);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    const newMod = {
      id: String(modules.length + 1),
      moduleNumber: modules.length + 1,
      title: { en: newTitle || `Advanced Safety Protocol ${modules.length + 1}` },
      sector: newSector,
      category: 'EMERGENCY',
      estimatedDurationMinutes: 25,
      passingScore: newPassingScore,
      lessonsCount: 2,
      difficulty: 'INTERMEDIATE',
      isPublished: true,
      description: { en: 'Custom authoring module created for specific heavy industrial compliance.' }
    };
    setModules([...modules, newMod]);
    setShowModal(false);
    setNewTitle('');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-[#16A085]">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-sm">Loading safety curriculum from MongoDB...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#14213D] tracking-tight">
              Curriculum & Simulation Engine Studio
            </h1>
            <div className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-semibold">
              <Database className="w-3 h-3" />
              <span>MongoDB Synced</span>
            </div>
          </div>
          <p className="text-sm text-[#7A8793] mt-0.5">
            Configure safety training modules, passing score thresholds, lesson structures, and interactive assessment drills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchModules(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E1E8E6] text-xs font-semibold text-[#14213D] rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#16A085] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#16A085] hover:bg-[#117A65] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#16A085]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Author New Module</span>
          </button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = getModuleIcon(m.category, m.moduleNumber);
          const title = typeof m.title === 'string' ? m.title : (m.title?.en || `Module ${m.moduleNumber}`);
          const description = typeof m.description === 'string' ? m.description : (m.description?.en || 'Standard industrial safety training curriculum');

          return (
            <div
              key={m.id || m._id}
              className="bg-white rounded-2xl p-6 border border-[#E1E8E6] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#16A085]/10 text-[#16A085] flex items-center justify-center border border-[#16A085]/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#F5F8F7] text-[#7A8793] rounded-full text-[10px] font-bold border border-[#E1E8E6]">
                    Module {m.moduleNumber}
                  </span>
                </div>

                <h3 className="font-bold text-[#14213D] text-base mt-4">{title}</h3>
                <p className="text-xs text-[#7A8793] mt-1.5 line-clamp-2">{description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-[#7A8793] rounded text-[10px] font-bold">
                    {m.sector || 'GENERAL'}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">
                    {m.difficulty || 'BEGINNER'}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold">
                    {m.lessonsCount || 3} Lessons
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E1E8E6] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#7A8793]">Passing Threshold: </span>
                  <span className="font-bold text-[#14213D]">{m.passingScore || 70}%</span>
                </div>

                <button className="text-xs font-semibold text-[#16A085] hover:text-[#0E6655] transition-colors flex items-center gap-1">
                  <Edit className="w-3.5 h-3.5" />
                  <span>Configure</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Module Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E1E8E6] shadow-xl space-y-4">
            <h3 className="font-bold text-[#14213D] text-lg">Author New Safety Module</h3>

            <form onSubmit={handleCreateModule} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">Module Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Electrical Arc Flash Safety"
                  className="w-full bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl px-3 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#16A085]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">Target Industrial Sector</label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl px-3 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#16A085]"
                >
                  <option value="MINING">Mining</option>
                  <option value="STEEL">Steel</option>
                  <option value="MICA">Mica</option>
                  <option value="CONSTRUCTION">Construction</option>
                  <option value="GENERAL">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1">Passing Score Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={newPassingScore}
                  onChange={(e) => setNewPassingScore(Number(e.target.value))}
                  className="w-full bg-[#F5F8F7] border border-[#E1E8E6] rounded-xl px-3 py-2 text-xs text-[#14213D] focus:outline-none focus:border-[#16A085]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E1E8E6]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#7A8793] hover:text-[#14213D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16A085] hover:bg-[#117A65] text-white text-xs font-semibold rounded-xl"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
