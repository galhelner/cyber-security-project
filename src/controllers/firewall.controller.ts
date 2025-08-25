import { Request, Response } from 'express';
import { pool } from '../db';
import { FirewallRule } from "../models/firewallRule"

// [POST] api/firewall/ip endpoint controller
export const addIPs = async (req: Request, res: Response) => {
    try {
        const { values, mode } = req.body;

        if (!Array.isArray(values) || !mode) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

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
        // TODO: remove the IPs thats in the request body from the DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [POST] api/firewall/url endpoint controller
export const addDomains = async (req: Request, res: Response) => {
    try {
        // TODO: add the domains from the request body to the DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [DELETE] api/firewall/url endpint controller 
export const deleteDomains = async (req: Request, res: Response) => {
    try {
        // TODO: remove the domains thats in the request body from the DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [POST] api/firewall/port endpoint controller
export const addPorts = async (req: Request, res: Response) => {
    try {
        // TODO: add the ports from the request body to the DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [DELETE] api/firewall/port endpint controller 
export const deletePorts = async (req: Request, res: Response) => {
    try {
        // TODO: remove the ports thats in the request body from the DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [GET] api/firewall/rules endpoint controller
export const getRules = async (req: Request, res: Response) => {
    try {
        // TODO: get all the rules from DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// [UPDATE] api/firewall/rules endpoint controller
export const updateRules = async (req: Request, res: Response) => {
    try {
        // TODO: remove all the rules thats in the request body from the DB.
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};