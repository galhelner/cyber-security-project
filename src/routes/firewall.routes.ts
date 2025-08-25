import { Router } from "express";
import * as firewallController from "../controllers/firewall.controller";

const router = Router();

// [POST] api/firewall/ip endpoint
router.post("/ip", firewallController.addIPs);

// [DELETE] api/firewall/ip endpoint
router.delete("/ip", firewallController.deleteIPs);

// [POST] api/firewall/url
router.post("/url", firewallController.addDomains);

// [DELETE] api/firewall/url
router.delete("/url", firewallController.deleteDomains);

// [POST] api/firewall/port
router.post("/url", firewallController.addPorts);

// [DELETE] api/firewall/url
router.delete("/url", firewallController.deletePorts);

// [GET] api/firewall/rules
router.get("/rules", firewallController.getRules);

// [UPDATE] api/firewall/rules
router.patch("/rules", firewallController.updateRules);

// export the router
export default router;