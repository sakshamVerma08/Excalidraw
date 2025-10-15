import request from "supertest";
import app from "../index.js";
import {ZodError} from "zod";


describe("GET /api/room/:roomId", ()=>{

    it("should return 200 and GET all the previous messages of a room", async ()=>{

        const roomId = 3;

        const response = await request(app)
        .get(`/api/room/${roomId}`)
        .expect('Content-Type',/json/)
        .expect(200);

                

    });


    it('should return status 400 when no room is found', async ()=>{

        const roomId = 5000;

        const response = await request(app)
        .get(`/api/room/${roomId}`)
        .expect("Content-Type",/json/)
        .expect(400)

    })

     it("should return status 400 when zod validations fail ", async ()=>{

        const roomId = "random shit";

        const response = await request(app)
        .get(`/api/room/${roomId}`)
        .expect("Content-Type",/json/)
        .expect(400)
     });
});