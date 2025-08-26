import request from 'supertest';
import app from '../app';

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 OK with health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('uptime');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('version');
      expect(response.body.data).toHaveProperty('environment', 'test');
    });

    it('should include request ID in response headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('x-request-id');
      expect(response.headers['x-request-id']).toBeTruthy();
    });
  });

  describe('GET /health/detailed', () => {
    it('should return 200 OK with detailed system information', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('system');
      expect(response.body.data).toHaveProperty('config');
      
      // Check system information
      expect(response.body.data.system).toHaveProperty('nodeVersion');
      expect(response.body.data.system).toHaveProperty('platform');
      expect(response.body.data.system).toHaveProperty('arch');
      expect(response.body.data.system).toHaveProperty('memoryUsage');
      expect(response.body.data.system).toHaveProperty('cpuUsage');
      
      // Check configuration
      expect(response.body.data.config).toHaveProperty('environment', 'test');
      expect(response.body.data.config).toHaveProperty('port', 3002);
      expect(response.body.data.config).toHaveProperty('corsOrigin');
      expect(response.body.data.config).toHaveProperty('hasOpenAIKey');
      expect(response.body.data.config).toHaveProperty('hasElevenLabsKey');
      expect(response.body.data.config).toHaveProperty('hasDIDKey');
    });
  });
}); 