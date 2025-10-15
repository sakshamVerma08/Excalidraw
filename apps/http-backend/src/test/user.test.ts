import app from "../index.js";
import request from "supertest";
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
    }, 9000);


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


        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body.error)).toBe(true)
    },9000)
});

describe("POST /api/user/sign-up", ()=>{

    let authCookie : string;
    it('should create a new user upon Signup and return 200', async ()=>{

        const userData = {
            name: "John Doe",
            email:`testUser_${Math.random()}@gmail.com`,
            password:"123456"
        };

        const response = await request(app)
        .post("/api/user/sign-up")
        .send(userData)
        .expect("Content-Type",/json/)
        .expect(200)

        const setCookieHeader = response.headers['set-cookie'];

        if(setCookieHeader && setCookieHeader[0] &&  setCookieHeader.length > 0){
            authCookie = setCookieHeader[0].split(';')[0] as string;
            expect(authCookie).toBeDefined()
            console.log("Extracted Auth Cookie: ", authCookie);
        }else{
            throw new Error("Sign up response did not return 'set-cookie' header");
        }

        //expect(response.body).toEqual({message:"User signup successful"});
    }, 9000);


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

        // expect(response.body).toEqual({message:"User signup successful"})
    },9000);
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // let pending async ops finish
});
