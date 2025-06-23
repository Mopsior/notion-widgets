import { checkSession } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await checkSession({
        headers: await headers()
    })
    if (!session) return redirect('/login')

    return (
        <>
            {children}
        </>
    )
}
