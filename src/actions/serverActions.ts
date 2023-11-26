"use server";

import { db } from "@/lib/db";

export async function seedDb() {
  // const newWorkout = await db.workout.create({
  //   data: {
  //     userEmail: "guillerps1900@gmail.com",
  //     workoutDate: "2023-10-23T00:00:00.000Z",
  //   },
  // });

  const seedExercises = await db.exercise.createMany({
    data: [
      {
        exerciseName: "Cable Overhead Triceps Extension",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      {
        exerciseName: "Close Grip Barbell Bench Press",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      { exerciseName: "Dips", exerciseMuscle: "Triceps", userEmail: "default" },
      {
        exerciseName: "Dips Machine",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      {
        exerciseName: "Dumbbell Overhead Triceps Extension",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      {
        exerciseName: "EZ-Bar Skullcrusher",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      {
        exerciseName: "Lying Triceps Extension",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      {
        exerciseName: "Rope Push Down",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
      {
        exerciseName: "V-Bar Push Down",
        exerciseMuscle: "Triceps",
        userEmail: "default",
      },
    ],
  });

  // const newExercise = await db.set.createMany({data: [
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Hip Thrust', setNumber: 1, reps: 12, weight: 210},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Hip Thrust', setNumber: 2, reps: 12, weight: 200},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Hip Thrust', setNumber: 3, reps: 12, weight: 200},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Hip Thrust', setNumber: 4, reps: 10, weight: 190},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Hip Thrust', setNumber: 5, reps: 6, weight: 180},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Leg Extension Machine', setNumber: 1, reps: 15, weight: 130},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Leg Extension Machine', setNumber: 2, reps: 12, weight: 120},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Leg Extension Machine', setNumber: 3, reps: 12, weight: 120},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Leg Extension Machine', setNumber: 4, reps: 10, weight: 120},
  //   {workoutId: newWorkout.workoutId, exerciseName: 'Leg Extension Machine', setNumber: 5, reps: 8, weight: 110},
  // ]})

  // console.log('WorkoutId: ',newWorkout.workoutId)
  //console.log(seedExercises)
}

// export async function changeDateAction(date: Date, session: Session): Promise<{
//   handledDate: Date;
//   isoDate: string;
// }> {
//   const handledDate = date
//     console.log('handledDate from client: ', handledDate)
//     const mins = handledDate.getTimezoneOffset()
//     handledDate.setHours(0,- mins,0,0)
//     const isoDate = handledDate.toISOString()
//     return {handledDate, isoDate}

// }

// export async function addSet(data: Omit<Set, 'setId'>) {

//   console.log('received data in server action: ', data)
//   // const reps = Number(data.get('reps'))
//   // const weight = Number(data.get('weight'))
//   // const setNumber = Number(data.get('setNumber'))
//   // const workoutId = data.get('workoutId') as string
//   // const exerciseName = data.get('exerciseName') as string

//   const newSetCreated = await db.set.create({
//     data: {
//       reps: data.reps,
//       setNumber: data.setNumber,
//       weight: data.weight,
//       workoutId: data.workoutId,
//       exerciseName: data.exerciseName
//     }
//   })

//   //revalidatePath('/tracker')
//   console.log('Created set in server action: ',newSetCreated)
// }
