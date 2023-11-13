
import { Exercise, Set } from '@prisma/client'
import { Workout } from './types'
import axios from 'axios'

export async function getWorkout(workoutParam: string | null, date: Date ) {
    
    if(workoutParam) {
        const {data: workout}: {data: Workout | {}} = await axios.post('http://localhost:3000/api/getworkoutbyid',{workoutId: workoutParam})
        return workout
    } else {
        const {data:workout}: {data: Workout | {}} = await axios.post('http://localhost:3000/api/getworkoutbydate',{workoutDate: date})
        return workout
    }    
}

export async function getSets(currentWorkout: string,currentExercise: string) {
    const {data: sets}:{data: Set[]} = await axios.post('http://localhost:3000/api/getworkoutdetails',{currentWorkout, currentExercise})
    return sets
}

export async function addSet(passedSet: Omit<Set,'setId'>) {
    const {data: freshSet} = await axios.post('http://localhost:3000/api/addset',passedSet)
    return freshSet
}

export async function updateSet(passedSet: Set) {
    const {data: set}: {data: Set} = await axios.post('http://localhost:3000/api/updateset',passedSet)
    return set
}

export async function deleteSet(setId: string) {
    const {data: set}: {data: Set} = await axios.post('http://localhost:3000/api/deleteset',{setId})
    return set
}

export async function getMuscleExercises(email: string) {
    const {data: setArray}: {data: Exercise[]} = await axios.post('http://localhost:3000/api/getmuscles',{email})
    return setArray
}

export async function addCustomExercise(exerciseName: string, group: string, userEmail: string) {
    const {data: newExercise} : {data: Exercise} = await axios.post('http://localhost:3000/api/addcustomexercise', {exerciseName, group, userEmail})
    return newExercise
}

export async function deleteExerciseFromTodaysWorkout(workoutobj: {workout: string, exercise: string}) {
    const {data} = await axios.post('http://localhost:3000/api/deleteexercisefromtodaysworkout',workoutobj)
    return data
}

export async function createWk(obj: {date: Date, userEmail: string}) {
    const {data} = await axios.post('http://localhost:3000/api/createworkout', obj)
    return data
}

export async function editComment(obj: Set) {
    const {data} = await axios.post('http://localhost:3000/api/editcomment', obj)
    return data
}

export async function deleteComment(setId: string) {
    const {data} = await axios.post('http://localhost:3000/api/deletecomment',{setId})
    return data
}

export async function addComment(comment: {setId: string, comment: string}){
    const {data} = await axios.post('http://localhost:3000/api/addcomment',comment)
    return data
}