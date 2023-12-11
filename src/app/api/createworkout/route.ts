import { db } from "@/lib/db";
import { limiter } from "../config/limiter";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const remaining = await limiter.removeTokens(1);
  if (remaining < 0) {
    return new NextResponse(null, {
      status: 429,
      statusText: "Too many requests",
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Content-Type": "text/plain",
      },
    });
  }

  const data = await req.json();
  const { date, userEmail } = data;
  const handledDate = new Date(date);
  console.log("handle: ", handledDate);
  const mins = handledDate.getTimezoneOffset();
  let offsetHours;
  process.env.NODE_ENV === "production"
    ? (offsetHours = -24)
    : (offsetHours = -12);
  handledDate.setHours(offsetHours, mins, 0, 0);

  const isoDate = handledDate.toISOString();
  console.log("iso: ", isoDate);

  const existingWorkout = await db.workout.findFirst({
    where: {
      AND: [
        {
          workoutDate: {
            equals: isoDate,
          },
        },
        {
          userEmail: {
            equals: userEmail,
          },
        },
      ],
    },
  });

  if (existingWorkout) {
    return new Response(JSON.stringify(existingWorkout), { status: 200 });
  }

  const newWorkout = await db.workout.create({
    data: {
      userEmail: userEmail,
      workoutDate: isoDate,
    },
  });

  if (newWorkout) {
    return new Response(JSON.stringify(newWorkout), { status: 200 });
  }
  return new Response(
    JSON.stringify({ message: "Could not create new workout" }),
    { status: 402 }
  );
}
