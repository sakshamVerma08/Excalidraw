import request from 'supertest';
import app from '../index.js';


describe('GET /health route',()=>{

    it("should respond with a 'Excalidraw-HTTP Backend' message", async()=>{
        const response = await request(app)
    .get('/health')
    .expect("Content-Type", /json/)
    .expect(200)


    expect(response.body).toEqual({message:"✅Server health looking good "})
    });

    it('should responsed with 404 for non-existent route', async()=>{

        await request(app)
        .get('/non-existent-route')
        .expect(404)
    });

    //it()
    

    // it()
});


afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500)); // let pending async ops finish
});
