import { PrismaClient } from '@excalidraw/db';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();

// Mock the prisma import
jest.mock('@excalidraw/db', () => ({
  __esModule: true,
  prisma: prismaMock
}));

beforeEach(() => {
  mockReset(prismaMock);
});