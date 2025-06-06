'use client'

import { Fingerprint } from "lucide-react"
import { Button } from "./ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore Because of weird bug in react-hook-form
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Form submitted with values:", values);
    }

    return (<>
        <CardHeader>
            <CardTitle className="text-2xl font-semibold">Log into an account</CardTitle>
            <CardDescription>Create an account with email and biometric data. You don't need password!</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <CardContent>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input type="email" required placeholder="test@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button className="text-foreground w-full cursor-pointer" type="submit">
                        <Fingerprint size={48} />
                        Log in using Passkey
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </>)
}