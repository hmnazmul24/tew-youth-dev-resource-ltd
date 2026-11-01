"use server"

import { db } from "@/drizzle/db"
import { transactions } from "@/drizzle/schema"
import { withPermission } from "@/lib/dal"
import { createSSLSession } from "@/lib/ssl-commerz/actions"
import { redirect } from "next/navigation"

export async function oneTimePayment({
    orgId,
}: {
    orgId: string
}) {
    const application =
        await db.query.branchApplications.findFirst({
            where: { organizationId: orgId },
        })
    if (!application) {
        redirect("/")
    }

    const orderId = crypto.randomUUID().slice(0, 16)
    const session = await createSSLSession({
        orderId,
        amount: application.oneTimePaymentAmount,
        customerName: application.ownerName,
        customerEmail: application.email,
        customerPhone: application.mobile,
        address: application.area,
        city: application.districtId,
        postcode: application.postalCode,
        type: "branch",
    })

    await db.insert(transactions).values({
        branchApplicationId: application.id,
        tranId: orderId,
        amount: application.oneTimePaymentAmount.toString(),
    })

    redirect(session.GatewayPageURL)
}

export const getPendingTaskReminders = withPermission(
    { tasks: ["view"] },
    async ({ org, orgMemberRole }) => {
        const role = orgMemberRole

        return db.query.tasks.findMany({
            where: {
                AND: [
                    { organizationId: org.id },
                    { isCompleted: false },
                    {
                        OR: [
                            { assignedTo: "all" },
                            { assignedTo: role || "" },
                        ],
                    },
                ],
            },
            columns: {
                id: true,
                title: true,
                dueDate: true,
                phoneNumber: true,
                category: true,
            },
            orderBy: (tasks, { asc }) => [
                asc(tasks.dueDate),
            ],
        })
    },
)
