import { db } from "@/lib/db"
import { Set } from "@prisma/client"
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