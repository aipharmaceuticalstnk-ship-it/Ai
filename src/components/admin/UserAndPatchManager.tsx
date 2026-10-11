import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Plus,
  Shield,
  Briefcase,
  Target,
  Edit,
  Trash2,
  CheckCircle,
  Building,
  UserCheck,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { User, Patch, UserRole } from '../../types/pharma';

export const UserAndPatchManager: React.FC = () => {
  const {
    users,
    addUser,
    updateUser,
    deleteUser,
    patches,
    addPatch,
    updatePatch,
    deletePatch,
    currentUser,
  } = usePharma();

  const [activeTab, setActiveTab] = useState<'USERS' | 'PATCHES'>('USERS');

  // User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('MR');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userPatchId, setUserPatchId] = useState<string>(patches[0]?.id || '');
  const [userHq, setUserHq] = useState<string>('Delhi NCR');
  const [userTargetRev, setUserTargetRev] = useState<number>(1800000);
  const [userTargetCalls, setUserTargetCalls] = useState<number>(220);

  // Patch Modal
  const [isPatchModalOpen, setIsPatchModalOpen] = useState<boolean>(false);
  const [patchCode, setPatchCode] = useState<string>('');
  const [patchName, setPatchName] = useState<string>('');
  const [patchCity, setPatchCity] = useState<string>('');
  const [patchRegion, setPatchRegion] = useState<string>('North');
  const [patchSpecialty, setPatchSpecialty] = useState<string>('Cardiology & Diabetology');
  const [patchDoctorCount, setPatchDoctorCount] = useState<number>(45);
  const [patchKolCount, setPatchKolCount] = useState<number>(12);
  const [patchSalesTarget, setPatchSalesTarget] = useState<number>(1800000);
  const [patchAssignedMrId, setPatchAssignedMrId] = useState<string>('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedPatch = patches.find((p) => p.id === userPatchId);

    addUser({
      name: userName,
      email: userEmail,
      role: userRole,
      phone: userPhone || '+91 98000 00000',
      patchId: userRole === 'MR' ? assignedPatch?.id : undefined,
      patchName: userRole === 'MR' ? assignedPatch?.name : undefined,
      hqLocation: userHq,
      monthlyTargetRevenue: Number(userTargetRev) || 1500000,
      monthlyTargetCalls: Number(userTargetCalls) || 200,
      status: 'ACTIVE',
    });

    // Update patch assignment if MR
    if (userRole === 'MR' && assignedPatch) {
      updatePatch({
        ...assignedPatch,
        assignedMrName: userName,
      });
    }

    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setIsUserModalOpen(false);
  };

  const handleCreatePatch = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedUser = users.find((u) => u.id === patchAssignedMrId);

    addPatch({
      code: patchCode || `PTC-${Date.now().toString().slice(-4)}`,
      name: patchName,
      city: patchCity,
      region: patchRegion,
      assignedMrId: assignedUser?.id,
      assignedMrName: assignedUser ? assignedUser.name : 'Unassigned (Open Patch)',
      totalDoctors: Number(patchDoctorCount) || 30,
      kolDoctorCount: Number(patchKolCount) || 8,
      monthlySalesTarget: Number(patchSalesTarget) || 1500000,
      salesAchieved: 0,
      specialtyFocus: patchSpecialty,
    });

    setPatchCode('');
    setPatchName('');
    setPatchCity('');
    setIsPatchModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Field Force Users & Territory Patches
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin governance for Medical Representatives (MR), Area Managers (ASM), sales targets, and patch allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'USERS' ? (
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPatchModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Define New Patch</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'USERS'
              ? 'border-teal-600 text-teal-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Field Force ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('PATCHES')}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'PATCHES'
              ? 'border-teal-600 text-teal-700 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Territory Patches & Beats ({patches.length})</span>
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === 'USERS' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-3">Headquarters / Location</th>
                  <th className="py-3 px-3">Assigned Patch / Beat</th>
                  <th className="py-3 px-3 text-right">Monthly Sales Target</th>
                  <th className="py-3 px-3 text-right">Call Target</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {currentUser.id === u.id && (
                              <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className={`font-semibold ${
                              u.role === 'ADMIN'
                                ? 'text-purple-700'
                                : u.role === 'ASM'
                                ? 'text-blue-700'
                                : 'text-emerald-700'
                            }`}>
                              {u.role === 'ADMIN' ? 'Headquarters Admin' : u.role === 'ASM' ? 'Area Sales Manager' : 'Medical Representative (MR)'}
                            </span>
                            <span>·</span>
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.hqLocation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {u.patchName ? (
                        <span className="font-medium text-slate-900">{u.patchName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Regional / Pan-India</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                      ₹{u.monthlyTargetRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {u.monthlyTargetCalls > 0 ? `${u.monthlyTargetCalls} visits` : '—'}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-600">
                      {u.phone}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {currentUser.id !== u.id && (
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PATCHES TAB */}
      {activeTab === 'PATCHES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {patches.map((patch) => {
            const achievementRate = Math.round(
              (patch.salesAchieved / (patch.monthlySalesTarget || 1)) * 100
            );

            return (
              <div
                key={patch.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {patch.code}
                    </span>
                    <span>{patch.city} · {patch.region} Zone</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">
                    {patch.name}
                  </h3>

                  <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Specialty Focus: {patch.specialtyFocus}</span>
                  </div>

                  {/* Representative Tag */}
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Assigned Medical Rep:</span>
                        <span className="font-semibold text-slate-900">
                          {patch.assignedMrName || 'Unassigned'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Doctor Density:</span>
                      <span className="font-medium text-slate-800">
                        {patch.totalDoctors} Total ({patch.kolDoctorCount} KOLs)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sales Achievement Progress */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sales Achievement</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      ₹{patch.salesAchieved.toLocaleString()} / ₹{patch.monthlySalesTarget.toLocaleString()} ({achievementRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all"
                      style={{ width: `${Math.min(100, achievementRate)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Create Field Force User</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                  <select
                    value={userRole}
                    onChange={(e: any) => setUserRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="MR">Medical Representative (MR)</option>
                    <option value="ASM">Area Sales Manager (ASM)</option>
                    <option value="ADMIN">Corporate Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. rahul.verma@aurapharma.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile / Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98123 45678"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters Location</label>
                  <input
                    type="text"
                    placeholder="e.g. South Delhi Hub"
                    value={userHq}
                    onChange={(e) => setUserHq(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {userRole === 'MR' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Patch / Territory Beat *</label>
                  <select
                    value={userPatchId}
                    onChange={(e) => setUserPatchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    {patches.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Revenue Target ₹</label>
                  <input
                    type="number"
                    step="50000"
                    value={userTargetRev}
                    onChange={(e) => setUserTargetRev(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Call Target (Visits)</label>
                  <input
                    type="number"
                    value={userTargetCalls}
                    onChange={(e) => setUserTargetCalls(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Define Patch Modal */}
      {isPatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Define New Territory Patch</h3>
              <button
                onClick={() => setIsPatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patch Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. DEL-SW-05"
                    value={patchCode}
                    onChange={(e) => setPatchCode(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patch Name / Beat *</label>
                  <input
                    type="text"
                    placeholder="e.g. South West Delhi - Super Clinics"
                    value={patchName}
                    onChange={(e) => setPatchName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Hub *</label>
                  <input
                    type="text"
                    placeholder="e.g. New Delhi"
                    value={patchCity}
                    onChange={(e) => setPatchCity(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Region</label>
                  <select
                    value={patchRegion}
                    onChange={(e) => setPatchRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="North">North Zone</option>
                    <option value="South">South Zone</option>
                    <option value="West">West Zone</option>
                    <option value="East">East Zone</option>
                    <option value="Central">Central Zone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialty Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Interventional Cardiology & Critical Care"
                  value={patchSpecialty}
                  onChange={(e) => setPatchSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Count in Patch</label>
                  <input
                    type="number"
                    value={patchDoctorCount}
                    onChange={(e) => setPatchDoctorCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KOL Doctors</label>
                  <input
                    type="number"
                    value={patchKolCount}
                    onChange={(e) => setPatchKolCount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Sales Target ₹</label>
                <input
                  type="number"
                  step="50000"
                  value={patchSalesTarget}
                  onChange={(e) => setPatchSalesTarget(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Designated Representative</label>
                <select
                  value={patchAssignedMrId}
                  onChange={(e) => setPatchAssignedMrId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  <option value="">Leave Unassigned (Open Patch)</option>
                  {users
                    .filter((u) => u.role === 'MR')
                    .map((mr) => (
                      <option key={mr.id} value={mr.id}>
                        {mr.name} ({mr.hqLocation})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Save Patch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
