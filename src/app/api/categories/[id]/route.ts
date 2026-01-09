import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deleteCategory } from "@/services/categoryService"

// DELETE /api/categories/[id] - Delete a category
// Blocks if category has existing transactions
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteCategory(params.id, session.user.id)

    return NextResponse.json({ success: true, message: "Category deleted" })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    )
  }
}
