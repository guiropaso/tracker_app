import { db } from "@/lib/db"

export async function POST(req: Request) {
    const body = await req.json()
    const {setId, comment} = body

    const commentDb = await db.set.update({
        where: {
            setId: setId
        },
        data: {
            comment: comment
        }
    })

    if(!commentDb) {
        return new Response(JSON.stringify({message: 'Could not add comment'}), {status: 402})
    }
    return new Response(JSON.stringify(commentDb), {status: 200})
}