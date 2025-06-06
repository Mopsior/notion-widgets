import { Login } from "@/components/login";
import { Card } from "@/components/ui/card";

export default async function LoginPage() {
    return (
        <div className="relative w-full h-screen flex justify-center items-center">
            <Card className="w-96">
                <Login />
            </Card>
        </div>
    )
}