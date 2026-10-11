import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  PenTool,
  RotateCcw,
  BookOpen,
  FileCheck,
  CheckCircle2,
  Package,
  Layers,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { usePharma } from '../../context/PharmaContext';
import { DetailingSlide } from '../../types/pharma';

export const DetailingPlayer: React.FC = () => {
  const {
    slides,
    brands,
    detailingSession,
    closeDetailingSession,
    currentUser,
    samples,
    addDcr,
  } = usePharma();

  // Selected brand filter
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    detailingSession.brandId || 'ALL'
  );

  const filteredSlides = selectedBrandId === 'ALL'
    ? slides
    : slides.filter((s) => s.brandId === selectedBrandId);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentSlide: DetailingSlide | undefined = filteredSlides[currentIndex] || filteredSlides[0];

  // Tool states
  const [isLaserActive, setIsLaserActive] = useState<boolean>(true);
  const [isDrawActive, setIsDrawActive] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#ef4444'); // Red default
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);

  // Timers
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [slideSeconds, setSlideSeconds] = useState<number>(0);

  // Call Completion Modal
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [doctorFeedback, setDoctorFeedback] = useState<
    'Highly Receptive' | 'Requested Clinical Trial Paper' | 'Needs Follow-up' | 'Neutral' | 'Competitor Loyal'
  >('Highly Receptive');
  const [pobAmount, setPobAmount] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>('');
  const [selectedSamples, setSelectedSamples] = useState<{ [brandName: string]: number }>({});
  const [nextFollowUpDate, setNextFollowUpDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Run call duration stopwatch
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);
      setSlideSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset slide timer on slide switch
  useEffect(() => {
    setSlideSeconds(0);
    clearCanvas();
  }, [currentIndex, selectedBrandId]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Laser move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setLaserPos(null);
  };

  // Annotation Canvas Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawActive || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawColor === 'rgba(234, 179, 8, 0.4)' ? 16 : 4; // Highlighter vs pen
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawActive || !isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Setup canvas resolution to match container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          canvasRef.current.width = parent.clientWidth;
          canvasRef.current.height = parent.clientHeight;
        }
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [currentSlide]);

  const handleNext = () => {
    if (currentIndex < filteredSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinishCall = () => {
    setIsFeedbackModalOpen(true);
  };

  const handleSubmitCallReport = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = detailingSession.doctor;

    const samplesGivenArray = Object.entries(selectedSamples)
      .filter(([_, qty]) => qty > 0)
      .map(([brandName, quantity]) => ({ brandName, quantity }));

    addDcr({
      repId: currentUser.id,
      repName: currentUser.name,
      patchId: doctor ? doctor.patchId : currentUser.patchId || 'ptc-01',
      patchName: doctor ? doctor.patchName : currentUser.patchName || 'Default Patch',
      date: new Date().toISOString().split('T')[0],
      doctorId: doctor ? doctor.id : 'doc-walkin',
      doctorName: doctor ? doctor.name : 'Direct Detailing / CME Doctor',
      doctorSpecialty: doctor ? doctor.specialty : currentSlide?.category || 'General',
      isKol: doctor ? doctor.isKol : false,
      brandsDetailed: [currentSlide?.brandName || 'CorVasc'],
      samplesGiven: samplesGivenArray,
      pobAmount: Number(pobAmount) || 0,
      callType: 'Planned',
      durationMinutes: Math.max(1, Math.round(totalSeconds / 60)),
      doctorFeedback,
      nextFollowUpDate,
      remarks: remarks || `Detailed ${currentSlide?.brandName} clinical slide deck.`,
      status: 'APPROVED',
    });

    setIsFeedbackModalOpen(false);
    closeDetailingSession();
  };

  if (!currentSlide) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <p className="text-lg font-medium text-slate-300">No slides available for this selection.</p>
        <button
          onClick={closeDetailingSession}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm"
        >
          Close Session
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col select-none overflow-hidden font-sans">
      {/* Top Floating Control Bar */}
      <header className="h-14 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-tight text-sm">
              e-Detailing: {currentSlide.brandName}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">
              Slide {currentIndex + 1} of {filteredSlides.length}
            </span>
          </div>

          {/* Doctor Label if in targeted call */}
          {detailingSession.doctor && (
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
              <span className="text-slate-400">Doctor:</span>
              <span className="text-teal-400 font-medium">
                {detailingSession.doctor.name}
              </span>
              {detailingSession.doctor.isKol && (
                <span className="text-amber-400 font-semibold text-[11px]">
                  (KOL)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center: Brand Deck Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg text-xs">
          <button
            onClick={() => {
              setSelectedBrandId('ALL');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              selectedBrandId === 'ALL'
                ? 'bg-teal-600 text-white font-medium shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBrandId(b.id);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                selectedBrandId === b.id
                  ? 'bg-teal-600 text-white font-medium shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Right Tools: Timers, Laser, Annotate, Notes, End */}
        <div className="flex items-center gap-3">
          {/* Call Stopwatch */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono tabular-nums bg-slate-800/60 px-2.5 py-1 rounded border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>Total: {formatTime(totalSeconds)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Slide: {formatTime(slideSeconds)}</span>
          </div>

          {/* Interactive Tools */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLaserActive(!isLaserActive);
                if (!isLaserActive) setIsDrawActive(false);
              }}
              title="Laser Pointer"
              className={`p-1.5 rounded transition-colors ${
                isLaserActive
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsDrawActive(!isDrawActive);
                if (!isDrawActive) setIsLaserActive(false);
              }}
              title="Pen & Marker Annotations"
              className={`p-1.5 rounded transition-colors ${
                isDrawActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PenTool className="w-4 h-4" />
            </button>

            {isDrawActive && (
              <div className="flex items-center gap-1 px-1 border-l border-slate-700 ml-1">
                <button
                  onClick={() => setDrawColor('#ef4444')}
                  className={`w-3.5 h-3.5 rounded-full bg-red-500 ${
                    drawColor === '#ef4444' ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''
                  }`}
                  title="Red Pen"
                />
                <button
                  onClick={() => setDrawColor('#3b82f6')}
                  className={`w-3.5 h-3.5 rounded-full bg-blue-500 ${
                    drawColor === '#3b82f6' ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''
                  }`}
                  title="Blue Pen"
                />
                <button
                  onClick={() => setDrawColor('rgba(234, 179, 8, 0.4)')}
                  className={`w-3.5 h-3.5 rounded-full bg-yellow-400 ${
                    drawColor === 'rgba(234, 179, 8, 0.4)' ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''
                  }`}
                  title="Yellow Highlighter"
                />
                <button
                  onClick={clearCanvas}
                  className="text-slate-400 hover:text-slate-200 text-xs px-1"
                  title="Clear Ink"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setShowNotes(!showNotes)}
              title="Toggle Clinical Talking Notes"
              className={`p-1.5 rounded transition-colors ${
                showNotes
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
          </div>

          {/* End Call / Log DCR */}
          <button
            onClick={handleFinishCall}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Finish & Log DCR</span>
          </button>

          {/* Exit */}
          <button
            onClick={closeDetailingSession}
            title="Exit e-Detailing"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Slide Presentation Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Slide Canvas Area */}
        <div
          className={`flex-1 relative bg-black flex items-center justify-center p-2 overflow-hidden ${
            isLaserActive ? 'laser-cursor' : ''
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Previous Slide Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700/60 backdrop-blur transition-all ${
              currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100 hover:scale-105'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex === filteredSlides.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700/60 backdrop-blur transition-all ${
              currentIndex === filteredSlides.length - 1
                ? 'opacity-20 cursor-not-allowed'
                : 'opacity-80 hover:opacity-100 hover:scale-105'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Visual Aid Slide Container */}
          <div className="relative max-w-full max-h-full aspect-[16/9] w-auto h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-slate-800">
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Drawing Canvas Overlay */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className={`absolute inset-0 z-10 ${
                isDrawActive ? 'cursor-crosshair' : 'pointer-events-none'
              }`}
            />

            {/* Laser Pointer Simulator */}
            {isLaserActive && laserPos && (
              <div
                className="pointer-events-none fixed z-40 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: laserPos.x + (canvasRef.current?.getBoundingClientRect().left || 0),
                  top: laserPos.y + (canvasRef.current?.getBoundingClientRect().top || 0),
                }}
              >
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_16px_4px_rgba(239,68,68,0.9)] animate-ping absolute opacity-75" />
                <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-[0_0_12px_3px_rgba(239,68,68,1)]" />
              </div>
            )}
          </div>
        </div>

        {/* Rep Speaking Notes & Clinical Script Drawer */}
        {showNotes && (
          <aside className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-20 text-slate-200">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span className="font-semibold text-xs tracking-wide text-white uppercase">
                  MR Detailing Talking Points
                </span>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Hide
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed">
              {/* Title & Category */}
              <div>
                <span className="text-slate-400 text-[11px] block">{currentSlide.category}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{currentSlide.title}</h3>
              </div>

              {/* Clinical Talking Points */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider block">
                  Core Clinical Claims:
                </span>
                <ul className="space-y-2 text-slate-300">
                  {currentSlide.clinicalTalkingPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded border border-slate-700/50">
                      <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Trials Citation */}
              {currentSlide.clinicalTrials && (
                <div className="p-3 bg-slate-800/40 rounded border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                    Pivotal Trial Evidence:
                  </span>
                  <p className="text-slate-300 italic">{currentSlide.clinicalTrials}</p>
                </div>
              )}

              {/* Recommended Dosage */}
              {currentSlide.dosageRecommendation && (
                <div className="p-3 bg-slate-800/40 rounded border border-slate-800 space-y-1">
                  <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
                    Dosage & Regimen:
                  </span>
                  <p className="text-slate-300">{currentSlide.dosageRecommendation}</p>
                </div>
              )}

              {/* Objection Handling */}
              {currentSlide.doctorObjectionCounters && currentSlide.doctorObjectionCounters.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                    Doctor Query / Objection Responses:
                  </span>
                  <div className="space-y-2">
                    {currentSlide.doctorObjectionCounters.map((obj, i) => (
                      <div key={i} className="p-2.5 bg-purple-950/20 border border-purple-800/40 rounded text-slate-300">
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Slide Strip / Thumbnail Scrubber */}
      <footer className="bg-slate-900 border-t border-slate-800 shrink-0 z-20">
        <div className="px-4 py-1.5 flex items-center justify-between text-xs border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Slide Carousel ({filteredSlides.length} pages)</span>
          </div>
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="flex items-center gap-1 text-slate-400 hover:text-white"
          >
            {showThumbnails ? (
              <>
                <span>Collapse Strip</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Expand Strip</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {showThumbnails && (
          <div className="p-2.5 overflow-x-auto flex items-center gap-3">
            {filteredSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 rounded-md overflow-hidden border-2 transition-all group ${
                  currentIndex === idx
                    ? 'border-teal-400 ring-2 ring-teal-400/30 scale-105'
                    : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="w-28 h-16 bg-slate-800 relative">
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white truncate max-w-[90px]">
                    {idx + 1}. {s.brandName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </footer>

      {/* End Call / Log DCR Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Log Call & Submit Work Report</h3>
              </div>
              <button
                onClick={() => setIsFeedbackModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCallReport} className="space-y-4 text-xs">
              {/* Doctor Details */}
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Doctor Visited</span>
                <span className="font-semibold text-white text-sm">
                  {detailingSession.doctor?.name || 'Walk-in / Clinic Consultation'}
                </span>
                <div className="text-slate-400 mt-0.5">
                  {detailingSession.doctor?.specialty || currentSlide.category} ·{' '}
                  {detailingSession.doctor?.hospital || 'Private Clinic'}
                </div>
              </div>

              {/* Call Feedback */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Doctor Receptivity & Feedback
                </label>
                <select
                  value={doctorFeedback}
                  onChange={(e: any) => setDoctorFeedback(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Highly Receptive">Highly Receptive (Will prescribe)</option>
                  <option value="Requested Clinical Trial Paper">Requested Clinical Trial Paper</option>
                  <option value="Needs Follow-up">Needs Follow-up (Follow in 2 weeks)</option>
                  <option value="Neutral">Neutral (Interested in comparison)</option>
                  <option value="Competitor Loyal">Competitor Loyal (Overcoming inertia)</option>
                </select>
              </div>

              {/* Samples Handed Over */}
              <div>
                <div className="flex items-center gap-1.5 mb-1 text-slate-300 font-medium">
                  <Package className="w-3.5 h-3.5 text-teal-400" />
                  <span>Samples Handed Over to Doctor</span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  {samples.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-slate-800/80 p-2 rounded border border-slate-700">
                      <div>
                        <div className="font-medium text-white truncate max-w-[130px]">{s.brandName}</div>
                        <div className="text-[10px] text-slate-400">Bag: {s.inBagBalance} left</div>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={s.inBagBalance}
                        value={selectedSamples[s.brandName] || ''}
                        placeholder="0"
                        onChange={(e) =>
                          setSelectedSamples({
                            ...selectedSamples,
                            [s.brandName]: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center text-white focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* POB & Next Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    POB (Personal Order Booking) ₹
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={pobAmount || ''}
                    placeholder="e.g. 25000"
                    onChange={(e) => setPobAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono tabular-nums focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Next Follow-up Commitment Date
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Detailed Remarks */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Field Remarks & Discussion Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Doctor emphasized on patient tolerability and agreed to initiate on next 5 patients..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  Back to Slide
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors shadow-sm"
                >
                  Save Call & Submit DCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
