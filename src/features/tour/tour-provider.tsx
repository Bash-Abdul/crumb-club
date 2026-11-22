"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { readTourStatus, type TourStatus } from "./tour-steps";
const KEY = "crumb-club:tour:v1";
interface TourContext {
  ready: boolean;
  status: TourStatus;
  active: boolean;
  requested: boolean;
  requestTour: () => void;
  startTour: () => void;
  closeTour: (status: Exclude<TourStatus, null>) => void;
}
const Context = createContext<TourContext | null>(null);
export function TourProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<TourStatus>(null);
  const [active, setActive] = useState(false);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    try {
      setStatus(readTourStatus(localStorage.getItem(KEY)));
    } catch {
      /* The tour can still be completed for this visit. */
    }
    setReady(true);
  }, []);
  const closeTour = useCallback((value: Exclude<TourStatus, null>) => {
    setActive(false);
    setRequested(false);
    setStatus(value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* Keep the completion in memory when storage is unavailable. */
    }
  }, []);
  const requestTour = useCallback(() => setRequested(true), []);
  const startTour = useCallback(() => {
    setRequested(false);
    setActive(true);
  }, []);
  return (
    <Context.Provider
      value={{
        ready,
        status,
        active,
        requested,
        requestTour,
        startTour,
        closeTour,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useTour() {
  const value = useContext(Context);
  if (!value) throw new Error("TourProvider is required");
  return value;
}
