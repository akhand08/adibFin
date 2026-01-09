import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getCategoriesByUser, createCategory } from "@/services/categoryService"
import { createCategorySchema } from "@/lib/validations"
import { TransactionType } from "@prisma/client"

// GET /api/categories - List all categories for user
// Optional query param: ?type=EXPENSE or ?type=INCOME
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") as TransactionType | null

    const categories = await getCategoriesByUser(session.user.id, type || undefined)

    return NextResponse.json({ success: true, data: categories })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create new category
// Body: { name: "Food", type: "EXPENSE" }
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    const category = await createCategory(session.user.id, validatedData)

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: 500 }
    )
  }
}
