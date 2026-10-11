import React, { useState } from 'react';
import {
  Search,
  Plus,
  Play,
  Calendar,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Award,
  Stethoscope,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { Doctor } from '../../types/pharma';

export const DoctorDirectory: React.FC = () => {
  const { doctors, patches, brands, addDoctor, updateDoctor, startDetailingSession } = usePharma();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [filterPatch, setFilterPatch] = useState<string>('ALL');
  const [filterKolOnly, setFilterKolOnly] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Doctor Form
  const [name, setName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [qualifications, setQualifications] = useState<string>('');
  const [hospital, setHospital] = useState<string>('');
  const [patchId, setPatchId] = useState<string>(patches[0]?.id || '');
  const [specialty, setSpecialty] = useState<string>('Cardiologist');
  const [isKol, setIsKol] = useState<boolean>(false);
  const [tier, setTier] = useState<Doctor['tier']>('Tier A (KOL)');
  const [prescribingPotential, setPrescribingPotential] = useState<Doctor['prescribingPotential']>('High');
  const [monthlyTargetFrequency, setMonthlyTargetFrequency] = useState<number>(3);
  const [preferredTime, setPreferredTime] = useState<string>('1:00 PM - 2:00 PM');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    const patch = patches.find((p) => p.id === patchId) || patches[0];

    addDoctor({
      name,
      title: title || `${specialty} Specialist`,
      qualifications: qualifications || 'MBBS, MD',
      hospital: hospital || 'Specialty Polyclinic',
      patchId: patch.id,
      patchName: patch.name,
      specialty,
      isKol,
      tier,
      prescribingPotential,
      monthlyTargetFrequency: Number(monthlyTargetFrequency) || 2,
      completedCallsThisMonth: 0,
      lastVisitedDate: 'Never',
      preferredTime,
      phone: phone || '+91 98000 00000',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@clinic.com`,
      notes,
      preferredBrands: selectedBrands.length > 0 ? selectedBrands : [brands[0]?.name || 'CorVasc'],
    });

    // Reset
    setName('');
    setTitle('');
    setQualifications('');
    setHospital('');
    setIsKol(false);
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'ALL' || doc.tier === filterTier;
    const matchesPatch = filterPatch === 'ALL' || doc.patchId === filterPatch;
    const matchesKol = !filterKolOnly || doc.isKol;
    return matchesSearch && matchesTier && matchesPatch && matchesKol;
  });

  // Calculate compliance statistics
  const totalDoctorsCount = doctors.length;
  const kolCount = doctors.filter((d) => d.isKol).length;
  const metFrequencyCount = doctors.filter((d) => d.completedCallsThisMonth >= d.monthlyTargetFrequency).length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Doctors & KOL Network
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Key Opinion Leader (KOL) tiering, monthly call frequency compliance, and direct e-detailing launch.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor to Patch</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Active Doctors</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalDoctorsCount}
            </span>
            <span className="text-xs text-slate-500">Across {patches.length} Patches</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Key Opinion Leaders (KOLs)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
              {kolCount}
            </span>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
              Priority Tier A
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Monthly Call Frequency Compliance</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-teal-600 font-mono tabular-nums">
              {Math.round((metFrequencyCount / (totalDoctorsCount || 1)) * 100)}%
            </span>
            <span className="text-xs text-slate-500">
              {metFrequencyCount} / {totalDoctorsCount} Completed Targets
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* KOL Toggle */}
          <button
            onClick={() => setFilterKolOnly(!filterKolOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              filterKolOnly
                ? 'bg-amber-500 text-white border-amber-600 font-medium'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>KOL Doctors Only</span>
          </button>

          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="Tier A (KOL)">Tier A (KOL)</option>
            <option value="Tier B (Core)">Tier B (Core)</option>
            <option value="Tier C (Support)">Tier C (Support)</option>
          </select>

          {/* Patch Filter */}
          <select
            value={filterPatch}
            onChange={(e) => setFilterPatch(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Patches</option>
            {patches.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Doctor & Affiliation</th>
                <th className="py-3 px-3">Classification & Tier</th>
                <th className="py-3 px-3">Patch / Territory</th>
                <th className="py-3 px-3">Monthly Call Frequency</th>
                <th className="py-3 px-3">Last Visit</th>
                <th className="py-3 px-3">Preferred Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No doctors found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => {
                  const isFrequencyMet = doc.completedCallsThisMonth >= doc.monthlyTargetFrequency;
                  const compliancePercent = Math.min(
                    100,
                    Math.round((doc.completedCallsThisMonth / doc.monthlyTargetFrequency) * 100)
                  );

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Doctor Name & Credentials */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className={`p-2 rounded-lg shrink-0 ${doc.isKol ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'}`}>
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                              <span>{doc.name}</span>
                              {doc.isKol && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded inline-flex items-center gap-0.5">
                                  <Award className="w-3 h-3" /> KOL
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {doc.title} · {doc.qualifications}
                            </div>
                            <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{doc.hospital}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier & Specialty */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <span className={`font-semibold text-[11px] ${
                            doc.tier.includes('KOL')
                              ? 'text-amber-700'
                              : doc.tier.includes('Core')
                              ? 'text-teal-700'
                              : 'text-slate-600'
                          }`}>
                            {doc.tier}
                          </span>
                          <div className="text-slate-500 text-[11px]">{doc.specialty}</div>
                          <div className="text-slate-400 text-[10px]">
                            Potential: <span className="font-semibold text-slate-700">{doc.prescribingPotential}</span>
                          </div>
                        </div>
                      </td>

                      {/* Patch */}
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-800">{doc.patchName}</span>
                      </td>

                      {/* Frequency */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                            <span className="font-semibold text-slate-900">
                              {doc.completedCallsThisMonth} / {doc.monthlyTargetFrequency} calls
                            </span>
                            <span className={`text-[11px] font-bold ${isFrequencyMet ? 'text-teal-600' : 'text-amber-600'}`}>
                              {compliancePercent}%
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${isFrequencyMet ? 'bg-teal-500' : 'bg-amber-500'}`}
                              style={{ width: `${compliancePercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {isFrequencyMet ? (
                              <span className="text-teal-600 font-medium flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Met Target
                              </span>
                            ) : (
                              <span>{doc.monthlyTargetFrequency - doc.completedCallsThisMonth} visits remaining</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Last Visited */}
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-600">
                        {doc.lastVisitedDate}
                      </td>

                      {/* Preferred Time */}
                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{doc.preferredTime}</span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => startDetailingSession(doc)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
                        >
                          <Play className="w-3 h-3 fill-white" />
                          <span>Detail Doctor</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Doctor & Target Frequency</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ramesh Chander"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MD, DM (Cardio), FACC"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialty *</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Endocrinologist">Endocrinologist / Diabetologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                    <option value="Critical Care / Pulmonology">Critical Care / Pulmonology</option>
                    <option value="General Physician">General Physician / Internal Med</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Super Speciality Hospital"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patch / Beat *</label>
                  <select
                    value={patchId}
                    onChange={(e) => setPatchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    {patches.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Tier</label>
                  <select
                    value={tier}
                    onChange={(e: any) => setTier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Tier A (KOL)">Tier A (KOL)</option>
                    <option value="Tier B (Core)">Tier B (Core)</option>
                    <option value="Tier C (Support)">Tier C (Support)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Calls / Month</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={monthlyTargetFrequency}
                    onChange={(e) => setMonthlyTargetFrequency(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* KOL Checkbox */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <input
                  type="checkbox"
                  id="isKolCheck"
                  checked={isKol}
                  onChange={(e) => setIsKol(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="isKolCheck" className="text-amber-900 font-medium">
                  Designate as Key Opinion Leader (KOL)
                </label>
              </div>

              {/* Timing and Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Visiting Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 1:30 PM - 2:30 PM (Lunch Recess)"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone / Mobile</label>
                  <input
                    type="text"
                    placeholder="+91 98111 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prescriber Profile Notes</label>
                <textarea
                  rows={2}
                  placeholder="Doctor interests, clinical research involvement, competitor preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
