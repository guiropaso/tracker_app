import { db } from "@/lib/db"

export async function POST(req: Request) {
    const data = await req.json()
    const {email} = data

    const exercises = await db.exercise.findMany({
        where: {
            OR: [
                {
                    userEmail: 'default',
                },
                {
                    userEmail: email
                }

            ]
        }
    })


    if(!exercises) {
        return new Response(JSON.stringify({message: 'No exercise found'}), {status: 404})
    }
    return new Response(JSON.stringify(exercises), {status: 200})
}