"use client"

import { useAppForm } from "@/components/form/use-app-form"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { SubmitButton } from "@/components/shared/submit-button"
import { taskCategories } from "@/constants/tasks"
import { capitalize } from "@/utils/helpers"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { addTask } from "../actions"
import { taskSchema, type TaskSchemaType } from "../schemas"

export function AddTaskForm({
    roles,
}: {
    roles: string[]
}) {
    const router = useRouter()

    const defaultValues: TaskSchemaType = {
        title: "",
        description: "",
        studentName: "",
        phoneNumber: "",
        address: "",
        category: "General",
        dueDate: new Date(),
        assignedTo: "all",
    }

    const form = useAppForm({
        defaultValues,
        validators: {
            onSubmit: taskSchema,
        },
        onSubmit: async ({ value }) => {
            addMutation.mutate(value)
        },
    })

    const addMutation = useMutation({
        mutationFn: addTask,
        onSuccess: () => {
            router.push("/dashboard/tasks")
            form.reset()
        },
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Task</CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    id="task-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <FieldGroup>
                        <form.AppField
                            name="title"
                            children={(field) => (
                                <field.TextField label="Task Title" />
                            )}
                        />
                        <form.AppField
                            name="studentName"
                            children={(field) => (
                                <field.TextField label="Student Name (optional)" />
                            )}
                        />

                        <form.AppField
                            name="phoneNumber"
                            children={(field) => (
                                <field.TextField label="Phone Number (optional)" />
                            )}
                        />

                        <form.AppField
                            name="address"
                            children={(field) => (
                                <field.TextareaField label="Address (optional)" />
                            )}
                        />

                        <form.AppField
                            name="description"
                            children={(field) => (
                                <field.TextareaField label="Description (optional)" />
                            )}
                        />

                        <form.AppField
                            name="category"
                            children={(field) => (
                                <field.SelectField
                                    options={taskCategories.map(
                                        (category) => ({
                                            label: capitalize(
                                                category,
                                            ),
                                            value: category,
                                        }),
                                    )}
                                    label="Category"
                                />
                            )}
                        />

                        <form.AppField
                            name="dueDate"
                            children={(field) => (
                                <field.DatePickerField label="Due Date" />
                            )}
                        />
                        <form.AppField
                            name="assignedTo"
                            children={(field) => (
                                <field.SelectField
                                    options={[
                                        ...roles,
                                        "all",
                                    ].map((role) => ({
                                        label: capitalize(
                                            role,
                                        ),
                                        value: role,
                                    }))}
                                    label="Assigned To Role"
                                />
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter>
                <Field
                    className="justify-end"
                    orientation="horizontal"
                >
                    <Button
                        onClick={() => form.reset()}
                        variant="ghost"
                        type="button"
                    >
                        Cancel
                    </Button>

                    <SubmitButton
                        isPending={addMutation.isPending}
                        form="task-form"
                        type="submit"
                    >
                        Submit
                    </SubmitButton>
                </Field>
            </CardFooter>
        </Card>
    )
}
