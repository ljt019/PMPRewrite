import { useState, useEffect } from "react";
import type { Settings } from "@/types/settings";

// Custom hook for managing settings in local storage
export function useSettings() {
  // Function to get settings from local storage
  const getSettings = (): Settings | null => {
    const settings = localStorage.getItem("appSettings");
    return settings ? JSON.parse(settings) : null;
  };

  // Function to save settings to local storage
  const saveSettings = (settings: Settings) => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  };

  // State to hold settings
  const [settings, setSettings] = useState<Settings | null>(getSettings());

  // Function to update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    window.location.reload();
  };

  // Effect to load settings from local storage on mount
  useEffect(() => {
    setSettings(getSettings());
  }, []);

  return {
    settings,
    updateSettings,
  };
}
