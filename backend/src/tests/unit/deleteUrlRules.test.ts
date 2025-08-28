import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app';

let app: Express;
const URL = "/api/firewall/url";

describe('[DELETE] /api/firewall/url test', () => {

  beforeAll(async () => {
    app = await createApp();
  });

  // successful input - case 1
  it('should delete URLs from the database and return 200 OK', async () => {
    const validPayload = {
      values: ['http://www.bad.com', 'http://www.worse.com'],
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
  it("should delete URLs from the database and return success status", async () => {
    const validPayload = {
      values: ['http://www.bad.com', 'http://www.worse.com'],
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
  it("should delete URLs from the database and return the deleted URLs as values", async () => {
    const validPayload = {
      values: ['http://www.bad.com', 'http://www.worse.com'],
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

  // edge case - invalid URL address
  it("should fail to delete an invalid URL", async () => {
    const invalidPayload = {
      values: ['this_is_invalid_url'],
      mode: 'blacklist',
    };

    const response = await request(app)
      .delete(URL)
      .send(invalidPayload);

    expect(response.status).toBe(400);
  });

  // not found case
  it("should fail to delete an non-existing URL", async () => {
    const payload = {
      values: ['http://www.bad.com'],
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