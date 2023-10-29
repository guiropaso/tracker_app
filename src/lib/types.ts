import { Set, Workout as PrismaWorkout } from '@prisma/client'
import {z} from 'zod'

export const leaveMessageSchema = z.object({
    name: z.string().min(3,'Name must be at least 3 characters long').max(50,'Name must be 50 of fewer characters long').regex(/^[A-Za-z\s]+$/, 'Special characters or numbers are not allowed'),
    email: z.string().email({message: 'Invalid email address'}),
    message: z.string().min(3,'Message must be at least 3 characters long')
  })
  
export type LeaveMessageSchema = z.infer<typeof leaveMessageSchema>


export type Workout = PrismaWorkout & {sets: Set[]}