"use client";

import { useState } from "react";
import { env } from "../../config/env";

type RuleType = "ip" | "port" | "url";
type RuleMode = "whitelist" | "blacklist";

interface RulesAdditionProps {
  onAdd?: () => void; // callback to refresh existing rules
}

const BACKEND_BASE_URL = env.NEXT_PUBLIC_BACKEND_URL;

export default function RulesAddition({ onAdd }: RulesAdditionProps) {
  const [type, setType] = useState<RuleType>("ip");
  const [mode, setMode] = useState<RuleMode>("whitelist");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!value) return alert("Please enter a value.");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/firewall/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: [value], mode }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add rule");
      }

      alert(`${type.toUpperCase()} rule added successfully!`);
      setValue("");
      onAdd?.(); // refresh rules
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl max-w-4xl w-full mx-auto border border-blue-100">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight text-center drop-shadow-sm">Add New Firewall Rule</h2>
      <p className="text-gray-500 text-center mb-8">Quickly add a new rule to your firewall. Choose the type, mode, and value.</p>

      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 items-end justify-between">
        {/* Type */}
        <div className="flex-1 flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as RuleType)}
            className="border border-blue-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          >
            <option value="ip">IP</option>
            <option value="port">Port</option>
            <option value="url">URL</option>
          </select>
        </div>

        {/* Value */}
        <div className="flex-1 flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Value</label>
          <input
            type="text"
            placeholder="Enter value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border border-blue-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm placeholder-gray-400"
          />
        </div>

        {/* Mode */}
        <div className="flex-1 flex flex-col">
          <label className="mb-2 font-semibold text-blue-700">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as RuleMode)}
            className="border border-blue-200 bg-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
          >
            <option value="whitelist">Whitelist</option>
            <option value="blacklist">Blacklist</option>
          </select>
        </div>

        {/* Add Button */}
        <div className="flex md:justify-end mt-4 md:mt-0">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer text-white font-bold px-8 py-2 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Adding...
              </span>
            ) : "Add Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
