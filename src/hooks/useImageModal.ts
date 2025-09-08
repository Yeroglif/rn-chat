import { create } from "zustand";

interface ImageModalState {
  isOpen: boolean;
  imageUri: string | null;
  openModal: (uri: string) => void;
  closeModal: () => void;
}

export const useImageModal = create<ImageModalState>((set) => ({
  isOpen: false,
  imageUri: null,
  openModal: (uri) => set({ isOpen: true, imageUri: uri }),
  closeModal: () => set({ isOpen: false, imageUri: null }),
}));
