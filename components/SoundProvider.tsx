"use client";

import { createContext, ReactNode, useContext, useState } from 'react';

// 効果音ON/OFFのグローバル状態
const SoundContext = createContext<{
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}>({
  soundEnabled: true,
  setSoundEnabled: () => {},
});

export const useSoundControl = () => useContext(SoundContext);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
};
