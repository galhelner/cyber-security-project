"use client";

import RulesAddition from "../../components/firewall/RulesAddition";
import ExistingRules from "../../components/firewall/ExistingRules";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function FirewallPage() {
  return (
    <div className="space-y-6">
      <RulesAddition />
      <ExistingRules />
    </div>
  );
}