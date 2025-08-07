'use client'
import { Navigationitem } from "@/components/navigation-item"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/utils/use-media-query"
import { KeyRound, UserRoundPen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SettingsCategoryPage() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const router = useRouter()

    useEffect(() => {
        if (isDesktop) {
            router.push("/app/settings/account")
        }
    }, [isDesktop, router])

    if (isDesktop) return null

    return (
        <div className="flex flex-col justify-between">
            <div>
                <Navigationitem variant='ghost' icon={<UserRoundPen size={16} />} href="/app/settings/account">Account</Navigationitem>
                <Navigationitem variant='ghost' icon={<KeyRound size={16} />} href="/app/settings/api-keys">API Keys</Navigationitem>
            </div>
            <Link href={'/app'}>
                <Button className="fixed bottom-10 w-4/5 left-1/2 transform -translate-x-1/2">
                    Go to home
                </Button>
            </Link>
        </div>
    )
}