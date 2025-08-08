import { Navigationitem } from "@/components/navigation-item";
import { Return } from "@/components/return";
import { KeyRound, UserRoundPen } from "lucide-react";
import Link from "next/dist/client/link";

export default async function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-full flex bg-muted">
            <div className="max-w-96 min-w-72 p-5 h-real-screen not-md:hidden">
                <Link href={'/app'}>
                    <Return variant="secondary" />
                </Link>
                <div className="mt-5 flex flex-col gap-y-1">
                    <Navigationitem icon={<UserRoundPen size={16} />} href="/app/settings/account">Account</Navigationitem>
                    <Navigationitem icon={<KeyRound size={16} />} href="/app/settings/api-keys">API Keys</Navigationitem>
                </div>
            </div>
            <div className="h-real-screen w-full p-5 isolate overflow-y-auto">
                <div className="h-full rounded-2xl bg-background overflow-y-auto py-8 border border-border shadow relative">
                    <div className="px-8 md:px-15">
                        <Link href={'/app/settings'} className="md:hidden">
                            <Return variant="ghost" className="mb-2">Change category</Return>
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}