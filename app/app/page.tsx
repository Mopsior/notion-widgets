import { NoWidgetScreen } from "@/components/app-setup/no-widgets"
import db from "@/db"
import { counter } from "@/db/schema"
import { eq } from "drizzle-orm"
import { checkSession } from "@/lib/auth"
import { headers } from "next/headers"
import { catchError } from "@/lib/catch-error"
import { toast } from "sonner"

export default async function App() {
    const session = await checkSession({
        headers: await headers()
    })

    const [error, counterWidgets] = await catchError(db.select().from(counter).where(eq(counter.userId, session!.user.id)))
    if (error) {
        console.error(error)
        toast.error(error.message)
        return <p>error</p>
    }
    if (counterWidgets.length < 1) return (
        <NoWidgetScreen />
    )

    return (<>
        {counterWidgets.map(({id, goal}) => (
            <div key={id}>
                <p>goal: {goal}</p>
            </div>
        ))}
    </>)
}