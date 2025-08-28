import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';

let app: Express;
const URL = "/api/firewall/ip";

describe('[POST] /api/firewall/ip test', () => {

  beforeAll(async () => {
    app = await createApp();
  });

  // successful input - case 1
  it('should add IPs to the database and return 201 Created', async () => {
    const validPayload = {
      values: ['1.1.1.1', '8.8.8.8'],
      mode: 'blacklist',
    };

    // making sure this data doesnt exists
    let response = await request(app)
    .delete(URL)
    .send({ values: ['1.1.1.1'], mode: 'blacklist' });

    response = await request(app)
    .delete(URL)
    .send({ values: ['8.8.8.8'], mode: 'blacklist' });

    response = await request(app)
      .post(URL)
      .send(validPayload);

    expect(response.status).toBe(201);
  });

  // successful input - case 2
  it("should add IPs to the database and return success status", async () => {
    const validPayload = {
      values: ['1.1.1.1', '8.8.8.8'],
      mode: 'blacklist',
    };

    // making sure this data doesnt exists
    let response = await request(app)
    .delete(URL)
    .send({ values: ['1.1.1.1'], mode: 'blacklist' });

    response = await request(app)
    .delete(URL)
    .send({ values: ['8.8.8.8'], mode: 'blacklist' });

    response = await request(app)
      .post(URL)
      .send(validPayload);

    expect(response.body).toHaveProperty("status");  
    expect(response.body.status).toEqual("success");
  });

  // successful input - case 3
  it("should add IPs to the database and return the added IPs as values", async () => {
    const validPayload = {
      values: ['1.1.1.1', '8.8.8.8'],
      mode: 'blacklist',
    };

    // making sure this data doesnt exists
    let response = await request(app)
    .delete(URL)
    .send({ values: ['1.1.1.1'], mode: 'blacklist' });

    response = await request(app)
    .delete(URL)
    .send({ values: ['8.8.8.8'], mode: 'blacklist' });

    response = await request(app)
      .post(URL)
      .send(validPayload);

    expect(response.body).toHaveProperty("values");  
    expect(response.body.values).toEqual(validPayload.values);
  });

  // edge case - invalid IP address
  it("should fail to add an invalid IP", async () => {
    const invalidPayload = {
      values: ['1x.1.1b.1'],
      mode: 'blacklist',
    };

    const response = await request(app)
      .post(URL)
      .send(invalidPayload);

    expect(response.status).toBe(400);
  });

  // duplicate case
  it("should fail to add an existing IP", async () => {
    const payload = {
      values: ['0.0.0.0'],
      mode: 'blacklist',
    };

    // making sure this data doesnt exists
    let response = await request(app)
    .delete(URL)
    .send(payload);

    // inserting data
    response = await request(app)
      .post(URL)
      .send(payload);

    // trying to insert the same data again
    response = await request(app)
        .post(URL)
        .send(payload);

    expect(response.status).toBe(409);
  });
});