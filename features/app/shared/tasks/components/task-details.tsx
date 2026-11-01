"use client"

import { SubmitButton } from "@/components/shared/submit-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    ListTodo,
    UserRound,
    Phone,
    MapPin,
} from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { changeTaskStatus } from "../actions"
import { Task } from "../types"

export default function TaskDetailDialog({
    task,
    setTask,
}: {
    task: Task | null
    setTask: Dispatch<SetStateAction<Task | null>>
}) {
    const mutation = useMutation({
        mutationFn: changeTaskStatus,
        onSuccess: () => {
            setTask((current) =>
                current
                    ? {
                          ...current,
                          isCompleted: !current.isCompleted,
                      }
                    : null,
            )
        },
    })

    const isCompleted = Boolean(task?.isCompleted)

    return (
        <Dialog
            open={!!task}
            onOpenChange={(open) => {
                if (!open && !mutation.isPending) {
                    setTask(null)
                }
            }}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">
                            {task?.category ?? "General"}
                        </Badge>

                        <Badge
                            variant={
                                isCompleted
                                    ? "default"
                                    : "outline"
                            }
                        >
                            {isCompleted
                                ? "Completed"
                                : "Pending"}
                        </Badge>
                    </div>

                    <DialogTitle className="pt-2 text-xl">
                        {task?.title}
                    </DialogTitle>

                    <DialogDescription>
                        Task details and full description
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="space-y-5">
                    {/* Description */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 text-sm font-semibold">
                            <ListTodo className="size-4" />
                            Description
                        </h3>

                        <div className="rounded-lg bg-muted/50 p-4 text-sm leading-7">
                            {task?.description ? (
                                <p className="whitespace-pre-wrap break-words">
                                    {task.description}
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    No description provided.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Student Information */}
                    {(task?.studentName ||
                        task?.phoneNumber ||
                        task?.address) && (
                        <>
                            <Separator />

                            <section className="space-y-3">
                                <h3 className="flex items-center gap-2 text-sm font-semibold">
                                    <UserRound className="size-4" />
                                    Student Information
                                </h3>

                                <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                                    {/* Student Name */}
                                    {task.studentName && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Student Name
                                            </p>

                                            <p className="text-sm font-medium">
                                                {
                                                    task.studentName
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {/* Phone Number */}
                                    {task.phoneNumber && (
                                        <div className="space-y-1">
                                            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                <Phone className="size-3.5" />
                                                Phone Number
                                            </p>

                                            <a
                                                href={`tel:${task.phoneNumber}`}
                                                className="text-sm font-medium hover:underline"
                                            >
                                                {
                                                    task.phoneNumber
                                                }
                                            </a>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {task.address && (
                                        <div className="space-y-1 sm:col-span-2">
                                            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                <MapPin className="size-3.5" />
                                                Address
                                            </p>

                                            <p className="whitespace-pre-wrap break-words text-sm">
                                                {
                                                    task.address
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {/* Task Metadata */}
                    <section className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-sm font-semibold">
                                <CalendarDays className="size-4" />
                                Due Date
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {task?.dueDate
                                    ? format(
                                          new Date(
                                              task.dueDate,
                                          ),
                                          "PPP p",
                                      )
                                    : "No due date"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-sm font-semibold">
                                <UserRound className="size-4" />
                                Assigned To
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {task?.assignedTo ?? "all"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-sm font-semibold">
                                <Clock className="size-4" />
                                Created
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {task?.createdAt
                                    ? format(
                                          new Date(
                                              task.createdAt,
                                          ),
                                          "PPP",
                                      )
                                    : "—"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="flex items-center gap-2 text-sm font-semibold">
                                <CheckCircle2 className="size-4" />
                                Status
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {isCompleted
                                    ? "This task is completed."
                                    : "This task is still pending."}
                            </p>
                        </div>
                    </section>
                </div>

                <DialogFooter>
                    <Field
                        orientation="horizontal"
                        className="justify-end"
                    >
                        <Button
                            variant="ghost"
                            disabled={mutation.isPending}
                            onClick={() => setTask(null)}
                        >
                            Close
                        </Button>

                        <SubmitButton
                            isPending={mutation.isPending}
                            disabled={mutation.isPending}
                            onClick={() => {
                                if (!task) return

                                mutation.mutate({
                                    id: task.id,
                                    isCompleted:
                                        !task.isCompleted,
                                })
                            }}
                        >
                            {isCompleted
                                ? "Mark as Pending"
                                : "Mark as Completed"}
                        </SubmitButton>
                    </Field>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
