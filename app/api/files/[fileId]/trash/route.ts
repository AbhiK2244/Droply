import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await props.params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // grab the file
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // toggle the file's isTrashed status
    // todo console log this updatedFiles
    const updatedFiles = await db
      .update(files)
      .set({ isTrashed: !file.isTrashed })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    console.log("updated files (in trash folder): ", updatedFiles);

    const [updatedFile] = updatedFiles;

    const action = updatedFile.isTrashed ? "moved to trash" : "restored";

    return NextResponse.json({
      message: `File ${action} successfully`,
      ...updatedFile,
    });
  } catch (error) {
    console.log("Error updating the trash status:", error);
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}
