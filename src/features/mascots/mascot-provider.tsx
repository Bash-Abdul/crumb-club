"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useHydrated } from "@/hooks/use-hydrated";
import { DEFAULT_MASCOT, readMascot, type MascotId } from "./mascots";
const KEY = "crumb-club:mascot:v1";
interface MascotContext {
  mascot: MascotId;
  ready: boolean;
  storageError: boolean;
  chooseMascot: (mascot: MascotId) => void;
}
const Context = createContext<MascotContext | null>(null);
export function MascotProvider({ children }: { children: ReactNode }) {
  const [mascot, setMascot] = useState<MascotId>(DEFAULT_MASCOT);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      setMascot(readMascot(localStorage.getItem(KEY)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  function chooseMascot(value: MascotId) {
    const choice = readMascot(value);
    setMascot(choice);
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      setStorageError(true);
    }
  }
  return (
    <Context.Provider value={{ mascot, ready, storageError, chooseMascot }}>
      {children}
    </Context.Provider>
  );
}
export function useMascot() {
  const context = useContext(Context);
  const hydrated = useHydrated();
  if (!context) throw new Error("MascotProvider is required");
  return hydrated
    ? context
    : { ...context, mascot: DEFAULT_MASCOT, ready: false, storageError: false };
}
