"use client";

import RulesAddition from "../../components/firewall/RulesAddition";
import ExistingRules from "../../components/firewall/ExistingRules";

export default function FirewallPage() {
  return (
    <div className="space-y-6">
      <RulesAddition />
      <ExistingRules />
    </div>
  );
}