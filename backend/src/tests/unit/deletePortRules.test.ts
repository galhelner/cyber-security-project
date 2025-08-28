import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';

let app: Express;
const URL = "/api/firewall/port";

describe('[DELETE] /api/firewall/port test', () => {

  beforeAll(async () => {
    app = await createApp();
  });

  // successful input - case 1
  it('should delete ports from the database and return 200 OK', async () => {
    const validPayload = {
      values: [3000, 5000],
      mode: 'blacklist',
    };

    // making sure this data exists
    let response = await request(app)
      .post(URL)
      .send(validPayload);

     response = await request(app)
      .delete(URL)
      .send(validPayload);

    expect(response.status).toBe(200);
  });

  // successful input - case 2
  it("should delete ports from the database and return success status", async () => {
    const validPayload = {
      values: [3000, 5000],
      mode: 'blacklist',
    };

    // making sure this data exists
    let response = await request(app)
    .post(URL)
    .send(validPayload);

    response = await request(app)
      .delete(URL)
      .send(validPayload);

    expect(response.body).toHaveProperty("status");  
    expect(response.body.status).toEqual("success");
  });

  // successful input - case 3
  it("should delete ports from the database and return the deleted ports as values", async () => {
    const validPayload = {
      values: [3000, 5000],
      mode: 'blacklist',
    };

    // making sure this data exists
    let response = await request(app)
    .post(URL)
    .send(validPayload);

    response = await request(app)
      .delete(URL)
      .send(validPayload);

    expect(response.body).toHaveProperty("values");  
    expect(response.body.values).toEqual(validPayload.values);
  });

  // edge case - invalid port number
  it("should fail to delete an invalid URL", async () => {
    const invalidPayload = {
      values: [9999999],
      mode: 'blacklist',
    };

    const response = await request(app)
      .delete(URL)
      .send(invalidPayload);

    expect(response.status).toBe(400);
  });

  // not found case
  it("should fail to delete an non-existing port", async () => {
    const payload = {
      values: [3000],
      mode: 'blacklist',
    };

    // making sure this data doesnt exists
    let response = await request(app)
    .delete(URL)
    .send(payload);

    // trying to delete the same data again
    response = await request(app)
        .delete(URL)
        .send(payload);

    expect(response.status).toBe(404);
  });
});