import {z} from 'zod'

export const contactSchema = z.object({
    email: z.string().email('Invalid email address'),
    mobile: z.string().optional(),
    linkedIn: z.string().optional(),
    twitter:z.string().optional(),
})

export const entrySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().min(2, 'Organization is required'),
    startDate: z.string().min(1,'Start Date is required'),
    endDate: z.string().optional(),
    description: z.string().min(1,'Description is required'),
    current : z.boolean().default(false)
})
.refine((data)=>{
    if(!data.current && !data.endDate){
        return false
    }
    return true;
},
{
 message: "End date is required unless htis is your current position",
 path:["endDate"]
}
);

export const resumeSchema = z.object({
    contactInfo: contactSchema,
    summary: z.string().min(1, 'Professional summary is required'),
    skills: z.string().min(1, 'Skills are required'),
    experience: z.array(entrySchema),
    education: z.array(entrySchema),
    prjects: z.array(entrySchema),
})