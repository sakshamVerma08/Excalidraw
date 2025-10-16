import app from "../index.js";
import request from "supertest";
import { getAuthCookie } from "./helper/auth.js";
// Mention all the tests where GET request is getting performed under this 'describe' test group.
let authCookie: string;
beforeAll(async()=>{
    authCookie = await getAuthCookie();
});


describe('Excalidraw Room Tests', ()=>{

    
    it('GET /api/room/', async()=>{

        const response = await request(app)
        .get("/api/room")
        .set("Cookie",authCookie)
        .query({roomId: 3})
        .expect("Content-Type",/json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        
    },5000);


    it("(CREATE new room) POST /api/room/", async()=>{

        const newRoomData = {
            slug: "test-room",
            userId: 2
        };

        const response = await request(app)
        .post("/api/room/")
        .set("Cookie", authCookie)
        .send(newRoomData)
        .expect("Content-Type",/json/)

        expect(response.statusCode).toBe(201);
        expect(response.body).toBeDefined();
        expect(response.body).toEqual({message:"New room created successfully"});


    })
});
