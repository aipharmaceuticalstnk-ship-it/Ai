import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Patch,
  Brand,
  DetailingSlide,
  Doctor,
  SampleInventory,
  DailyCallReport,
  SalesTarget,
} from '../types/pharma';
import {
  INITIAL_USERS,
  INITIAL_PATCHES,
  INITIAL_BRANDS,
  INITIAL_SLIDES,
  INITIAL_DOCTORS,
  INITIAL_SAMPLES,
  INITIAL_DCRS,
  INITIAL_TARGETS,
} from '../data/initialData';

interface DetailingSessionState {
  doctor?: Doctor;
  brandId?: string;
  isOpen: boolean;
}

interface PharmaContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  patches: Patch[];
  addPatch: (patchData: Omit<Patch, 'id'>) => void;
  updatePatch: (patch: Patch) => void;
  deletePatch: (id: string) => void;

  brands: Brand[];
  addBrand: (brandData: Omit<Brand, 'id'>) => void;

  slides: DetailingSlide[];
  addSlide: (slideData: Omit<DetailingSlide, 'id' | 'createdAt'>) => void;
  updateSlide: (slide: DetailingSlide) => void;
  deleteSlide: (id: string) => void;

  doctors: Doctor[];
  addDoctor: (doctorData: Omit<Doctor, 'id'>) => void;
  updateDoctor: (doctor: Doctor) => void;
  deleteDoctor: (id: string) => void;

  samples: SampleInventory[];
  addSampleBatch: (sampleData: Omit<SampleInventory, 'id'>) => void;
  recordSampleDistribution: (brandName: string, quantity: number) => void;

  dcrs: DailyCallReport[];
  addDcr: (dcrData: Omit<DailyCallReport, 'id'>) => void;
  updateDcrStatus: (id: string, status: DailyCallReport['status']) => void;

  targets: SalesTarget[];

  detailingSession: DetailingSessionState;
  startDetailingSession: (doctor?: Doctor, brandId?: string) => void;
  closeDetailingSession: () => void;

  resetToDefaults: () => void;
}

const PharmaContext = createContext<PharmaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'aurapharma_users_v2',
  PATCHES: 'aurapharma_patches_v2',
  BRANDS: 'aurapharma_brands_v2',
  SLIDES: 'aurapharma_slides_v2',
  DOCTORS: 'aurapharma_doctors_v2',
  SAMPLES: 'aurapharma_samples_v2',
  DCRS: 'aurapharma_dcrs_v2',
  TARGETS: 'aurapharma_targets_v2',
  CURRENT_USER_ID: 'aurapharma_current_user_id_v2',
};

