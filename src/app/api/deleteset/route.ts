import { db } from "@/lib/db"

export async function POST(req: Request) {
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