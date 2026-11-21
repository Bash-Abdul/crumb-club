"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

// Each consumer must match its server snapshot, even when a parent provider
// has already loaded browser storage before a Suspense boundary hydrates.
export function useHydrated() {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
