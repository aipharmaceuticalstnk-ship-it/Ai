import React, { useState } from 'react';
import {
  Package,
  Plus,
  Send,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Layers,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { TherapeuticCategory } from '../../types/pharma';

export const SampleManager: React.FC = () => {
  const { samples, brands, addSampleBatch, recordSampleDistribution, currentUser } = usePharma();

  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState<boolean>(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState<boolean>(false);

  // New Batch Form
  const [brandId, setBrandId] = useState<string>(brands[0]?.id || '');
  const [batchNumber, setBatchNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('2028-12-31');
  const [allocatedQuantity, setAllocatedQuantity] = useState<number>(100);
  const [unitLabel, setUnitLabel] = useState<string>('Catch covers (4 tabs)');

  // Distribute Modal
  const [distributeBrandName, setDistributeBrandName] = useState<string>(samples[0]?.brandName || '');
  const [distributeQty, setDistributeQty] = useState<number>(5);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = brands.find((b) => b.id === brandId) || brands[0];

    addSampleBatch({
      brandId: brand.id,
      brandName: brand.name,
      category: brand.category,
      batchNumber: batchNumber || `BCH-${Date.now().toString().slice(-4)}`,
      expiryDate,
      allocatedToMr: Number(allocatedQuantity) || 100,
      distributedToDoctors: 0,
      inBagBalance: Number(allocatedQuantity) || 100,
      unitLabel: unitLabel || 'Physician Samples',
    });

    setBatchNumber('');
    setIsAddBatchModalOpen(false);
  };

  const handleDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distributeBrandName || distributeQty <= 0) return;
    recordSampleDistribution(distributeBrandName, Number(distributeQty));
    setIsDistributeModalOpen(false);
  };

  const totalInBag = samples.reduce((acc, s) => acc + s.inBagBalance, 0);
  const totalDistributed = samples.reduce((acc, s) => acc + s.distributedToDoctors, 0);
  const totalAllocated = samples.reduce((acc, s) => acc + s.allocatedToMr, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Physician Samples & Rep Bag Inventory
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Track sample catch covers issued to Medical Representatives, doctor sampling compliance, and batch expiration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDistributeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Send className="w-4 h-4 text-teal-600" />
            <span>Record Sampling Drop</span>
          </button>
          <button
            onClick={() => setIsAddBatchModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Sample Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Samples in Rep Bag</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-teal-600 font-mono tabular-nums">
              {totalInBag}
            </span>
            <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium">
              Ready for Field
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Distributed to Doctors</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalDistributed}
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {Math.round((totalDistributed / (totalAllocated || 1)) * 100)}% Utilization
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Issued by Admin</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {totalAllocated}
            </span>
            <span className="text-xs text-slate-500">{samples.length} Active Batches</span>
          </div>
        </div>
      </div>

      {/* Sample Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Brand & Unit Specification</th>
                <th className="py-3 px-3">Therapeutic Category</th>
                <th className="py-3 px-3">Batch Number</th>
                <th className="py-3 px-3">Expiry Date</th>
                <th className="py-3 px-3 text-right">Allocated to MR</th>
                <th className="py-3 px-3 text-right">Given to Doctors</th>
                <th className="py-3 px-3 text-right">In-Bag Balance</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {samples.map((s) => {
                const percentUsed = Math.round((s.distributedToDoctors / (s.allocatedToMr || 1)) * 100);
                const isLow = s.inBagBalance < 30;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{s.brandName}</div>
                          <div className="text-[11px] text-slate-500">{s.unitLabel}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-slate-600">{s.category}</span>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-medium text-slate-900">
                      {s.batchNumber}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-600">
                      {s.expiryDate}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-600">
                      {s.allocatedToMr}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-900 font-semibold">
                      {s.distributedToDoctors} ({percentUsed}%)
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      <span className={`font-bold ${isLow ? 'text-amber-600' : 'text-teal-700'}`}>
                        {s.inBagBalance}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          <AlertCircle className="w-3 h-3" /> Reorder Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Sufficient Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Batch Modal */}
      {isAddBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Issue New Sample Batch</h3>
              <button
                onClick={() => setIsAddBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Brand *</label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    placeholder="e.g. CV-26X01"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={allocatedQuantity}
                    onChange={(e) => setAllocatedQuantity(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Catch covers (4 tabs)"
                    value={unitLabel}
                    onChange={(e) => setUnitLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddBatchModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Issue to Field Force
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Distribute Drop Modal */}
      {isDistributeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 text-slate-900 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Record Doctor Sampling Drop</h3>
              <button
                onClick={() => setIsDistributeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDistribute} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Sample Brand *</label>
                <select
                  value={distributeBrandName}
                  onChange={(e) => setDistributeBrandName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                >
                  {samples.map((s) => (
                    <option key={s.id} value={s.brandName}>
                      {s.brandName} (Bag Balance: {s.inBagBalance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Dropped</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={distributeQty}
                  onChange={(e) => setDistributeQty(Number(e.target.value))}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDistributeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-xs"
                >
                  Deduct from Bag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
