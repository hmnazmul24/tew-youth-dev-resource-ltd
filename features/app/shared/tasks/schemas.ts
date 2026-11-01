import { taskCategories } from "@/constants/tasks"
import { z } from "zod"

export const taskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(255, "Title must be 255 characters or less"),

    description: z.string().nullable().optional(),

    studentName: z.string().optional(),
    phoneNumber: z
        .string()
        .regex(
            /^(?:\+88|88)?01[3-9]\d{8}$/,
            "Enter a valid Bangladeshi phone number",
        )
        .or(z.literal("")),
    address: z.string().optional(),

    category: z.enum(taskCategories).optional(),

    dueDate: z.date({
        error: "A valid due date is required",
    }),

    assignedTo: z
        .string()
        .trim()
        .min(1, "Assignment is required"),
})

export const updateTaskSchema = taskSchema.partial()

export type TaskSchemaType = z.infer<typeof taskSchema>

export type UpdateTaskSchemaType = z.infer<
    typeof updateTaskSchema
>
