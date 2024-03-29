import React, { useRef, useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { MessageSquare, Minus, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { addSet, deleteSet, updateSet } from "@/lib/api";
import { Set } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSets } from "@/lib/api";
import { twMerge } from "tailwind-merge";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import Comment from "./Comment";

export default function ExerciseDetails2() {
  const [formState, setFormState] = useState({ weight: 0, reps: 0 });
  const [isEditingSet, setIsEditingSet] = useState(false);
  const [editingSetId, setEditingSetId] = useState<Set | null>();

  const inputWeightRef = useRef<HTMLInputElement | null>(null);
  const inputRepsRef = useRef<HTMLInputElement | null>(null);

  const queryClient = useQueryClient();

  const params = useSearchParams();
  const currentExercise = params.get("exName")!;
  const workoutId = params.get("workoutId")!;

  const { data: sets } = useQuery({
    queryKey: ["sets", workoutId, currentExercise],
    queryFn: () => getSets(workoutId, currentExercise),
  });

  const mutationPostNewSet = useMutation({
    mutationFn: (newSet: Set) => addSet(newSet),
    onMutate: async (newSet) => {
      await queryClient.cancelQueries({
        queryKey: ["sets", workoutId, currentExercise],
      });
      const previousSets = queryClient.getQueryData([
        "sets",
        workoutId,
        currentExercise,
      ]);
      queryClient.setQueryData(
        ["sets", workoutId, currentExercise],
        (old: Set[] | undefined) => [...old!, newSet]
      );
      return { previousSets };
    },
    onError: (error, newSet, context) => {
      queryClient.setQueryData(
        ["sets", workoutId, currentExercise],
        context?.previousSets
      );
      console.log("error adding set on mutate: ", error);
      console.log("Tried with object: ", newSet);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["workout"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets", workoutId, currentExercise],
      });
    },
  });

  const mutationUpdateSet = useMutation({
    mutationFn: (updatedSet: Set) => updateSet(updatedSet),
    onMutate: async (updatedSet) => {
      await queryClient.cancelQueries({
        queryKey: ["sets", workoutId, currentExercise],
      });
      const previousSets = queryClient.getQueryData([
        "sets",
        workoutId,
        currentExercise,
      ]);
      queryClient.setQueryData(
        ["sets", workoutId, currentExercise],
        (old: Set[] | undefined) =>
          old?.map((set) => (set.setId === updatedSet.setId ? updatedSet : set))
      );
      return { previousSets };
    },
    onError: (error, updatedSet, context) => {
      queryClient.setQueryData(
        ["sets", workoutId, currentExercise],
        context?.previousSets
      );
      console.log("error updating set on mutate: ", error);
      console.log("Tried with object: ", updatedSet);
    },
    onSuccess: () => {
      setIsEditingSet(false);
      setEditingSetId(null);
      queryClient.refetchQueries({ queryKey: ["workout"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets", workoutId, currentExercise],
      });
    },
  });

  const mutationDeleteSet = useMutation({
    mutationFn: (setId: string) => deleteSet(setId),
    onMutate: async (setId) => {
      await queryClient.cancelQueries({
        queryKey: ["sets", workoutId, currentExercise],
      });
      const previousSets = queryClient.getQueryData([
        "sets",
        workoutId,
        currentExercise,
      ]);
      queryClient.setQueryData(
        ["sets", workoutId, currentExercise],
        (old: Set[] | undefined) => old?.filter((set) => set.setId !== setId)
      );
      return { previousSets };
    },
    onError: (error, setId, context) => {
      queryClient.setQueryData(
        ["sets", workoutId, currentExercise],
        context?.previousSets
      );
      console.log("error deleting set on mutate: ", error);
      console.log("Tried with id: ", setId);
    },
    onSuccess: () => {
      setIsEditingSet(false);
      setEditingSetId(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["sets", workoutId, currentExercise],
      });
      queryClient.invalidateQueries({ queryKey: ["workout"] });
    },
  });

  if (sets) {
    const handleClickedSet = (
      set: Set,
      e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      const clickedSet = e.currentTarget;
      const clickedSetId = clickedSet.getAttribute("data-setid");

      if (isEditingSet && clickedSetId === editingSetId?.setId) {
        setIsEditingSet(false);
        setEditingSetId(null);
      } else {
        setIsEditingSet(true);
        setFormState({ reps: set.reps, weight: set.weight });
        setEditingSetId(set);
      }
    };

    const submitSet = () => {
      const set: Set = {
        setId: "xxx",
        reps: formState.reps,
        weight: formState.weight,
        workoutId: workoutId,
        exerciseName: currentExercise!,
        setNumber: 1,
        comment: null,
      };
      mutationPostNewSet.mutate(set);
    };

    const submitUpdatedSet = () => {
      if (editingSetId) {
        const passingSet = {
          setId: editingSetId.setId,
          workoutId: editingSetId.workoutId,
          exerciseName: editingSetId.exerciseName,
          setNumber: editingSetId.setNumber,
          reps: formState.reps,
          weight: formState.weight,
          comment: editingSetId.comment,
        };
        mutationUpdateSet.mutate(passingSet);
      }
    };

    const clearSet = () => {
      setIsEditingSet(false);
      setEditingSetId(null);
      setFormState({ reps: 0, weight: 0 });
    };

    const deleteSet = () => {
      if (editingSetId) {
        mutationDeleteSet.mutate(editingSetId.setId);
      }
    };

    const increaseReps = () => {
      setFormState({
        ...formState,
        reps: formState.reps + 1,
      });
    };

    const decreaseReps = () => {
      setFormState({
        ...formState,
        reps: formState.reps - 1,
      });
    };

    const increaseWeight = () => {
      setFormState({
        ...formState,
        weight: formState.weight + 5,
      });
    };

    const decreaseWeight = () => {
      setFormState({
        ...formState,
        weight: formState.weight - 5,
      });
    };

    return (
      <div className="container max-w-[700px] my-10">
        <form>
          <h5 className="font-semibold">WEIGHT (lbs)</h5>
          <Separator />
          <div className="flex items-center justify-center gap-5 p-5">
            <Button
              className=""
              size={"sm"}
              onClick={decreaseWeight}
              type="button"
            >
              <Minus></Minus>
            </Button>
            <input
              type="number"
              name="weight"
              ref={inputWeightRef}
              inputMode="numeric"
              className="text-center w-20 leading-10 font-semibold text-xl rounded-sm border-b dark:border-none dark:bg-transparent remove-arrow"
              value={formState.weight}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  weight: Number(e.target.value),
                });
              }}
            />

            <Button
              className=""
              size={"sm"}
              type="button"
              onClick={increaseWeight}
            >
              <Plus></Plus>
            </Button>
          </div>

          {/* <p className='text-center text-red-500 font-semibold'>{`${errors.weight.message}`}</p> */}

          <h5 className="font-semibold">REPS</h5>
          <Separator />
          <div className="flex items-center justify-center gap-5 p-5">
            <Button
              className=""
              type="button"
              size={"sm"}
              onClick={decreaseReps}
            >
              <Minus></Minus>
            </Button>
            <input
              type="number"
              name="reps"
              inputMode="numeric"
              className="text-center w-20 leading-10 font-semibold text-xl rounded-sm border-b dark:border-none dark:bg-transparent remove-arrow"
              value={formState.reps}
              ref={inputRepsRef}
              onChange={(e) => {
                setFormState({
                  ...formState,
                  reps: Number(e.target.value),
                });
              }}
            />
            <Button
              className=""
              size={"sm"}
              type="button"
              onClick={increaseReps}
            >
              <Plus></Plus>
            </Button>
          </div>

          {/* <p className='text-center text-red-500 font-semibold'>{`${errors.reps.message}`}</p> */}

          <div className="flex gap-5 items-center justify-center mt-5">
            <Button
              size={"lg"}
              className="font-semibold text-lg px-16 bg-emerald-400 hover:bg-emerald-400"
              type="button"
              onClick={isEditingSet ? submitUpdatedSet : submitSet}
            >
              {isEditingSet ? "Update" : "Save"}
            </Button>
            <Button
              size={"lg"}
              className={twMerge(
                "font-semibold text-lg px-16 bg-sky-700 hover:bg-sky-700",
                isEditingSet && "bg-primary hover:bg-primary"
              )}
              type="button"
              onClick={isEditingSet ? deleteSet : clearSet}
            >
              {isEditingSet ? "Delete" : "Clear"}
            </Button>
          </div>
        </form>
        {/* ////////////////////////// */}
        {sets && (
          <ul className="list-none container mx-auto my-20 ">
            {sets.map((set, index) => (
              <li
                key={set.setId}
                className={twMerge(
                  "cursor-pointer px-2 hover:bg-muted",
                  editingSetId?.setId === set.setId && "bg-muted"
                )}
              >
                <div className="flex w-full items-center border-b py-3">
                  <div>
                    <Comment set={set} />
                  </div>
                  <div
                    className="flex justify-between w-full"
                    data-setid={set.setId}
                    onClick={(e) => handleClickedSet(set, e)}
                  >
                    <p className="font-semibold text-lg ml-10">{index + 1}</p>
                    <p className="font-semibold text-lg">
                      {set.weight}{" "}
                      <span className="text-muted-foreground text-sm">lbs</span>
                    </p>
                    <p className="font-semibold text-lg">
                      {set.reps}{" "}
                      <span className="text-muted-foreground text-sm">
                        reps
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
