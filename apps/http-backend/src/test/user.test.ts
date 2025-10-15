import app from "../index.js";
import request from "supertest";


let authCookie: string | undefined;
beforeAll(async()=>{

    const loginResponse = await request(app)
    .post("/api/user/sign-in")
    .send({email:"nitinaswal25@gmail.com",password:"123456"})
    .expect("Content-Type",/json/)

    expect(loginResponse.statusCode).toBe(201)
    expect(loginResponse.body).toBeDefined()
    expect(loginResponse.body.message).toEqual("Login Successful")
    
    const setCookieHeader = loginResponse.headers['set-cookie'];
    if(setCookieHeader && setCookieHeader[0]){

    authCookie = setCookieHeader[0].split(";")[0];
    } else{
        throw new Error("Failed to retrieve auth Cookie");
    }
});

describe("POST /api/user/sign-in", ()=>{

    it('Login an existing User', async()=>{

        const userObject = {
            email:"akshaykumar25@gmail.com",
            password:"123456"
        };


        const response = await request(app)
        .post('/api/user/sign-in')
        .send(userObject)
        .expect("Content-Type",/json/)
        .expect(201)

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({message:"Login Successful"})
    }, 9000);


    it('Simulate failing Zod validations(Login) ', async()=>{
        const invalidUser = {
            email:"a@a",
            password:"12"
        };

        const response = await request(app)
        .post('/api/user/sign-in')
        .send(invalidUser)
        .expect('Content-Type',/json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toBeDefined();
        expect(response.body.error).toBeDefined()
    },9000)
});

describe("POST /api/user/sign-up", ()=>{

    it('Signup a new User', async ()=>{

        const userData = {
            name: "John Doe",
            email:`testUser_${Math.random()}@gmail.com`,
            password:"123456"
        };

        const response = await request(app)
        .post("/api/user/sign-up")
        .send(userData)
        .expect("Content-Type",/json/)


        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body).toEqual({message:"User signup successful"})



        //expect(response.body).toEqual({message:"User signup successful"});
    }, 9000);


    it('Failing Zod validations (Signup)', async()=>{

        const invalidData = {
            name: "S",
            email:"s@s.com",
            password:"invalidPassword"
        };


        const response = await request(app)
        .post("/api/user/sign-up")
        .send(invalidData)
        .expect("Content-Type",/json/)

        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBeDefined()


    },9000);
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // let pending async ops finish
});
