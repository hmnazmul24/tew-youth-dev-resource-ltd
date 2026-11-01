import {
    text,
    timestamp,
    boolean,
    snakeCase,
    pgEnum,
    varchar,
    integer,
    index,
} from "drizzle-orm/pg-core"
import { createdAt, id, updatedAt } from "../helpers"
import { organizations, users } from "./auth"
import { taskCategories } from "@/constants/tasks"

export const categoryEnum = pgEnum(
    "categroy_enum",
    taskCategories,
)

export const tasks = snakeCase.table("tasks", {
    id,
    organizationId: text()
        .notNull()
        .references(() => organizations.id, {
            onDelete: "cascade",
        }),

    // Generic content fields (automatically mapped to snake_case by your helper)
    title: text().notNull(),
    description: text(),
    studentName: text(),
    phoneNumber: text(),
    address: text(),
    category: categoryEnum().default("General"),

    dueDate: timestamp().notNull(), // maps to due_date automatically

    // Flexible Assignment: "all", a specific role ("admin"), or multiple ("admin,manager")
    assignedTo: text().notNull().default("all"),

    completedById: text().references(() => users.id, {
        onDelete: "set null",
    }),

    isCompleted: boolean().default(false).notNull(),
    createdAt,
    updatedAt,
})
