import { Request, Response } from 'express';
import { Database } from '../config/db';
import { firewallRulesSchema } from "../config/firewallRulesSchema";
import { RuleMode } from '../types/ruleMode';
import { FirewallRulesResponse } from '../models/firewallRulesResponse';
import { FirewallRulesRequest } from '../models/firewallRulesRequest';
import { RuleType } from '../types/ruleType';
import { inArray, and, eq } from 'drizzle-orm';
import { Logger } from '../config/logger';

const logger = Logger.getInstance();
const database = Database.getInstance();
const db = database.getDrizzleDB();

/**
 * [POST] api/firewall/ip endpoint controller
 */
export const addIPs = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // insert all IPs to the DB
        await db.insert(firewallRulesSchema).values(
            values.map((ip: string) => ({
                value: ip,
                ruleType: RuleType.IP,
                ruleMode: mode,
                active: true,
            }))
        );

        res.status(201).json({
            type: RuleType.IP,
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * [DELETE] api/firewall/ip endpint controller
 */ 
export const deleteIPs = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // Delete matching IP rules
        await db.delete(firewallRulesSchema)
        .where(
            and(
                eq(firewallRulesSchema.ruleType, RuleType.IP),
                eq(firewallRulesSchema.ruleMode, mode),
                inArray(firewallRulesSchema.value, values)
            )
        );

        return res.json({
            type: RuleType.IP,
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * [POST] api/firewall/url endpoint controller
 */
export const addDomains = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // insert all domains to the DB
        await db.insert(firewallRulesSchema).values(
            values.map((url: string) => ({
                value: url,
                ruleType: RuleType.URL,
                ruleMode: mode,
                active: true,
            }))
        );

        res.status(201).json({
            type: RuleType.URL,
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * [DELETE] api/firewall/url endpint controller
 */ 
export const deleteDomains = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // Delete matching domains rules
        await db.delete(firewallRulesSchema)
        .where(
            and(
                eq(firewallRulesSchema.ruleType, RuleType.URL),
                eq(firewallRulesSchema.ruleMode, mode),
                inArray(firewallRulesSchema.value, values)
            )
        );

        return res.json({
            type: RuleType.URL,
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * [POST] api/firewall/port endpoint controller
 */
export const addPorts = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // insert all ports to the DB
        await db.insert(firewallRulesSchema).values(
            values.map((port: string) => ({
                value: port,
                ruleType: RuleType.PORT,
                ruleMode: mode,
                active: true,
            }))
        );

        res.status(201).json({
            type: RuleType.PORT,
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * [DELETE] api/firewall/port endpint controller
 */ 
export const deletePorts = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // Delete matching port rules
        await db.delete(firewallRulesSchema)
        .where(
            and(
                eq(firewallRulesSchema.ruleType, RuleType.PORT),
                eq(firewallRulesSchema.ruleMode, mode),
                inArray(firewallRulesSchema.value, values)
            )
        );

        return res.json({
            type: RuleType.PORT,
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/** 
 * [GET] api/firewall/rules endpoint controller
 */
export const getRules = async (req: Request, res: Response) => {
    try {
        const rows = await db
        .select({
            id: firewallRulesSchema.id,
            type: firewallRulesSchema.ruleType,
            mode: firewallRulesSchema.ruleMode,
            value: firewallRulesSchema.value,
        })
        .from(firewallRulesSchema);

        const response: FirewallRulesResponse = {
            ips: { blacklist: [], whitelist: [] },
            urls: { blacklist: [], whitelist: [] },
            ports: { blacklist: [], whitelist: [] },
        };


        rows.forEach((row) => {
            const mode = row.mode as RuleMode;

            if (row.type === RuleType.IP) {
                response.ips[mode].push({ id: row.id, value: row.value });
            } else if (row.type === RuleType.URL) {
                response.urls[mode].push({ id: row.id, value: row.value });
            } else if (row.type === RuleType.PORT) {
                response.ports[mode].push({
                    id: row.id,
                    value: row.value,
                });
            }
        });

        return res.json(response);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * [UPDATE] api/firewall/rules endpoint controller
 */
export const updateRules = async (req: Request, res: Response) => {
    const body: FirewallRulesRequest = req.body;
    const updated: any[] = [];

    try {
        // Iterate over rule types
        for (const type of ["ips", "urls", "ports"] as const) {
            const rules = body[type];
            if (!rules) continue;


            const { ids, mode, active } = rules;

            if (!ids || ids.length === 0) continue;

            // Update rules in DB
            const result = await db
            .update(firewallRulesSchema)
            .set({ active })
            .where(
                and(
                    inArray(firewallRulesSchema.id, ids),
                    eq(firewallRulesSchema.ruleType, type.slice(0, -1)),
                    eq(firewallRulesSchema.ruleMode, mode)
                )
            )
            .returning({
                id: firewallRulesSchema.id,
                value: firewallRulesSchema.value,
                active: firewallRulesSchema.active,
            });

            updated.push(...result);
        }

        res.json({ updated });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};