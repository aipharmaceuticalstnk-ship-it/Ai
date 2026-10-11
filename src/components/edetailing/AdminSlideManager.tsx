import React, { useState } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  FileImage,
  Eye,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { TherapeuticCategory } from '../../types/pharma';

export const AdminSlideManager: React.FC = () => {
  const { slides, brands, addSlide, deleteSlide, currentUser, startDetailingSession } = usePharma();

  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Slide Form State
  const [brandId, setBrandId] = useState<string>(brands[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [talkingPointsText, setTalkingPointsText] = useState<string>('');
  const [clinicalTrials, setClinicalTrials] = useState<string>('');
  const [dosageRecommendation, setDosageRecommendation] = useState<string>('');
  const [objectionCountersText, setObjectionCountersText] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  // Handle JPEG / Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid JPEG or image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be below 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading uploaded image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setUploadError('Please upload a slide JPEG image or provide a valid visual aid asset.');
      return;
    }

    const brand = brands.find((b) => b.id === brandId) || brands[0];
    const talkingPoints = talkingPointsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const objectionCounters = objectionCountersText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    addSlide({
      brandId: brand.id,
      brandName: brand.name,
      category: brand.category,
      pageNumber: Number(pageNumber) || 1,
      title: title || `${brand.name} Clinical Detailing Page ${pageNumber}`,
      imageUrl: imagePreview,
      clinicalTalkingPoints:
        talkingPoints.length > 0
          ? talkingPoints
          : [`Demonstrates primary efficacy endpoint for ${brand.name}`],
      clinicalTrials: clinicalTrials || 'Phase III Randomized Clinical Trial',
      dosageRecommendation: dosageRecommendation || 'As prescribed by physician',
      doctorObjectionCounters: objectionCounters,
      uploadedBy: `${currentUser.name} (${currentUser.role})`,
    });

    // Reset Form
    setTitle('');
    setImagePreview('');
    setTalkingPointsText('');
    setClinicalTrials('');
    setDosageRecommendation('');
    setObjectionCountersText('');
    setIsAddModalOpen(false);
  };

  const filteredSlides =
    selectedBrandFilter === 'ALL'
      ? slides
      : slides.filter((s) => s.brandId === selectedBrandFilter);

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            e-Detailing Slide Decks & Visual Aids
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin repository for approved JPEG visual aid slides, clinical claims, and talking points for field MRs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => startDetailingSession()}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-teal-600" />
            <span>Launch Presentation Mode</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add JPEG Detailing Page</span>
          </button>
        </div>
      </div>

      {/* Brand Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedBrandFilter('ALL')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedBrandFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Brands ({slides.length})
          </button>
          {brands.map((b) => {
            const count = slides.filter((s) => s.brandId === b.id).length;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBrandFilter(b.id)}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedBrandFilter === b.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {b.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredSlides.length}</span> visual aid slides
        </div>
      </div>

      {/* Slide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredSlides.map((slide) => (
          <div
            key={slide.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Slide Image Preview Container */}
            <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden group">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded">
                Page {slide.pageNumber} · {slide.brandName}
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => startDetailingSession(undefined, slide.brandId)}
                  className="p-1.5 bg-slate-900/80 hover:bg-teal-600 text-white rounded backdrop-blur transition-colors"
                  title="Test in Presentation Mode"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSlide(slide.id)}
                  className="p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded backdrop-blur transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Metadata & Talking Points */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{slide.category}</span>
                  <span>·</span>
                  <span>Uploaded {slide.createdAt}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {slide.title}
                </h3>
              </div>

              {/* Talking Points Preview */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 text-[11px] block">
                  Field Talking Points:
                </span>
                <ul className="space-y-1">
                  {slide.clinicalTalkingPoints.slice(0, 2).map((tp, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-teal-600 font-bold shrink-0">·</span>
                      <span className="line-clamp-2">{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span>By: {slide.uploadedBy}</span>
                <span className="text-teal-600 font-medium">Ready for Field Force</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Slide Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 text-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <FileImage className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Add New Detailing Visual Aid Page
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSlide} className="space-y-4 text-xs">
              {uploadError && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Brand and Page Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Brand *
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                    required
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.category})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Slide Page Order / Number *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500 font-mono tabular-nums"
                    required
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Slide Headline / Clinical Focus *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clinical Superiority over Standard of Care in Phase III Study"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              {/* JPEG Image Upload Area */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Detailing Page JPEG / Image *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-teal-500 transition-colors bg-slate-50">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="aspect-[16/9] max-h-48 rounded-lg overflow-hidden border border-slate-200 mx-auto shadow-inner bg-slate-900">
                        <img
                          src={imagePreview}
                          alt="Uploaded Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-teal-700 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Image Loaded Successfully
                        </span>
                        <label className="cursor-pointer text-slate-500 hover:text-slate-800 underline">
                          Replace Image
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-700 font-medium">
                        Drag and drop slide JPEG here, or click to browse
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        High-resolution 16:9 JPEG visual aids recommended (up to 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="mt-3 block mx-auto text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Talking Points */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Talking Points for Medical Representative (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Reduces 24-hr systolic blood pressure by 21 mmHg&#10;Superior renal protection with sustained GFR preservation&#10;Significant 32% drop in re-hospitalization rates`}
                  value={talkingPointsText}
                  onChange={(e) => setTalkingPointsText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-teal-500 font-sans"
                />
              </div>

              {/* Trial & Regimen */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clinical Trial Citation / Evidence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PARADIGM Pivotal Trial (n=1021, p < 0.001)"
                    value={clinicalTrials}
                    onChange={(e) => setClinicalTrials(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dosage & Regimen Guidance
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Tablet once daily before breakfast"
                    value={dosageRecommendation}
                    onChange={(e) => setDosageRecommendation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Doctor Objection Counters */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Doctor Objection Counters & FAQ (one per line)
                </label>
                <textarea
                  rows={2}
                  placeholder="Doctor concern: Is it safe in elderly? -> Extensively validated in patients 65+ with no dosage adjustment required."
                  value={objectionCountersText}
                  onChange={(e) => setObjectionCountersText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Submit Buttons */}
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
                  Save & Publish Detailing Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
