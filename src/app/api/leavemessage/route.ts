import { leaveMessageSchema } from "@/lib/types"
import { NextResponse } from "next/server"
import { limiter } from "../config/limiter"

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const remaining = await limiter.removeTokens(1)
  if(remaining < 0) {
    return new NextResponse(null,{
      status: 429,
      statusText: 'Too many requests',
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Content-Type': 'text/plain'
      }
    })
  }
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