import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  try {
    return await handler.GET(req);
  } catch (err) {
    console.error("[AUTH][GET]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    return await handler.POST(req);
  } catch (err) {
    console.error("[AUTH][POST]", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};