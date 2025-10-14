import request from "supertest";
import app from "../index.js";
import { ZodError } from "zod";

describe("POST /api/user/sign-in", ()=>{

    it('should help an existing user to sign in and return 201 status', async()=>{

        const userObject = {
            email:"akshaykumar25@gmail.com",
            password:"123456"
        };


        const response = await request(app)
        .post('/api/user/sign-in')
        .send(userObject)
        .expect("Content-Type",/json/)
        .expect(201)

        expect(response.body).toEqual({message:"Login Successful"})
    });


    it('should return 400 when zod validation fails', async()=>{
        const invalidUser = {
            email:"a@a",
            password:"12"
        };

        const response = await request(app)
        .post('/api/user/sign-in')
        .send(invalidUser)
        .expect('Content-Type',/json/)
        .expect(400)


        expect(response.body).toBeInstanceOf(ZodError);
    })
});

describe("POST /api/user/sign-up", ()=>{

    it('should create a new user upon Signup and return 200', async ()=>{

        const userData = {
            name: "John Doe",
            email:"johndoe25@gmail.com",
            password:"123456"
        };

        const response = await request(app)
        .post("/api/user/sign-up")
        .send(userData)
        .expect("Content-Type",/json/)
        .expect(200)

        expect(response.body).toEqual({message:"User signup successful"});
    });


    it('should return 400 when zod validations fail', async()=>{

        const invalidData = {
            name: "S",
            email:"s@s.com",
            password:"invalidPassword"
        };


        const response = await request(app)
        .post("/api/user/sign-up")
        .send(invalidData)
        .expect("Content-Type",/json/)
        .expect(400)

        expect(response.body).toEqual({message:"User signup successful"})
    });
});

