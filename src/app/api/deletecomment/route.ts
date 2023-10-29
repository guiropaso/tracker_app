import { db } from "@/lib/db"

export async function POST(req: Request) {
    const data = await req.json()
    const {setId} = data

    const deletedCommentSet = await db.set.update({
        where: {
            setId: setId
        },
        data: {
            comment: null
        }
    })

    if(!deletedCommentSet) {
        return new Response(JSON.stringify({message: 'Could not delete comment'}),{status: 402})
    }
    return new Response(JSON.stringify(deletedCommentSet),{status: 200})
}