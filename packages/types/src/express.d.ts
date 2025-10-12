import { JwtPayload } from "jsonwebtoken";


declare global{


    interface User{
        id: string ,
        name: string,
        email: string,
        password:string,
    }

    namespace JWT{

        interface UserToken extends JwtPayload{

            id: string ,
            name: string,
            email: string,
        }
    }

    namespace Express{
        
        interface Request{

            user?: Pick<User,'id'| 'name' | 'email'>
        }

       
    }


    
}


export {};
