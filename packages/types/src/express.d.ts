import { JwtPayload } from "jsonwebtoken";


declare global{

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
            roomId?: string
        }

       
    }


    
}


export {};
