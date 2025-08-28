// __tests__/firewall.integration.test.ts

import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../app';
import { Database } from '../config/db';

let app: Express; // Declare a variable to hold the app instance

// --- Test Suite for Integration Tests ---
describe('POST /api/firewall/ip (Integration)', () => {

  // Before all tests, create the app instance and connect to the DB
  beforeAll(async () => {
    // This now waits for the database connection and all setup to complete
    app = await createApp(); 
  });

  it('should add IPs to the database and return 201 Created', async () => {
    const validPayload = {
      values: ['1.1.1.1', '8.8.8.8'],
      mode: 'blacklist',
    };

    // Use the 'app' instance that was initialized in beforeAll
    const response = await request(app)
      .post('/api/firewall/ip')
      .send(validPayload);

    expect(response.status).toBe(201);
  });
});