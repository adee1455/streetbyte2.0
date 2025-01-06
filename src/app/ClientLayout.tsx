"use client";
import { useInitializeLocationStore } from "@/store/locationStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitializeLocationStore();
  return <>{children}</>;
}