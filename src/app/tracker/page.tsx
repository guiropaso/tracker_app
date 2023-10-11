// "use client"
// import { Button } from '@/components/ui/button'
// import { Dumbbell, Loader2, Menu, MoreVertical, Plus } from 'lucide-react'
// import ToggleTheme from '@/components/ToggleTheme'
// import HeaderAvatar from '@/components/HeaderAvatar'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import StartNewWorkout from '@/components/StartNewWorkout'
// import TodaysWorkout from '@/components/TodaysWorkout'
// import { db } from '@/lib/db'
// import { SheetContent, SheetTrigger, Sheet } from '@/components/ui/sheet'
// import Link from 'next/link'
// import ChangeDate from '@/components/ChangeDate'
// import { useSearchParams, useRouter, usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { Set } from "@prisma/client"

// type Props = {
//   searchParams:  {[key:string]: string | string[]  | undefined }
// }

// const muscles = [
//   'Abs',
//   'Back',
//   'Biceps',
//   'Chest',
//   'Legs',
//   'Shoulders',
//   'Triceps',
// ]

// type UniqueEx = {
//   exerciseName: string,
//   frequency: number
// }[]



// export default function Page() {
//   const [workoutDate, setWorkoutDate] = useState<Date>(new Date())
//   const [workoutIdentifier, setWorkoutIdentifier] = useState<string>('')
//   const [uniqueExercises, setUniqueExercises] = useState<UniqueEx>([])
//   const [setRecords, setSetRecords] = useState<Set[] | null>(null)
//   const [isNewElementAdded, setIsNewElementAdded] = useState<boolean>(false)
  
//   const params = useSearchParams()
//   const workoutIdParam = params.get('workoutId')
//   const exNameParam = params.get('exName')
//   console.log(exNameParam)
  

//   const router = useRouter()
//   const path = usePathname()
  
  
  
//   const {data: session} = useSession()

  
//   useEffect(() => {
//     const getDataFromParam = async () => {
//       const res = await fetch('http://localhost:3000/api/getworkoutbyid',{
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//           workoutId: workoutIdParam,
//         })
//       })
  
//       const dbResult = await res.json()

//       if(dbResult.workoutId) {
//         setWorkoutIdentifier(dbResult.workoutId)
//         const dateString = dbResult.workoutDate
//         const newDate = new Date(dateString)
//         newDate.setDate(newDate.getDate() + 1)
//         setWorkoutDate(newDate)
//         retrieveWorkoutDetails(dbResult.sets)
//       }
//     }
  
//     if(workoutIdParam || isNewElementAdded) {
//       setIsNewElementAdded(false)
//       getDataFromParam()
//     }

//   },[isNewElementAdded])


  
  
//   useEffect(() => {
//     const getDataFromDateChange = async () => {
//       console.log('llamada a Effect date')
//       const res = await fetch('http://localhost:3000/api/getworkoutbydate',{
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({
//           workoutDate: workoutDate,
//           session: session
//         })
//       })

//     const dbResult = await res.json()

//     if(dbResult.workoutId) {
//       setWorkoutIdentifier(dbResult.workoutId)
//       retrieveWorkoutDetails(dbResult.sets)
//       if(exNameParam) {
//         router.push(`${path}?workoutId=${dbResult.workoutId}&exName=${exNameParam}`)
//       } else {
//         router.push(`${path}?workoutId=${dbResult.workoutId}`)
//       }
//     } else {
//       setWorkoutIdentifier('')
//       router.push(`${path}`)
//     }
//   }

//   getDataFromDateChange()

//   },[workoutDate])
  

//   function retrieveWorkoutDetails(sets: Set[]) {
//     const exerciseFrequency: Record<string, number> = {}
    
//     sets.forEach((record: Set) => {
//         const exerciseName = record.exerciseName
//         exerciseFrequency[exerciseName] = (exerciseFrequency[exerciseName] || 0) + 1
//     })

//     setUniqueExercises(Object.keys(exerciseFrequency).map(exerciseName => ({
//     exerciseName,
//     frequency: exerciseFrequency[exerciseName]

//     })))

//     setSetRecords(sets)
//   }


//   if(!session || !session.user.email) {
//     return 
//   } 


//   return (
//     <>
//       {workoutIdentifier && exNameParam
//         ? 
//         <header className='bg-background z-30 w-full border-b'>
//           <div className='mx-auto container flex justify-between p-4 items-center'>
//             <div className='flex space-x-3 items-center justify-center'>
//               <Sheet>
//                 <SheetTrigger className=''>
//                     <div className=' p-2 rounded-full box-content bg-muted '>
//                         <Menu className='w-5 h-5' />
//                     </div>
//                 </SheetTrigger>
//                 <SheetContent side='left'>
//                     <nav className='flex flex-col pt-10'>
//                         {uniqueExercises.map((ex,i) => (
//                             <Link
//                             key={i}
//                             href={'/'}
//                             className='px-2 w-full'
//                             >
//                               <div className='flex justify-between items-center gap-2 border-b'>
//                                 <div className='py-4'>
//                                   <p className='text-lg font-semibold'>{ex.exerciseName}</p>
//                                   <span className='text-sm text-muted-foreground'>{ex.frequency} sets</span>
//                                 </div>
//                                 <div>
//                                 <MoreVertical />
//                                 </div>

//                               </div>
//                             </Link>
//                         ))}
//                     </nav>
//                 </SheetContent>
//               </Sheet>
//               <Dumbbell className='text-secondary-foreground w-7 h-7' />
//               <h2 className='font-semibold text-2xl text-primary p-2'>{`${exNameParam}`}</h2>
//             </div>
//             <div className='flex space-x-3 items-center'>
//               <Button variant='ghost' className='' size='icon'>
//                 <Plus className='h-6 w-6' />
//               </Button>
//               <ToggleTheme />
//                           {session.user && <HeaderAvatar user = {session.user} />}
//             </div>
//           </div>
//         </header>
//         :
//         <header className='bg-background z-30 w-full border-b'>
//           <div className='mx-auto container flex justify-between p-4 items-center'>
//             <div className='flex space-x-3 items-center'>
//               <Dumbbell className='text-secondary-foreground w-7 h-7' />
//               <h2 className='font-semibold text-2xl text-primary'>Gym Tracker</h2>
//             </div>
//             <div className='flex space-x-3 items-center'>
//               <Button variant='ghost' className='' size='icon'>
//                 <Plus className='h-6 w-6' />
//               </Button>
//               <ToggleTheme />
//               {session.user && <HeaderAvatar user = {session.user} />}
//             </div>
//           </div>
//         </header>
//       }
//       <ChangeDate currDate={workoutDate} setDateState={setWorkoutDate}/>

//       {session && workoutIdentifier !== '' && setRecords !== null && uniqueExercises !== null
//       ? <TodaysWorkout workoutFromDb={workoutIdentifier} exNameParam={exNameParam} workoutParam={workoutIdParam} setRecords={setRecords} uniqueExercises={uniqueExercises} setIsNewElementAdded={setIsNewElementAdded}/>
//       :
//       <div className='h-full'>
//         <div className='h-2/3 flex items-center justify-center'>
//           <h2 className='text-lg font-medium text-muted-foreground'>Workout Log Empty</h2>
//         </div>
//         <StartNewWorkout />
//       </div>
//       }

//     </>
//   )
// }