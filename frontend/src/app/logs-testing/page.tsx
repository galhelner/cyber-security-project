"use client";

import { useEffect, useState } from "react";
import { env } from "@/config/env";

export default function LogsTesting() {
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}/api/logs`);
        if (!res.ok) throw new Error("Failed to fetch logs");
        const text = await res.text();
        setLogs(text);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200">
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center drop-shadow-sm">Logs &amp; Testing</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center font-semibold">{error}</div>
      ) : (
        <div className="bg-black rounded-lg p-4 overflow-x-auto max-h-[400px] text-sm text-green-200 font-mono shadow-inner border border-gray-700">
          <pre className="whitespace-pre-wrap break-words">{logs || "No logs found."}</pre>
        </div>
      )}
    </div>
  );
}