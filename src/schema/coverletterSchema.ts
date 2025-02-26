import {z} from 'zod'

export const coverletterSchema = z.object({
    companyName: z.string().min(1,'Company name is required'),
    jobTitle: z.string().min(1,'Job title is required'),
    description: z.string().min(1, 'Job description is required')
})