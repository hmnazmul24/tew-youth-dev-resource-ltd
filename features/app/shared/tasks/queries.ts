import { db } from "@/drizzle/db"
import { withPermission } from "@/lib/dal"
import { NotFoundError } from "@/utils/error-constructor"
import { cacheTag } from "next/cache"

export const getTasks = withPermission(
    { tasks: ["view"] },
    async ({ org, orgMemberRole }) => {
        "use cache"
        cacheTag("tasks")

        return await db.query.tasks.findMany({
            where: {
                assignedTo: { OR: ["all", orgMemberRole] },
            },
            orderBy: (tasks, { desc }) => [
                desc(tasks.createdAt),
            ],
            limit: 30,
        })
    },
)

export const getTaskById = withPermission(
    { tasks: ["view"] },
    async (_, id: string) => {
        "use cache"
        cacheTag("tasks", `task:${id}`)

        const res = await db.query.tasks.findFirst({
            where: { id },
        })

        if (!res) {
            throw new NotFoundError()
        }

        return res
    },
)
