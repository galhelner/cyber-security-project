"use client";

import { useState } from "react";

type RuleType = "ip" | "port" | "url";
type RuleMode = "whitelist" | "blacklist";

interface RulesAdditionProps {
  onAdd?: () => void; // callback to refresh existing rules
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
    <div className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-bold">Add New Firewall Rule</h2>
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div>
          <label className="block mb-1 font-semibold">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as RuleType)} className="border rounded px-3 py-1">
            <option value="ip">IP</option>
            <option value="port">Port</option>
            <option value="url">URL</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Value</label>
          <input type="text" placeholder="Enter value" value={value} onChange={(e) => setValue(e.target.value)} className="border rounded px-3 py-1" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as RuleMode)} className="border rounded px-3 py-1">
            <option value="whitelist">Whitelist</option>
            <option value="blacklist">Blacklist</option>
          </select>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={handleAdd} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Adding..." : "Add Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
