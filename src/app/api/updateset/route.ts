import { db } from "@/lib/db"
import { Set } from "@prisma/client"

export async function POST(req: Request, res: Response) {
    const data:Set = await req.json()
    console.log('updated set obj received in route: ', data)

    const updatedSet = await db.set.update({
        where: {
            setId: data.setId
        },
        data: {
            reps: data.reps,
            weight: data.weight
        }
    })

    if(!updatedSet) {
        return new Response(JSON.stringify({message: 'Could not update set'}), {status: 304})
    } else {
        return new Response(JSON.stringify(updatedSet), {status: 200})
    }
}