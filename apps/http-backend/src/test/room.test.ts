import app from "../index.js";
import request from "supertest";
import { getAuthCookie } from "./helper/auth.js";
// Mention all the tests where GET request is getting performed under this 'describe' test group.
let authCookie: string;
beforeAll(async()=>{
    authCookie = await getAuthCookie();
})
describe('Get room Data', ()=>{

    it('POST /api/room/:roomId', async()=>{

        const response = await request(app)
        .get("/api/room")
        .set("Cookie",authCookie)
        .expect("Content-Type",/json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        
    },9000);
})