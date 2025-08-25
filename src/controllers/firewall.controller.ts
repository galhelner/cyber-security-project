import { Request, Response } from 'express';
import { pool } from '../db';
import { FirewallRule } from "../models/firewallRule"
import { RuleMode } from '../types/ruleMode';
import { FirewallRulesResponse } from '../models/firewallRulesResponse';
import { FirewallRulesRequest } from '../models/firewallRulesRequest';

// [POST] api/firewall/ip endpoint controller
export const addIPs = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // TODO: add validations for IP values and mode!

        // insert all IPs to the DB
        const queryValues: string[] = [];
        const params: any[] = [];
        values.forEach((ip: string, i: number) => {
            params.push(ip, mode, true);
            queryValues.push(`($${i * 3 + 1}, 'ip', $${i * 3 + 2}, $${i * 3 + 3})`);
        });

        if (queryValues.length > 0) {
            await pool.query(`
        INSERT INTO firewall_rules (value, rule_type, rule_mode, active)
        VALUES ${queryValues.join(', ')}
      `, params);
        }
        
        res.status(201).json({
            type: 'ip',
            mode,
            values,
            status: 'success'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [DELETE] api/firewall/ip endpint controller 
export const deleteIPs = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // TODO: add validations for IP values and mode!

        // Delete matching IP rules
        await pool.query(
            `DELETE FROM firewall_rules
       WHERE rule_type = 'ip' AND rule_mode = $1 AND value = ANY($2::text[])`,
            [mode, values]
        );

        return res.json({
            type: "ip",
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [POST] api/firewall/url endpoint controller
export const addDomains = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // TODO: add validations for domains values and mode!

        // insert all domains to the DB
        const queryValues: string[] = [];
        const params: any[] = [];
        values.forEach((url: string, i: number) => {
            params.push(url, mode, true);
            queryValues.push(`($${i * 3 + 1}, 'url', $${i * 3 + 2}, $${i * 3 + 3})`);
        });

        if (queryValues.length > 0) {
            await pool.query(`
        INSERT INTO firewall_rules (value, rule_type, rule_mode, active)
        VALUES ${queryValues.join(', ')}
      `, params);
        }
        
        res.status(201).json({
            type: 'url',
            mode,
            values,
            status: 'success'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [DELETE] api/firewall/url endpint controller 
export const deleteDomains = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // TODO: add validations for domains values and mode!

        // Delete matching domains rules
        await pool.query(
            `DELETE FROM firewall_rules
       WHERE rule_type = 'url' AND rule_mode = $1 AND value = ANY($2::text[])`,
            [mode, values]
        );

        return res.json({
            type: "url",
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [POST] api/firewall/port endpoint controller
export const addPorts = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        // TODO: add validations for port values and mode!

        // insert all ports to the DB
        const queryValues: string[] = [];
        const params: any[] = [];
        values.forEach((port: string, i: number) => {
            params.push(port, mode, true);
            queryValues.push(`($${i * 3 + 1}, 'port', $${i * 3 + 2}, $${i * 3 + 3})`);
        });

        if (queryValues.length > 0) {
            await pool.query(`
        INSERT INTO firewall_rules (value, rule_type, rule_mode, active)
        VALUES ${queryValues.join(', ')}
      `, params);
        }
        
        res.status(201).json({
            type: 'port',
            mode,
            values,
            status: 'success'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [DELETE] api/firewall/port endpint controller 
export const deletePorts = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || values.length === 0 || !mode) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // TODO: add validations for port values and mode!

        // Delete matching port rules
        await pool.query(
            `DELETE FROM firewall_rules
       WHERE rule_type = 'port' AND rule_mode = $1 AND value = ANY($2::text[])`,
            [mode, values]
        );

        return res.json({
            type: "port",
            mode,
            values,
            status: "success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [GET] api/firewall/rules endpoint controller
export const getRules = async (req: Request, res: Response) => {
    try {
        const result = await pool.query<FirewallRule>(
             `SELECT id, rule_type AS type, rule_mode AS mode, value FROM firewall_rules`
        );

        const response: FirewallRulesResponse = {
            ips: { blacklist: [], whitelist: [] },
            urls: { blacklist: [], whitelist: [] },
            ports: { blacklist: [], whitelist: [] },
        };

        result.rows.forEach((row) => {
            const mode = row.mode as RuleMode;

            if (row.type === "ip") {
                response.ips[mode].push({ id: row.id, value: row.value });
            } else if (row.type === "url") {
                response.urls[mode].push({ id: row.id, value: row.value });
            } else if (row.type === "port") {
                response.ports[mode].push({
                    id: row.id,
                    value: row.value,
                });
            }
        });

        return res.json(response);
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [UPDATE] api/firewall/rules endpoint controller
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
            const result = await pool.query<FirewallRule>(
                `UPDATE firewall_rules
                SET active = $1
                WHERE id = ANY($2) AND rule_type = $3 AND rule_mode = $4
                RETURNING id, value, active`,
                [active, ids, type.slice(0, -1), mode]
            );

            updated.push(...result.rows);
        }

        res.json({ updated });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};