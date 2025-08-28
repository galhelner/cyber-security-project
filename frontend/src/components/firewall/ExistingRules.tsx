"use client";

import { useEffect, useState } from "react";

interface Rule {
  id: string;
  type: "ip" | "port" | "url";
  value: string;
  mode: "whitelist" | "blacklist";
  active: boolean;
}

interface FirewallRulesResponse {
  ips: { whitelist: any[]; blacklist: any[] };
  urls: { whitelist: any[]; blacklist: any[] };
  ports: { whitelist: any[]; blacklist: any[] };
}

export default function ExistingRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!BACKEND_BASE_URL) throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");

  // Fetch rules from backend and flatten them
  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/firewall/rules`);
      if (!res.ok) throw new Error("Failed to fetch rules");
      const data: FirewallRulesResponse = await res.json();

      const flattened: Rule[] = [];

      (["ips", "urls", "ports"] as const).forEach((type) => {
        (["whitelist", "blacklist"] as const).forEach((mode) => {
          const items = data[type][mode] || [];
          items.forEach((item: any) => {
            flattened.push({
              id: item.id,
              type: type.slice(0, -1) as "ip" | "url" | "port",
              value: typeof item === "string" ? item : item.value,
              mode: mode as "whitelist" | "blacklist",
              active: item.active,
            });
          });
        });
      });

      setRules(flattened);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rules");
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Toggle a rule (optimistic UI)
  const toggleRule = async (ruleId: string) => {
  const rule = rules.find((r) => r.id === ruleId);
  if (!rule) return;

  try {
    const payload = {
      [rule.type + "s"]: {
        ids: [rule.id],
        mode: rule.mode,
        active: !rule.active, // flip
      },
    };

    const res = await fetch(`${BACKEND_BASE_URL}/api/firewall/rules`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to toggle rule");

    // Fetch updated rules from backend
    const data = await fetch(`${BACKEND_BASE_URL}/api/firewall/rules`);
    const json = await data.json();

    // Flatten backend response
    const flattened: Rule[] = [];
    (["ips", "urls", "ports"] as const).forEach((type) => {
      (["whitelist", "blacklist"] as const).forEach((mode) => {
        const items = json[type][mode] || [];
        items.forEach((item: any) => {
          if (!item.id) return;
          flattened.push({
            id: item.id,
            type: type.slice(0, -1) as "ip" | "url" | "port",
            value: item.value,
            mode,
            active: item.active, // <- use backend value directly
          });
        });
      });
    });

    setRules(flattened);
  } catch (err) {
    console.error(err);
    alert("Failed to toggle rule");
  }
};


  // Delete a rule
  const deleteRule = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    const rule = rules.find((r) => r.id === ruleId);
    if (!rule) return;

    try {
      const payload = {
        values: [rule.value],
        mode: rule.mode,
      };

      const res = await fetch(`${BACKEND_BASE_URL}/api/firewall/${rule.type}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to delete rule");

      // Remove from local state
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete rule");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl max-w-4xl w-full mx-auto border border-blue-100 mt-8">
      <h2 className="text-3xl font-extrabold text-blue-800 mb-2 tracking-tight text-center drop-shadow-sm">Existing Rules</h2>
      <p className="text-gray-500 text-center mb-8">View, activate/deactivate, or delete your current firewall rules.</p>

      {loading ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      ) : rules.length === 0 ? (
        <p className="text-gray-500 text-center">No rules yet.</p>
      ) : (
        <ul className="space-y-4">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0 border border-blue-100 bg-white/80 p-5 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              {/* Rule Info */}
              <div className="flex-1 text-blue-900 font-medium text-lg">
                <span className="font-bold text-blue-700">{rule.type.toUpperCase()}</span>: {rule.value} <span className="text-xs text-blue-400">({rule.mode})</span>
              </div>

              {/* Status Button */}
              <button
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md ${rule.active
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700"
                  : "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 cursor-not-allowed"}`}
                onClick={() => toggleRule(rule.id)}
              >
                {rule.active ? "Active" : "Inactive"}
              </button>

              {/* Delete Button */}
              <button
                className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => deleteRule(rule.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
