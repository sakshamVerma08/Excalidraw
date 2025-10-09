import { JwtPayload } from "jsonwebtoken";

declare global{


    interface User{
        id: number,
        name: string,
        email: string,
        password:string,
    }

    namespace JWT{

        interface UserToken extends JwtPayload{

            id: number,
            name: string,
            email: string,
        }
    }

    namespace Express{
        

        
        interface Request{

            user?: Pick<User, 'name' | 'email' | 'id'>
        }


       
    }


    
}

export {};