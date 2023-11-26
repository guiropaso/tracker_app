"use client";
import { Button } from "./ui/button";
import { ChevronLeft, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AlertDialog, AlertDialogTrigger } from "./ui/alert-dialog";
import Link from "next/link";
import AddNewUserExerciseModal from "./AddNewUserExerciseModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import { createWk, getMuscleExercises } from "@/lib/api";
import { Exercise } from "@prisma/client";
import { seedDb } from "@/actions/serverActions";

type Props = {
  workoutDate: Date;
  session: Session;
  location: "header" | "body";
};

let filteredExercises: Exercise[];

export default function StartNewWorkout({
  workoutDate,
  session,
  location,
}: Props) {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [workoutId, setWorkoutId] = useState("");

  const muscles = [
    "Abs",
    "Back",
    "Biceps",
    "Chest",
    "Legs",
    "Shoulders",
    "Triceps",
  ];

  const { data } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => {
      if (session.user.email) {
        return getMuscleExercises(session.user.email);
      }
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });

  if (data) {
    if (selectedMuscle !== "") {
      filteredExercises = data.filter(
        (ex) => ex.exerciseMuscle === selectedMuscle
      );
    }
  }

  const mutationCreateWorkout = useMutation({
    mutationFn: (obj: { date: Date; userEmail: string }) => createWk(obj),
    onSuccess: (data) => {
      setWorkoutId(data.workoutId);
    },
  });

  function createWorkout() {
    const obj = {
      date: workoutDate,
      userEmail: session.user.email!,
    };
    console.log("obj passed: ", obj);
    mutationCreateWorkout.mutate(obj);
  }

  return (
    <>
      <Dialog modal={true}>
        <DialogTrigger onClick={createWorkout}>
          {location === "body" ? (
            <p className="w-full font-semibold flex items-center justify-center bg-primary text-white rounded-full p-3 mb-2">
              <Plus className="h-6 w-6" />
            </p>
          ) : (
            <Plus />
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[300px] md:max-w-md h-5/6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-left mb-20">
              Select Exercise
            </DialogTitle>
            <div className="">
              {selectedMuscle !== "" && (
                <ChevronLeft
                  className="hover:text-slate-700 absolute cursor-pointer bg-muted rounded-full h-7 w-7"
                  onClick={() => setSelectedMuscle("")}
                />
              )}
              <div className="flex flex-col justify-between pt-12">
                <ul>
                  {selectedMuscle && filteredExercises !== undefined
                    ? filteredExercises?.map((muscle) => (
                        <Link
                          key={muscle.exerciseName}
                          href={`?workoutId=${workoutId}&exName=${encodeURIComponent(
                            muscle.exerciseName
                          )}`}
                        >
                          <DialogClose asChild>
                            <li className="border-b py-4 text-left text-md px-2 cursor-pointer hover:bg-muted hover:text-primary">
                              {muscle.exerciseName}
                            </li>
                          </DialogClose>
                        </Link>
                      ))
                    : muscles.map((muscle) => (
                        <li
                          key={muscle}
                          onClick={() => setSelectedMuscle(muscle)}
                          className="border-b py-4 text-left text-md px-2 cursor-pointer hover:bg-muted"
                        >
                          {muscle}
                        </li>
                      ))}
                </ul>
                <div className="grid grid-flow-col gap-2 pb-4 mt-8">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-emerald-400 font-semibold hover:bg-emerald-700">
                        Add New
                      </Button>
                    </AlertDialogTrigger>
                    <AddNewUserExerciseModal />
                  </AlertDialog>
                  <DialogClose asChild>
                    <Button className="bg-sky-700 font-semibold hover:bg-sky-800">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {location === "body" && (
        <span className="block font-medium text-muted-foreground">
          Start New Workout
        </span>
      )}
    </>
  );
}
