import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { limiter } from "../config/limiter"

export async function POST(req: Request) {
  const origin = req.headers.get('origin')
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
  const data = await req.json()
  const {setId} = data

  const deletedSet = await db.set.delete({
    where: {
      setId: setId
    }
  })
  
  
  if(deletedSet) {
    return new Response(JSON.stringify(deletedSet),{status: 200})
  }  
  return new Response(JSON.stringify({message: 'Set deletion could not be completed'}),{status: 402})
}  