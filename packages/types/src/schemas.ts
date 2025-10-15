import {z} from "zod";

const minPasswordLength = 5;

export const CreateRoomSchema = z.object({
    slug: 
    z.string()
    .trim()
    .min(4, 'Slug must be atleast 4 characters long')
    .max(50, 'Slug cannot exceed 50 characters')
});


export const signUpSchema = z.object({
    name: z.string()
    .min(3)
    .trim(),

    email: z.email('Please enter a valid email')
    .trim()
    .min(3, "Email must be 3 characters long"),

    password: z.string().min(minPasswordLength, `Password must be ${minPasswordLength} characters long`),
    photo: z.string().trim().optional()

});


export const loginSchema = z.object({

    email: z.email('Please enter a valid email')
    .trim(),

    password: z.string()
    .min(minPasswordLength, `Password must be ${minPasswordLength} characters long`)
}
);


  export  type Message = {
         userId: number,
         roomId: number,
         message: string,
         created_at: Date,
     }


     export type User = {
        id: string | undefined ,
        name: string,
        email: string,
        password:string,
    }