import { mockDeep, mockReset } from 'jest-mock-extended';
jest.mock('@excalidraw/db', ()=>({
  __esModule: true,
  prisma: mockDeep<any>()
}))

import request from 'supertest';
import express from 'express';
import { signUpController, signInController } from '../controllers/user-controller';
import cookieParser from 'cookie-parser';
import './mocks/prisma'; // Import mock
import prisma from '@excalidraw/db';

const prismaMock = prisma as any;
// Create test app
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post('/signup', signUpController);
app.post('/signin', signInController);

// Reset mock before each test
beforeEach(()=>{
  mockReset(prismaMock);
});

describe('Authentication Routes', () => {
  describe('POST /sign-up', () => {
    it('should create a new user successfully', async () => {
      // Mock database responses
      prismaMock.user.findUnique.mockResolvedValue(null); // User doesn't exist
      
      prismaMock.user.create.mockResolvedValue({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        photo: 'https://example.com/photo.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          photo: 'https://example.com/photo.jpg'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Signup Successful');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/sign-up')
        .send({
          name: 'A', // Too short
          email: 'invalid-email',
          password: '123' // Too short
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if user already exists', async () => {
      // Mock user exists
      prismaMock.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Existing User',
        email: 'duplicate@example.com',
        password: 'hashedpassword',
        photo: 'https://example.com/photo.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/signup')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'password123',
          photo: 'https://example.com/photo.jpg'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('User already exists with same email');
    });
  });
});