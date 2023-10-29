import { db } from "@/lib/db"
import { Set } from "@prisma/client"

export async function POST(req: Request) {
    const data: Set = await req.json()
    const {setId, comment} = data

    const updatedSet = await db.set.update({
        where: {
            setId: setId
        },
        data: {
            comment: comment
        }
    })

    if(!updatedSet) {
        return new Response(JSON.stringify({message: 'Could not update comment'}),{status: 304})    
    }
    return new Response(JSON.stringify(updatedSet),{status: 200})

}