import { NoWidgetScreen } from "@/components/app-setup/no-widgets"
import db from "@/db"
import { counter } from "@/db/schema"
import { eq } from "drizzle-orm"
import { checkSession } from "@/lib/auth"
import { headers } from "next/headers"
import { catchError } from "@/lib/catch-error"
import { toast } from "sonner"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar"
import { KeyRound, LogOut, PackagePlus, Settings } from "lucide-react"
import Link from "next/link"

export default async function App() {
    const session = await checkSession({
        headers: await headers()
    })
    
    if (!session || !session.user) {
        const error = new Error('User not authenticated')
        error.name = 'auth/not-authenticated'
        throw error
    }


    const [error, counterWidgets] = await catchError(db.select().from(counter).where(eq(counter.userId, session.user.id)))
    if (error) {
        console.error(error)
        toast.error(error.message)
        throw new Error("Failed to fetch widgets")
    }
    if (counterWidgets.length < 1) return (
        <NoWidgetScreen />
    )

    return (
        <div className="p-4">
            <Menubar className="w-fit">
                <MenubarMenu>
                    <MenubarTrigger>Widgets</MenubarTrigger>
                    <MenubarContent>
                        <Link href={'/app/new'}>
                            <MenubarItem className="cursor-pointer"><PackagePlus />New widget</MenubarItem>
                        </Link>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Account</MenubarTrigger>
                    <MenubarContent>
                        <Link href={'/app/settings/account'}>
                            <MenubarItem className="cursor-pointer"><Settings />Settings</MenubarItem>
                        </Link>
                        <Link href={'/app/settings/api-keys'}>
                            <MenubarItem className="cursor-pointer"><KeyRound />API Keys</MenubarItem>
                        </Link>
                        <MenubarSeparator />
                        <MenubarItem variant="destructive"><LogOut />Log out</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    )
}