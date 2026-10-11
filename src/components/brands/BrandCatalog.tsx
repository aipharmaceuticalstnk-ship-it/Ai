import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Play,
  Layers,
  CheckCircle,
  Package,
  Pill,
  TrendingUp,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { Brand, TherapeuticCategory } from '../../types/pharma';

const CATEGORIES: TherapeuticCategory[] = [
  'Cardiovascular & Hypertension',
  'Diabetology & Metabolic',
  'Anti-Infectives & Critical Care',
  'Gastroenterology & Hepatology',
  'Respiratory & Pulmonology',
];

export const BrandCatalog: React.FC = () => {
  const { brands, addBrand, startDetailingSession, slides, samples } = usePharma();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Brand Form State
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<TherapeuticCategory>('Cardiovascular & Hypertension');
  const [genericComposition, setGenericComposition] = useState<string>('');
  const [dosageForm, setDosageForm] = useState<string>('Film Coated Tablet');
  const [packSize, setPackSize] = useState<string>('10 x 10 Blister Pack');
  const [mrp, setMrp] = useState<number>(450);
  const [ptr, setPtr] = useState<number>(335);
  const [indicationsText, setIndicationsText] = useState<string>('');
  const [benefitsText, setBenefitsText] = useState<string>('');
  const [monthlyTargetUnits, setMonthlyTargetUnits] = useState<number>(1000);

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    const keyIndications = indicationsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const keyBenefits = benefitsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addBrand({
      name,
      category,
      genericComposition,
      dosageForm,
      packSize,
      mrp: Number(mrp) || 0,
      ptr: Number(ptr) || 0,
      keyIndications: keyIndications.length > 0 ? keyIndications : ['General therapeutic indication'],
      keyBenefits: keyBenefits.length > 0 ? benefitsText.split('\n') : ['High clinical efficacy & bioavailability'],
      slideCount: 0,
      monthlyTargetUnits: Number(monthlyTargetUnits) || 1000,
      achievedUnits: 0,
    });

    setName('');
    setGenericComposition('');
    setIndicationsText('');
    setBenefitsText('');
    setIsAddModalOpen(false);
  };

  const filteredBrands =
    selectedCategory === 'ALL'
      ? brands
      : brands.filter((b) => b.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Category-Wise Pharmaceutical Brands
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Therapeutic classifications, molecules, PTR/MRP margins, linked visual aid slides, and unit targets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
            selectedCategory === 'ALL'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Categories ({brands.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = brands.filter((b) => b.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBrands.map((brand) => {
          const brandSlides = slides.filter((s) => s.brandId === brand.id);
          const brandSample = samples.find((s) => s.brandId === brand.id);
          const achievementRatio = Math.round(
            (brand.achievedUnits / (brand.monthlyTargetUnits || 1)) * 100
          );

          return (
            <div
              key={brand.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Category & Name Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
                      {brand.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {brand.genericComposition}
                    </p>
                  </div>

                  <button
                    onClick={() => startDetailingSession(undefined, brand.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
                    title="Launch e-Detailing for this brand"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Detail Brand</span>
                  </button>
                </div>

                {/* Form & Pricing Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50 rounded-lg text-xs border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Dosage Form:</span>
                    <span className="font-medium text-slate-800">{brand.dosageForm}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Packaging:</span>
                    <span className="font-medium text-slate-800">{brand.packSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pricing (PTR / MRP):</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      ₹{brand.ptr} / ₹{brand.mrp}
                    </span>
                  </div>
                </div>

                {/* Key Indications */}
                <div className="mt-4 space-y-1 text-xs">
                  <span className="font-semibold text-slate-700 text-[11px] block">
                    Core Approved Clinical Indications:
                  </span>
                  <ul className="space-y-1 text-slate-600">
                    {brand.keyIndications.map((ind, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold shrink-0">·</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Slides & Sample Bag Status Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-3 text-xs">
                {/* Units Target Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Monthly Unit Sales Target</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900">
                      {brand.achievedUnits.toLocaleString()} / {brand.monthlyTargetUnits.toLocaleString()} Units ({achievementRatio}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-teal-600 rounded-full"
                      style={{ width: `${Math.min(100, achievementRatio)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-600" />
                    <span>{brandSlides.length} Approved Detailing Slides</span>
                  </div>
                  {brandSample ? (
                    <div className="flex items-center gap-1 text-slate-700 font-mono">
                      <Package className="w-3.5 h-3.5 text-amber-600" />
                      <span>Rep Bag: {brandSample.inBagBalance} samples</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">No samples in bag</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-900">Add Pharmaceutical Brand</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Trade Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiox-XL"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Therapeutic Category *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Generic Formula / Composition *</label>
                <input
                  type="text"
                  placeholder="e.g. Telmisartan 40mg + Chlorthalidone 12.5mg"
                  value={genericComposition}
                  onChange={(e) => setGenericComposition(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <input
                    type="text"
                    placeholder="e.g. Film Coated Tablet"
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Packaging / Pack Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 x 10 Alu-Alu Blister"
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PTR (₹) *</label>
                  <input
                    type="number"
                    value={ptr}
                    onChange={(e) => setPtr(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Target (Units)</label>
                  <input
                    type="number"
                    value={monthlyTargetUnits}
                    onChange={(e) => setMonthlyTargetUnits(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Clinical Indications (one per line)</label>
                <textarea
                  rows={2}
                  placeholder={`Stage II Essential Hypertension&#10;Diabetic Nephropathy`}
                  value={indicationsText}
                  onChange={(e) => setIndicationsText(e.target.value)}
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
