import request from "supertest";
import app from "../../index.js";

let cachedCookie: string | null = null;

export const getAuthCookie = async(): Promise<string> =>{
	
	if(cachedCookie) return cachedCookie;
	
	const userData = {email:"nitinaswal25@gmail.com",password:"123456"};

	const res = await request(app)
	.post("/api/user/sign-in")
	.send(userData)


	expect(res.statusCode).toBe(201)
	expect(res.body).toEqual({message:"Login Successful"})

	const cookieHeaders = res.headers['set-cookie'];

	if(!cookieHeaders || !Array.isArray(cookieHeaders) || cookieHeaders.length == 0){
		throw new Error("No 'Set-Cookie' header found in Response");
	}


	const authCookie = cookieHeaders.find((cookie)=>{
		return cookie.startsWith("token=")
	});

	if(!authCookie){
		throw new Error("Didn't find any token inside the Cookies");
	}

	cachedCookie= authCookie.split(";")[0];

	if(!cachedCookie){
		throw new Error("Cached Cookie is NULL");
	}

	return cachedCookie;

	
	}



