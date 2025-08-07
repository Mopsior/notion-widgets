import { Login } from "@/components/login";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
    return (
        <div className="relative w-full h-screen flex justify-center items-center">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Log into an account</CardTitle>
                    <CardDescription>Log in to app using Github. You don&apos;t need to create any other account!</CardDescription>
                </CardHeader>
                <CardContent>
                    <Login />
                </CardContent>
            </Card>
        </div>
    )
}