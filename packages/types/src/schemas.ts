import {z} from "zod";

export const CreateRoomSchema = z.object({
    slug: z.string().min(4)
});


export const signUpSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(3),
    password: z.string().min(5),
    photo: z.string().optional()

});


export const loginSchema = z.object({

    email: z.string().min(3),
    password: z.string().min(5)
}
);