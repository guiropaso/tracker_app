import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCustomExercise, getMuscleExercises } from "@/lib/api";
import { Exercise, Muscle } from "@prisma/client";

const muscles = [
  { value: "abs", label: "Abs" },
  { value: "back", label: "Back" },
  { value: "biceps", label: "Biceps" },
  { value: "chest", label: "Chest" },
  { value: "legs", label: "Legs" },
  { value: "shoulders", label: "Shoulders" },
  { value: "triceps", label: "Triceps" },
];

export default function AddNewUserExerciseModal() {
  type optionsObj = {
    exerciseName: string;
    group: string;
    userEmail: string;
  };

  const queryClient = useQueryClient();

  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [muscleValue, setMuscleValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const { data, error, isError } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => {
      if (session && session.user && session.user.email) {
        return getMuscleExercises(session.user.email);
      }
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const mutationAddCustomExercise = useMutation({
    mutationFn: (options: optionsObj) =>
      addCustomExercise(options.exerciseName, options.group, options.userEmail),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["exercises"] });
      const previousExercises = await queryClient.getQueryData(["exercises"]);
      //queryClient.setQueryData(['exercises'],(old: Exercise[]) => [...old, options.exerciseName])
      return { previousExercises };
    },
    onError: (error, options, context) => {
      queryClient.setQueryData(["exercises"], context?.previousExercises);
      console.log("error adding set on mutate: ", error);
      console.log("Tried with object: ", options);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["exercises"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });

  function handleAddExercise() {
    if (muscleValue && inputValue) {
      if (session) {
        const uppercaseValue =
          muscleValue[0].toUpperCase() + muscleValue.slice(1);

        console.log(uppercaseValue, inputValue);
        const optionsObj = {
          exerciseName: inputValue,
          group: uppercaseValue,
          userEmail: session?.user.email!,
        };
        mutationAddCustomExercise.mutate(optionsObj);
      }
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.currentTarget.value);
  }

  return (
    <AlertDialogContent className="w-5/6">
      <AlertDialogHeader className=" text-left">
        <AlertDialogTitle className="mb-4">Add a New Exercise</AlertDialogTitle>
        <div>
          <div className="mb-4">
            <p>Name:</p>
            <Input
              onChange={(e) => handleChange(e)}
              value={inputValue}
              className="mt-2"
            />
          </div>
          <div>
            <p>Category:</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between mt-2"
                >
                  {muscleValue
                    ? muscles.find((muscle) => muscle.value === muscleValue)
                        ?.label
                    : "Select muscle..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command className="pointer-events-auto">
                  <CommandEmpty>No muscle found.</CommandEmpty>
                  <CommandGroup>
                    {muscles.map((muscle) => (
                      <CommandItem
                        key={muscle.value}
                        value={muscle.value}
                        onSelect={(currentValue) => {
                          setMuscleValue(
                            currentValue === muscleValue ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            muscleValue === muscle.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {muscle.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </AlertDialogHeader>
      <div className="flex justify-end space-x-2">
        <AlertDialogCancel onClick={() => setMuscleValue("")}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleAddExercise}
          disabled={muscleValue === "" || inputValue === ""}
          className="mt-2"
        >
          Add Exercise
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
  );
}
