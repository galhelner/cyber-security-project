"use client";


import { useRef } from "react";
import RulesAddition from "../../components/firewall/RulesAddition";
import ExistingRules from "../../components/firewall/ExistingRules";

export default function FirewallPage() {
  // Use a ref to call fetchRules in ExistingRules from RulesAddition
  const existingRulesRef = useRef<{ fetchRules: () => void }>(null);

  return (
    <div className="space-y-6">
      <RulesAddition onAdd={() => existingRulesRef.current?.fetchRules()} />
      <ExistingRules ref={existingRulesRef} />
    </div>
  );
}