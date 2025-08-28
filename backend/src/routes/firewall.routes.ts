import { Router } from "express";
import * as firewallController from "../controllers/firewall.controller";
import { validateFirewallRule } from "../middlewares/validateFirewallRule";
import { RuleType } from "../types/ruleType";

const router = Router();

/**
 *  [POST] api/firewall/ip endpoint
 */
router.post("/ip", validateFirewallRule(RuleType.IP), firewallController.addIPs);

/** 
 * [DELETE] api/firewall/ip endpoint
 */ 
router.delete("/ip", validateFirewallRule(RuleType.IP), firewallController.deleteIPs);

/**
 * [POST] api/firewall/url
 */
router.post("/url", validateFirewallRule(RuleType.URL), firewallController.addDomains);

/** 
 * [DELETE] api/firewall/url
 */
router.delete("/url", validateFirewallRule(RuleType.URL), firewallController.deleteDomains);

/**
 * [POST] api/firewall/port
 */
router.post("/port", validateFirewallRule(RuleType.PORT), firewallController.addPorts);

/** 
 * [DELETE] api/firewall/port
 */
router.delete("/port", validateFirewallRule(RuleType.PORT), firewallController.deletePorts);

/** 
 * [GET] api/firewall/rules
 */
router.get("/rules", firewallController.getRules);

/** 
 * [UPDATE] api/firewall/rules
 */
router.patch("/rules", firewallController.updateRules);

// export the router
export default router;