export const PharmaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = users.find((u) => u.id === storedId);
      return found || users[0];
    } catch {
      return users[0];
    }
  });

  const [patches, setPatches] = useState<Patch[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATCHES);
      return stored ? JSON.parse(stored) : INITIAL_PATCHES;
    } catch {
      return INITIAL_PATCHES;
    }
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BRANDS);
      return stored ? JSON.parse(stored) : INITIAL_BRANDS;
    } catch {
      return INITIAL_BRANDS;
    }
  });

  const [slides, setSlides] = useState<DetailingSlide[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SLIDES);
      return stored ? JSON.parse(stored) : INITIAL_SLIDES;
    } catch {
      return INITIAL_SLIDES;
    }
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return stored ? JSON.parse(stored) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [samples, setSamples] = useState<SampleInventory[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAMPLES);
      return stored ? JSON.parse(stored) : INITIAL_SAMPLES;
    } catch {
      return INITIAL_SAMPLES;
    }
  });

  const [dcrs, setDcrs] = useState<DailyCallReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DCRS);
      return stored ? JSON.parse(stored) : INITIAL_DCRS;
    } catch {
      return INITIAL_DCRS;
    }
  });

  const [targets, setTargets] = useState<SalesTarget[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TARGETS);
      return stored ? JSON.parse(stored) : INITIAL_TARGETS;
    } catch {
      return INITIAL_TARGETS;
    }
  });

  const [detailingSession, setDetailingSession] = useState<DetailingSessionState>({
    isOpen: false,
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id);
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATCHES, JSON.stringify(patches));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [patches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SLIDES, JSON.stringify(slides));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [slides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAMPLES, JSON.stringify(samples));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [samples]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DCRS, JSON.stringify(dcrs));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [dcrs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [targets]);

  // Handlers
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const addPatch = (patchData: Omit<Patch, 'id'>) => {
    const newPatch: Patch = {
      ...patchData,
      id: `ptc-${Date.now()}`,
    };
    setPatches((prev) => [...prev, newPatch]);
  };

  const updatePatch = (updated: Patch) => {
    setPatches((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deletePatch = (id: string) => {
    setPatches((prev) => prev.filter((p) => p.id !== id));
  };

  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      ...brandData,
      id: `brd-${Date.now()}`,
    };
    setBrands((prev) => [...prev, newBrand]);
  };

  const addSlide = (slideData: Omit<DetailingSlide, 'id' | 'createdAt'>) => {
    const newSlide: DetailingSlide = {
      ...slideData,
      id: `sld-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSlides((prev) => [...prev, newSlide]);

    // Update brand slideCount
    setBrands((prev) =>
      prev.map((b) =>
        b.id === slideData.brandId ? { ...b, slideCount: b.slideCount + 1 } : b
      )
    );
  };

  const updateSlide = (updated: DetailingSlide) => {
    setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteSlide = (id: string) => {
    const slideToDelete = slides.find((s) => s.id === id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
    if (slideToDelete) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === slideToDelete.brandId
            ? { ...b, slideCount: Math.max(0, b.slideCount - 1) }
            : b
        )
      );
    }
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
    };
    setDoctors((prev) => [...prev, newDoc]);
  };

  const updateDoctor = (updated: Doctor) => {
    setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const addSampleBatch = (sampleData: Omit<SampleInventory, 'id'>) => {
    const newSample: SampleInventory = {
      ...sampleData,
      id: `smp-${Date.now()}`,
    };
    setSamples((prev) => [...prev, newSample]);
  };

  const recordSampleDistribution = (brandName: string, quantity: number) => {
    setSamples((prev) =>
      prev.map((s) => {
        if (s.brandName.toLowerCase().includes(brandName.toLowerCase())) {
          const distributed = s.distributedToDoctors + quantity;
          const balance = Math.max(0, s.inBagBalance - quantity);
          return {
            ...s,
            distributedToDoctors: distributed,
            inBagBalance: balance,
          };
        }
        return s;
      })
    );
  };

  const addDcr = (dcrData: Omit<DailyCallReport, 'id'>) => {
    const newDcr: DailyCallReport = {
      ...dcrData,
      id: `dcr-${Date.now()}`,
    };
    setDcrs((prev) => [newDcr, ...prev]);

    // Update doctor's completedCallsThisMonth and lastVisitedDate
    setDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === dcrData.doctorId) {
          return {
            ...doc,
            completedCallsThisMonth: doc.completedCallsThisMonth + 1,
            lastVisitedDate: dcrData.date,
          };
        }
        return doc;
      })
    );

    // Update Rep's target progress
    setTargets((prev) =>
      prev.map((tgt) => {
        if (tgt.repId === dcrData.repId) {
          const isKol = dcrData.isKol;
          return {
            ...tgt,
            callsDone: tgt.callsDone + 1,
            kolCallsDone: isKol ? tgt.kolCallsDone + 1 : tgt.kolCallsDone,
            achievedRevenue: tgt.achievedRevenue + (dcrData.pobAmount || 0),
          };
        }
        return tgt;
      })
    );

    // Deduct samples if provided
    if (dcrData.samplesGiven && dcrData.samplesGiven.length > 0) {
      dcrData.samplesGiven.forEach((sg) => {
        recordSampleDistribution(sg.brandName, sg.quantity);
      });
    }
  };

  const updateDcrStatus = (id: string, status: DailyCallReport['status']) => {
    setDcrs((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  };

  const startDetailingSession = (doctor?: Doctor, brandId?: string) => {
    setDetailingSession({
      doctor,
      brandId,
      isOpen: true,
    });
  };

  const closeDetailingSession = () => {
    setDetailingSession({
      isOpen: false,
    });
  };

  const resetToDefaults = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setPatches(INITIAL_PATCHES);
    setBrands(INITIAL_BRANDS);
    setSlides(INITIAL_SLIDES);
    setDoctors(INITIAL_DOCTORS);
    setSamples(INITIAL_SAMPLES);
    setDcrs(INITIAL_DCRS);
    setTargets(INITIAL_TARGETS);
    localStorage.clear();
  };

  return (
    <PharmaContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        patches,
        addPatch,
        updatePatch,
        deletePatch,
        brands,
        addBrand,
        slides,
        addSlide,
        updateSlide,
        deleteSlide,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        samples,
        addSampleBatch,
        recordSampleDistribution,
        dcrs,
        addDcr,
        updateDcrStatus,
        targets,
        detailingSession,
        startDetailingSession,
        closeDetailingSession,
        resetToDefaults,
      }}
    >
      {children}
    </PharmaContext.Provider>
  );
};

export const usePharma = () => {
  const context = useContext(PharmaContext);
  if (!context) {
    throw new Error('usePharma must be used within a PharmaProvider');
  }
  return context;
};
