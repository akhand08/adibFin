import { z } from "zod"
import { TransactionType, ProjectStatus, FlowType } from "@prisma/client"

// =====================
// USER SCHEMAS
// =====================

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// =====================
// CATEGORY SCHEMAS
// =====================

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.nativeEnum(TransactionType),
})

// =====================
// TRANSACTION SCHEMAS
// =====================

export const createTransactionSchema = z.object({
  date: z.string().or(z.date()),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  investmentProjectId: z.string().optional(),
  note: z.string().optional(),
})

export const updateTransactionSchema = z.object({
  date: z.string().or(z.date()).optional(),
  type: z.nativeEnum(TransactionType).optional(),
  categoryId: z.string().optional(),
  amount: z.number().positive("Amount must be positive").optional(),
  investmentProjectId: z.string().optional(),
  note: z.string().optional(),
})

// =====================
// INVESTMENT SCHEMAS
// =====================

export const createInvestmentSchema = z.object({
  name: z.string().min(1, "Investment name is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.string().or(z.date()).optional(),
})

export const addReturnSchema = z.object({
  totalReturned: z.number().positive("Total returned must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().or(z.date()).optional(),
})

export const updateInvestmentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
})

// =====================
// TYPE EXPORTS
// =====================

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>
export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>
export type AddReturnInput = z.infer<typeof addReturnSchema>
export type UpdateInvestmentInput = z.infer<typeof updateInvestmentSchema>
