export type UserRole = 'ADMIN' | 'ASM' | 'MR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  patchId?: string; // Assigned territory
  patchName?: string;
  hqLocation: string; // Headquarters city
  monthlyTargetRevenue: number; // e.g. 850000 (INR/USD)
  monthlyTargetCalls: number; // e.g. 240 calls
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Patch {
  id: string;
  code: string;
  name: string;
  city: string;
  region: string;
  assignedMrId?: string;
  assignedMrName?: string;
  totalDoctors: number;
  kolDoctorCount: number;
  monthlySalesTarget: number;
  salesAchieved: number;
  specialtyFocus: string;
}

export type TherapeuticCategory =
  | 'Cardiovascular & Hypertension'
  | 'Diabetology & Metabolic'
  | 'Anti-Infectives & Critical Care'
  | 'Gastroenterology & Hepatology'
  | 'Respiratory & Pulmonology';

export interface Brand {
  id: string;
  name: string;
  category: TherapeuticCategory;
  genericComposition: string;
  dosageForm: string; // e.g. "Film Coated Tablet", "Dry Syrup"
  packSize: string; // e.g. "10 x 10 Blister", "30ml Bottle"
  mrp: number; // Maximum Retail Price
  ptr: number; // Price to Retailer
  keyIndications: string[];
  keyBenefits: string[];
  slideCount: number;
  monthlyTargetUnits: number;
  achievedUnits: number;
}

export interface DetailingSlide {
  id: string;
  brandId: string;
  brandName: string;
  category: TherapeuticCategory;
  pageNumber: number;
  title: string;
  imageUrl: string; // Base64 data url or path
  clinicalTalkingPoints: string[];
  clinicalTrials: string;
  dosageRecommendation: string;
  doctorObjectionCounters: string[];
  uploadedBy: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. "Senior Consultant Cardiologist"
  qualifications: string; // e.g. "MD, DM (Cardio), FACC"
  hospital: string;
  patchId: string;
  patchName: string;
  specialty: string;
  isKol: boolean; // Key Opinion Leader
  tier: 'Tier A (KOL)' | 'Tier B (Core)' | 'Tier C (Support)';
  prescribingPotential: 'High' | 'Medium' | 'Low';
  monthlyTargetFrequency: number; // e.g. 3 visits/mo for KOL
  completedCallsThisMonth: number;
  lastVisitedDate: string;
  preferredTime: string; // e.g. "1:00 PM - 2:30 PM (OPD Break)"
  phone: string;
  email: string;
  notes: string;
  preferredBrands: string[];
}

export interface SampleInventory {
  id: string;
  brandId: string;
  brandName: string;
  category: TherapeuticCategory;
  batchNumber: string;
  expiryDate: string;
  allocatedToMr: number; // Total issued to rep
  distributedToDoctors: number; // Given out
  inBagBalance: number; // In rep medical bag
  unitLabel: string; // e.g. "Catch covers", "Samples"
}

export interface DailyCallReport {
  id: string;
  repId: string;
  repName: string;
  patchId: string;
  patchName: string;
  date: string; // YYYY-MM-DD
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  isKol: boolean;
  brandsDetailed: string[];
  samplesGiven: { brandName: string; quantity: number }[];
  pobAmount: number; // Personal Order Booking in currency
  callType: 'Planned' | 'Unplanned' | 'Joint Field Work with ASM';
  durationMinutes: number;
  doctorFeedback: 'Highly Receptive' | 'Requested Clinical Trial Paper' | 'Needs Follow-up' | 'Neutral' | 'Competitor Loyal';
  nextFollowUpDate: string;
  remarks: string;
  status: 'APPROVED' | 'SUBMITTED' | 'REVIEW_REQUESTED';
}

export interface SalesTarget {
  id: string;
  period: string; // e.g. "October 2026"
  repId?: string;
  repName?: string;
  patchId?: string;
  patchName?: string;
  targetRevenue: number;
  achievedRevenue: number;
  secondarySalesTarget: number;
  secondarySalesAchieved: number;
  callTarget: number;
  callsDone: number;
  kolCallTarget: number;
  kolCallsDone: number;
}
