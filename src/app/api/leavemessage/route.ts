import { leaveMessageSchema } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body:unknown = await request.json()
    let zodErrors = {}

    const result = leaveMessageSchema.safeParse(body)
    console.log(result)
    if(!result.success) {
        console.log(result.error)
        result.error.issues.forEach(issue => {
            zodErrors = {...zodErrors, [issue.path[0]]: issue.message}
        })
    }
    

    return NextResponse.json(
        Object.keys(zodErrors).length > 0
        ? {zodErrors}
        : {success: true}
    )
}