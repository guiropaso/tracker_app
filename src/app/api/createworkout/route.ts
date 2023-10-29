import { db } from "@/lib/db"

export async function POST(req: Request) {
    const data = await req.json()
    const {date, userEmail} = data

    const handledDate = new Date(date)
    console.log('handle: ',handledDate)
    const mins = handledDate.getTimezoneOffset()
    handledDate.setHours(-12,mins,0,0)

    const isoDate = handledDate.toISOString()
    console.log('iso: ',isoDate)


    const existingWorkout = await db.workout.findFirst({
      where: {
        AND: [
          {
            workoutDate: {
              equals: isoDate
            }
          },
          {
            userEmail: {
              equals: userEmail
            }
          }
        ]
      }
    })

    if(existingWorkout) {
      return new Response(JSON.stringify(existingWorkout), {status: 200})
    }

    const newWorkout = await db.workout.create({
      data: {
        userEmail: userEmail,
        workoutDate: isoDate,
      }
    })

    if(newWorkout) {
      return new Response(JSON.stringify(newWorkout), {status: 200})
    }
    return new Response(JSON.stringify({message: 'Could not create new workout'}), {status: 402})
}