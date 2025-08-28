"use client";

import { useEffect, useState } from "react";
import RulesAddition from "./RulesAddition";
import ExistingRules from "./ExistingRules";

interface Rule {
  id: string;
  type: "ip" | "port" | "url";
  value: string;
  mode: "whitelist" | "blacklist";
  active: boolean;
}

interface FirewallRulesResponse {
  ips: { whitelist: any[]; blacklist: any[]; active: boolean };
  urls: { whitelist: any[]; blacklist: any[]; active: boolean };
  ports: { whitelist: any[]; blacklist: any[]; active: boolean };
}

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function FirewallPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  // Flatten backend response into Rule[]
  const flattenRules = (data: FirewallRulesResponse) => {
    const flattened: Rule[] = [];
    (["ips", "urls", "ports"] as const).forEach((type) => {
      (["whitelist", "blacklist"] as const).forEach((mode) => {
        const items = data[type][mode] || [];
        const typeActive = data[type].active;
        items.forEach((item: any) => {
          if (!item.id) return;
          flattened.push({
            id: item.id,
            type: type.slice(0, -1) as "ip" | "url" | "port",
            value: item.value,
            mode,
            active: typeActive,
          });
        });
      });
    });
    return flattened;
  };

  // Fetch all rules
  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/firewall/rules`);
      if (!res.ok) throw new Error("Failed to fetch rules");
      const data: FirewallRulesResponse = await res.json();
      setRules(flattenRules(data));
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="space-y-6">
      <RulesAddition onAdd={fetchRules} />
      {loading ? <p>Loading rules...</p> : <ExistingRules rules={rules} setRules={setRules} />}
    </div>
  );
}