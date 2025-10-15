import request from "supertest";
import app from "../index.js";
import {ZodError} from "zod";


describe("GET /api/room/:roomId", ()=>{

    const test_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6Ik5pdGluIEFzd2FsIiwiZW1haWwiOiJuaXRpbmFzd2FsMjVAZ21haWwuY29tIiwiaWF0IjoxNzYwNTQzOTYwLCJleHAiOjE3NjA2MzAzNjB9.hse-vZ8lrij9P8llp0sKiVwri6So4yJH3PctA21zNLU";

    it("should return 200 and GET all the previous messages of a room", async ()=>{

        const roomId = 3;
        

        const response = await request(app)
        .get(`/api/room/${roomId}`)
        .set()
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


afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // let pending async ops finish
});
