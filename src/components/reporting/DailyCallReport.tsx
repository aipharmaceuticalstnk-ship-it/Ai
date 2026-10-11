import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle,
  Calendar,
  Clock,
  User,
  MapPin,
  TrendingUp,
  Stethoscope,
  Filter,
  Check,
  RotateCw,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { DailyCallReport as DcrType } from '../../types/pharma';

export const DailyCallReport: React.FC = () => {
  const {
    dcrs,
    doctors,
    brands,
    samples,
    currentUser,
    addDcr,
    updateDcrStatus,
    patches,
  } = usePharma();

  const [filterDate, setFilterDate] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isAddDcrModalOpen, setIsAddDcrModalOpen] = useState<boolean>(false);

  // New DCR Form
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doctorId, setDoctorId] = useState<string>(doctors[0]?.id || '');
  const [callType, setCallType] = useState<DcrType['callType']>('Planned');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([brands[0]?.name || 'CorVasc']);
  const [pobAmount, setPobAmount] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(12);
  const [doctorFeedback, setDoctorFeedback] = useState<DcrType['doctorFeedback']>('Highly Receptive');
  const [remarks, setRemarks] = useState<string>('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [sampleQuantities, setSampleQuantities] = useState<{ [key: string]: number }>({});

  const handleCreateDcr = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];

    const samplesGiven = Object.entries(sampleQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([brandName, quantity]) => ({ brandName, quantity }));

    addDcr({
      repId: currentUser.id,
      repName: currentUser.name,
      patchId: doc.patchId,
      patchName: doc.patchName,
      date,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      isKol: doc.isKol,
      brandsDetailed: selectedBrands.length > 0 ? selectedBrands : ['CorVasc'],
      samplesGiven,
      pobAmount: Number(pobAmount) || 0,
      callType,
      durationMinutes: Number(durationMinutes) || 10,
      doctorFeedback,
      nextFollowUpDate,
      remarks: remarks || 'Doctor detailed with clinical visual aids.',
      status: 'SUBMITTED',
    });

    setRemarks('');
    setPobAmount(0);
    setIsAddDcrModalOpen(false);
  };

  const filteredDcrs = dcrs.filter((dcr) => {
    const matchesDate = !filterDate || dcr.date === filterDate;
    const matchesStatus = filterStatus === 'ALL' || dcr.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  const totalPob = filteredDcrs.reduce((acc, d) => acc + (d.pobAmount || 0), 0);
  const totalCalls = filteredDcrs.length;
  const kolCalls = filteredDcrs.filter((d) => d.isKol).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Daily Work Reporting (DCR)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Doctor field call logs, POB booking, sampling verification, and manager sign-off.
          </p>
        </div>

        <button
          onClick={() => setIsAddDcrModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Log Field Call (DCR)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Calls Reported</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalCalls}
            </span>
            <span className="text-xs text-slate-500">{kolCalls} KOL Calls</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">POB (Personal Order Booking)</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-teal-600 font-mono tabular-nums">
              ₹{totalPob.toLocaleString()}
            </span>
            <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">
              Confirmed Orders
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Average Call Duration</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalCalls > 0
                ? Math.round(
                    filteredDcrs.reduce((a, b) => a + b.durationMinutes, 0) / totalCalls
                  )
                : 0}{' '}
              mins
            </span>
            <span className="text-xs text-slate-500">In-clinic Detailing</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-teal-500"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="text-slate-400 hover:text-slate-600 underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="SUBMITTED">Submitted / Pending Review</option>
            <option value="REVIEW_REQUESTED">Review Requested</option>
          </select>
        </div>
      </div>

      {/* DCR Records List */}
      <div className="space-y-3">
        {filteredDcrs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
            No call reports found for this filter criteria.
          </div>
        ) : (
          filteredDcrs.map((dcr) => (
            <div
              key={dcr.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${dcr.isKol ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'}`}>
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{dcr.doctorName}</span>
                      {dcr.isKol && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                          KOL
                        </span>
                      )}
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-xs text-slate-500">{dcr.doctorSpecialty}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Representative: {dcr.repName}</span>
                      <span>·</span>
                      <span>Patch: {dcr.patchName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                    {dcr.date} · {dcr.durationMinutes} mins
                  </span>

                  {dcr.status === 'APPROVED' ? (
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 font-medium px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Approved
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-amber-700 bg-amber-50 font-medium px-2 py-0.5 rounded">
                        Submitted
                      </span>
                      {currentUser.role !== 'MR' && (
                        <button
                          onClick={() => updateDcrStatus(dcr.id, 'APPROVED')}
                          className="px-2 py-0.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-medium rounded transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Call Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Brands Detailed</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1 mt-0.5 flex-wrap">
                    {dcr.brandsDetailed.map((b, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px]">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Samples Given</span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {dcr.samplesGiven && dcr.samplesGiven.length > 0 ? (
                      dcr.samplesGiven.map((sg, i) => (
                        <span key={i} className="text-slate-700 block text-[11px]">
                          {sg.brandName}: {sg.quantity} units
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">POB Booking</span>
                  <span className="font-mono tabular-nums font-bold text-teal-700 text-sm mt-0.5 block">
                    ₹{dcr.pobAmount.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Doctor Feedback</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block text-[11px]">
                    {dcr.doctorFeedback}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Next visit: {dcr.nextFollowUpDate}
                  </span>
                </div>
              </div>

              {/* Remarks */}
              {dcr.remarks && (
                <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600">
                  <span className="font-semibold text-slate-700">MR Remarks: </span>
                  {dcr.remarks}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual Add DCR Modal */}
      {isAddDcrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Log Daily Call Report</h3>
              <button
                onClick={() => setIsAddDcrModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDcr} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Visit *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Call Type</label>
                  <select
                    value={callType}
                    onChange={(e: any) => setCallType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Planned">Planned Doctor Call</option>
                    <option value="Unplanned">Unplanned / Opportunity Call</option>
                    <option value="Joint Field Work with ASM">Joint Field Work with ASM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Doctor Visited *</label>
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} · {d.hospital}) {d.isKol ? '★ KOL' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Receptivity</label>
                  <select
                    value={doctorFeedback}
                    onChange={(e: any) => setDoctorFeedback(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Highly Receptive">Highly Receptive</option>
                    <option value="Requested Clinical Trial Paper">Requested Clinical Trial Paper</option>
                    <option value="Needs Follow-up">Needs Follow-up</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Competitor Loyal">Competitor Loyal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Call Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">POB (Order Booking) ₹</label>
                  <input
                    type="number"
                    step="500"
                    value={pobAmount}
                    onChange={(e) => setPobAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Sample Quantities */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Samples Distributed</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {samples.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-200">
                      <span className="truncate max-w-[130px] font-medium">{s.brandName}</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={sampleQuantities[s.brandName] || ''}
                        onChange={(e) =>
                          setSampleQuantities({
                            ...sampleQuantities,
                            [s.brandName]: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-14 bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-center font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Call Summary & Remarks</label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Clinical presentation points discussed, doctor queries, competitor brands mentioned..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddDcrModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Submit Call Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
