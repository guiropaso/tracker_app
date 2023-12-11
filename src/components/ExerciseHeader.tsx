import {
  AlarmClock,
  Dumbbell,
  HomeIcon,
  Menu,
  Minus,
  MoreVertical,
  Plus,
  PlusIcon,
  Trash,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
  SheetContent,
  SheetTrigger,
  Sheet,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import ToggleTheme from "./ToggleTheme";
import HeaderAvatar from "./HeaderAvatar";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { Set, Workout } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteExerciseFromTodaysWorkout,
  getMuscleExercises,
  getWorkout,
} from "@/lib/api";
import { Exercise } from "@prisma/client";
import DialogExSelection from "./DialogExSelection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";

type Props = {
  uniqueExercises:
    | {
        exerciseName: string;
        frequency: number;
      }[]
    | undefined;
  exNameParam: string;
  session: Session;
  workoutIdParam: string;
};

let filteredExercises: Exercise[];

export default function ExerciseHeader({
  uniqueExercises,
  exNameParam,
  session,
  workoutIdParam,
}: Props) {
  const [initialTime, setInitialTime] = useState<number>(60);
  const [currentSeconds, setCurrentSeconds] = useState<number>(initialTime);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [selectedMuscle, setSelectedMuscle] = useState<string>("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data, error, isError } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => {
      if (session.user.email) {
        return getMuscleExercises(session.user.email);
      }
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isTimerRunning && !isPaused) {
      console.log("useeffect");
      const id = setInterval(() => {
        if (currentSeconds > 0) {
          setCurrentSeconds((prev) => prev - 1);
        } else {
          setIsTimerRunning(false);

          setIsPaused(false);
        }
      }, 1000);

      return () => {
        clearInterval(id);
      };
    }
  }, [currentSeconds, isPaused]);

  if (data) {
    if (selectedMuscle !== "") {
      filteredExercises = data.filter(
        (ex) => ex.exerciseMuscle === selectedMuscle
      );
    }
  }

  function startTimer() {
    setIsTimerRunning(true);
    setIsPaused(false);
    setCurrentSeconds(initialTime);
  }

  function handleTimerOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isPaused && isTimerRunning) {
      setCurrentSeconds(Number(e.target.value));
    }
    if (!isTimerRunning) {
      setInitialTime(Number(e.target.value));
    }
  }

  const queryClient = useQueryClient();

  const mutationRemoveExerciseFromWorkout = useMutation({
    mutationFn: (detailsObj: { workout: string; exercise: string }) =>
      deleteExerciseFromTodaysWorkout(detailsObj),
    onMutate: async (detailsObj) => {
      await queryClient.cancelQueries({
        queryKey: ["sets", detailsObj.workout, detailsObj.exercise],
      });
      const previousSets = queryClient.getQueryData([
        "sets",
        detailsObj.workout,
        detailsObj.exercise,
      ]);
      queryClient.setQueryData(
        ["sets", detailsObj.workout, detailsObj.exercise],
        (old: Set[] | undefined) =>
          old?.filter(
            (set) =>
              set.workoutId !== detailsObj.workout &&
              set.exerciseName !== detailsObj.exercise
          )
      );
      return { previousSets };
    },
    onError: (error) => {
      console.log("error adding set on mutate: ", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout"] });
    },
    onSettled: () => {},
  });

  async function deleteExerciseFromWorkout(workout: string, exercise: string) {
    const exerciseToRemove = {
      workout,
      exercise,
    };

    mutationRemoveExerciseFromWorkout.mutate(exerciseToRemove);
  }

  return (
    <header className="bg-background z-30 w-full border-b">
      <div className="mx-auto container flex justify-between p-4 items-center">
        <div className="flex space-x-3 w-full items-center justify-center">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger className="">
              <div className=" p-2 rounded-full box-content bg-muted ">
                <Menu className="w-5 h-5" />
              </div>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="h-full flex flex-col justify-between">
                <nav className="flex flex-col pt-10">
                  <ul>
                    {uniqueExercises?.map((ex, i) => (
                      <li key={i} className="hover:bg-muted px-2">
                        <div className="flex justify-between items-center border-b">
                          <SheetClose asChild>
                            <Link
                              href={{
                                pathname: "/tracker",
                                query: {
                                  workoutId: workoutIdParam,
                                  exName: ex.exerciseName,
                                },
                              }}
                              className="w-full"
                            >
                              <div className="py-4 w-5/6">
                                <p className="text-lg font-semibold">
                                  {ex.exerciseName}
                                </p>
                                <span className="text-sm text-muted-foreground">
                                  {ex.frequency} sets
                                </span>
                              </div>
                            </Link>
                          </SheetClose>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <MoreVertical className="cursor-pointer" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-48 absolute right-0">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem
                                    className="hover:bg-muted cursor-pointer"
                                    onClick={() =>
                                      deleteExerciseFromWorkout(
                                        workoutIdParam,
                                        ex.exerciseName
                                      )
                                    }
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span className="text-muted-foreground text-sm">
                                      Delete Exercise
                                    </span>
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="w-full">
                  <SheetClose asChild>
                    <Link href="/" className="w-full">
                      <p className="flex items-center justify-center m-5 text-lg text-muted-foreground">
                        <HomeIcon className="mr-3 mb-1" /> Home
                      </p>
                    </Link>
                  </SheetClose>
                  <DialogExSelection
                    selectedMuscle={selectedMuscle}
                    filteredExercises={filteredExercises}
                    setSelectedMuscle={setSelectedMuscle}
                    workoutIdParam={workoutIdParam}
                    setSheetOpen={setSheetOpen}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Dumbbell className="text-secondary-foreground w-7 h-7" />
          <div className="mydiv w-full">
            <h2 className="font-semibold text-primary p-2">{`${exNameParam}`}</h2>
          </div>
        </div>
        <div className="flex space-x-3 items-center">
          <Button variant="ghost" className="" size="icon">
            <Dialog modal={false}>
              <DialogTrigger>
                {isTimerRunning ? (
                  <span className="font-semibold text-xl">
                    {currentSeconds}
                  </span>
                ) : (
                  <AlarmClock className="h-6 w-6" />
                )}
              </DialogTrigger>
              <DialogContent>
                <h3 className="text-2xl font-semibold">Timer</h3>
                <div className="flex items-center justify-center gap-5 p-5">
                  <Button
                    className=""
                    size={"sm"}
                    disabled={isTimerRunning && !isPaused}
                  >
                    <Minus
                      onClick={() =>
                        isTimerRunning && isPaused
                          ? setCurrentSeconds((prev) => prev - 10)
                          : setInitialTime((prev) => prev - 10)
                      }
                    ></Minus>
                  </Button>
                  <input
                    type="number"
                    name="timerInput"
                    inputMode="numeric"
                    disabled={isTimerRunning && !isPaused}
                    onChange={(e) => handleTimerOnChange(e)}
                    className="text-center w-20 leading-10 font-semibold text-2xl rounded-sm border-b dark:border-none dark:bg-transparent remove-arrow"
                    value={
                      isTimerRunning && currentSeconds !== initialTime
                        ? currentSeconds
                        : initialTime
                    }
                  />

                  <Button
                    className=""
                    size={"sm"}
                    disabled={isTimerRunning && !isPaused}
                  >
                    <Plus
                      onClick={() =>
                        isTimerRunning && isPaused
                          ? setCurrentSeconds((prev) => prev + 10)
                          : setInitialTime((prev) => prev + 10)
                      }
                    ></Plus>
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {isTimerRunning ? (
                    <>
                      <Button
                        size={"lg"}
                        className="font-semibold"
                        onClick={() => setIsPaused((prev) => !prev)}
                      >
                        {isPaused ? "Resume" : "Pause"}
                      </Button>
                      <Button
                        size={"lg"}
                        className="font-semibold"
                        onClick={() => setIsTimerRunning(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size={"lg"}
                      className="font-semibold"
                      onClick={startTimer}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </Button>
          <ToggleTheme />
          {session.user && <HeaderAvatar user={session.user} />}
        </div>
      </div>
    </header>
  );
}
