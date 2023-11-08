import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    invariant(params.noteId, "noteId not found");
  
    await deleteNote({ id: params.noteId, userId });
  
    return redirect("/notes");
  };