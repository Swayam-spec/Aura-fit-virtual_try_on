import { create } from 'zustand';

type GarmentType = 'tops' | 'bottoms' | 'dresses';
type GenerationState = 'idle' | 'generating' | 'complete';

interface VtoState {
  modelImage: string | null;
  garmentImage: string | null;
  garmentType: GarmentType;
  hdUpscale: boolean;
  preserveBackground: boolean;
  generationState: GenerationState;
  resultImage: string | null;
  progressText: string;
  setModelImage: (url: string | null) => void;
  setGarmentImage: (url: string | null) => void;
  setGarmentType: (type: GarmentType) => void;
  setHdUpscale: (val: boolean) => void;
  setPreserveBackground: (val: boolean) => void;
  setGenerationState: (state: GenerationState) => void;
  setResultImage: (url: string | null) => void;
  setProgressText: (text: string) => void;
}

export const useVtoStore = create<VtoState>((set) => ({
  modelImage: null,
  garmentImage: null,
  garmentType: 'tops',
  hdUpscale: false,
  preserveBackground: true,
  generationState: 'idle',
  resultImage: null,
  progressText: '',
  setModelImage: (url) => set({ modelImage: url }),
  setGarmentImage: (url) => set({ garmentImage: url }),
  setGarmentType: (type) => set({ garmentType: type }),
  setHdUpscale: (val) => set({ hdUpscale: val }),
  setPreserveBackground: (val) => set({ preserveBackground: val }),
  setGenerationState: (state) => set({ generationState: state }),
  setResultImage: (url) => set({ resultImage: url }),
  setProgressText: (text) => set({ progressText: text }),
}));
