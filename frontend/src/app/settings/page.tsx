
"use client";
import { useState, useEffect } from "react";

// Real dark mode toggle logic
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}


export default function Settings() {
  const [theme, setTheme] = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <div className="flex flex-col items-center py-12">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-10 w-full max-w-xl border border-blue-100 dark:border-gray-700">
        <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-200 mb-8 text-center drop-shadow">Settings</h1>

        <div className="space-y-8">
          {/* Real Feature: Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Appearance</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Toggle between light and dark mode</p>
            </div>
            <button
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none ${theme === "dark" ? "bg-blue-700" : "bg-gray-300"}`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${theme === "dark" ? "translate-x-8" : ""}`}
              />
              <span className="sr-only">Toggle dark mode</span>
            </button>
          </div>

          {/* Mock Feature: Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Notifications</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Enable or disable all notifications</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications((v) => !v)}
              className="toggle toggle-primary"
            />
          </div>

          {/* Mock Feature: Auto Update */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Auto Update</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Automatically update firewall rules</p>
            </div>
            <input
              type="checkbox"
              checked={autoUpdate}
              onChange={() => setAutoUpdate((v) => !v)}
              className="toggle toggle-primary"
            />
          </div>

          {/* Mock Feature: Privacy Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-200">Privacy Mode</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Hide sensitive information in the UI</p>
            </div>
            <input
              type="checkbox"
              checked={privacyMode}
              onChange={() => setPrivacyMode((v) => !v)}
              className="toggle toggle-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}