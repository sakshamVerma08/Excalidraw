import request from "supertest";
import app from "../../index.js";

let cookies = null;
let cachedCookie: string | null = null;

export const getAuthCookie = async(): Promise<string> =>{
	
	if(cachedCookie) return cachedCookie;
	
	const userData = {email:"nitinaswal25@gmail.com",password:"123456"};

	const res = await request(app)
	.post("/api/user/sign-in")
	.send(userData)


	expect(res.statusCode).toBe(201)
	expect(res.body).toEqual({message:"Login Successful"})

	cookies = res.headers['set-cookie']?.split(";")[0];
	if(cookies && cookieStore.length > 0){
		cachedCookie = cookies[0]?.split(";")[0];
	}else{
		throw new Error("no secret header found in response")
	}
	return cachedCookie;


}
