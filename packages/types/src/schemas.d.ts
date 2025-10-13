import { z } from "zod";
export declare const CreateRoomSchema: z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strip>;
export declare const signUpSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    photo: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map