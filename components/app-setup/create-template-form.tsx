'use client'

import { useState, useMemo } from "react"
import { MotionButton } from "../motion-components"
import { Loading } from "../loading-spinner"
import { Form } from "../ui/form"
import { createWidget } from "@/actions/create-widget"
import { catchError } from "@/lib/catch-error"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { WidgetElement } from "@/config/available-widgets"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { schemaFromWidget } from "./schema-from-widget"
import { RenderFormField } from "./render-form-field"
import z from "zod"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const CreateTemplateForm = ({ widget }: { widget: WidgetElement }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()

    const schema = useMemo(() => schemaFromWidget(widget), [widget])

    const form = useForm({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: z.infer<typeof schema>) => {
        setIsLoading(true)
        console.log(data, schema)
        const [error] = await catchError(createWidget(widget.code, data))
        if (error) {
            handleError(error, router)
            setIsLoading(false)
            return
        }
        router.push('/app')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full md:w-2/5 mx-auto">
                <div className="flex flex-col gap-y-8 pb-10">
                    {widget.form.map((field, index) => {
                        const name = field.codeName;
                        return (
                            <RenderFormField
                                key={index}
                                field={field}
                                name={name}
                                control={form.control}
                            />
                        )
                    })}
                </div>
                <div className="fixed md:w-2/5 w-full bottom-5 left-1/2 -translate-x-1/2 px-5">
                    <MotionButton
                        variant={'notion'}
                        size={'notion'}
                        disabled={isLoading}
                        type="submit"
                        className=" shadow-notion w-full"
                    >
                        {isLoading && <Loading />}
                        Use Template
                    </MotionButton>
                </div>
            </form>
        </Form>
    )
}

const handleError = (error: Error, router: AppRouterInstance) => {
    console.error(error)
    switch (error.name) {
        case 'auth/not-authenticated':
            toast.error('Not authenticated', {
                description: 'I don\'t know how did you get here, but please log in bro',
                action: {
                    label: 'Log in',
                    onClick: () => router.push('/login')
                }
            })
            break
        case 'create-widget/template-dont-exists':
            toast.error('Template does not exist', {
                description: 'The requested template could not be found.'
            })
            break
        case 'create-widget/type-not-supported':
            toast.error('Widget type not supported', {
                description: 'The requested widget type is not supported.'
            })
            break
        case 'create-widget/validation-error':
            toast.error('Validation error', {
                description: 'Please check the form fields and try again.'
            })
            break
        case 'create-widget/error-db':
            toast.error('Database error', {
                description: 'There was an error while creating the widget in the database.'
            })
            break
        default:
            toast.error('Error while creating widget', {
                description: error.name
            })
            break
    }
}