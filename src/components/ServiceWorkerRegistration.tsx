"use client";
import { useEffect } from "react";
import { registerServiceWorker } from "../app/service-worker-registration";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
} 