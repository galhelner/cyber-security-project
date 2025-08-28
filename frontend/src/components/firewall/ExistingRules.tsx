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
        [rule.type + "s"]: {
          ids: [ruleId],
          mode: rule.mode,
          active: rule.active,
        },
      };

      const res = await fetch(`${BACKEND_BASE_URL}/api/firewall/rules`, {
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

  if (loading) return <p>Loading rules...</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4 mt-6">
      <h2 className="text-xl font-bold">Existing Rules</h2>

      {rules.length === 0 ? (
        <p>No rules yet.</p>
      ) : (
        <ul className="space-y-2">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
            >
              <div>
                <span className="font-semibold">{rule.type.toUpperCase()}</span>: {rule.value} (
                {rule.mode})
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded text-white ${
                    rule.active ? "bg-green-500" : "bg-gray-400"
                  }`}
                  onClick={() => toggleRule(rule.id)}
                >
                  {rule.active ? "Active" : "Inactive"}
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => deleteRule(rule.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
