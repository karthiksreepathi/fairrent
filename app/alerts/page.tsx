"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff } from "lucide-react";
import AlertSetupForm from "@/components/alerts/AlertSetupForm";
import AlertCard from "@/components/alerts/AlertCard";
import type { AlertData } from "@/components/alerts/AlertCard";

const STORAGE_KEY = "fairrent_alerts";

function loadAlerts(): AlertData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: AlertData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch {
    // Gracefully handle localStorage errors
  }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAlerts(loadAlerts());
    setMounted(true);
  }, []);

  const refreshAlerts = useCallback(() => {
    setAlerts(loadAlerts());
  }, []);

  const handleToggle = (id: string) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, active: !a.active } : a
    );
    setAlerts(updated);
    saveAlerts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
  };

  return (
    <div className="bg-[#faf9f7] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#faf9f7] to-[#f5f3ef] py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#e2ddd5] text-xs font-medium text-[#c2410c] mb-4">
            <Bell className="w-3.5 h-3.5" />
            RENT ALERTS
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1c1917] mb-4">
            Rent <span className="text-[#c2410c] font-bold">Alerts</span>
          </h1>
          <p className="text-lg text-[#57534e] max-w-2xl mx-auto">
            Get notified when rents change in your target neighborhoods.
            Set your criteria and never miss a price drop or new listing. Free for everyone.
          </p>
        </div>
      </section>

      {/* Alert Setup Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlertSetupForm onAlertCreated={refreshAlerts} />
        </div>
      </section>

      {/* Your Alerts */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1c1917]">Your Alerts</h2>
            {alerts.length > 0 && (
              <span className="text-xs text-[#a8a29e] bg-[#f5f3ef] px-3 py-1 rounded-full border border-[#e2ddd5]">
                {alerts.filter((a) => a.active).length} active / {alerts.length} total
              </span>
            )}
          </div>

          {mounted && alerts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2ddd5] p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f5f3ef] flex items-center justify-center mx-auto mb-5">
                <BellOff className="w-8 h-8 text-[#a8a29e]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1c1917] mb-2">
                No alerts yet
              </h3>
              <p className="text-sm text-[#a8a29e] max-w-sm mx-auto">
                Create your first alert above to start getting notified about
                rent changes, new listings, and market updates in your target cities.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
