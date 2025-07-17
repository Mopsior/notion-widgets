import { Navigationitem } from "@/components/navigation-item";
import { Return } from "@/components/return";
import { KeyRound } from "lucide-react";
import Link from "next/dist/client/link";

export default async function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // Second version with static navbar
        // <div className="w-full h-full flex">
        //     <div className="max-w-96 min-w-72 bg-muted p-5 border border-border h-screen">
        //         <Link href={'/app'}>
        //             <Return variant="secondary" />
        //         </Link>
        //     </div>
        //     <div className="py-5 px-10 h-screen w-full overflow-y-auto">{children}</div>
        // </div>
        <div className="w-full h-full flex bg-muted">
            <div className="max-w-96 min-w-72 p-5 h-screen">
                <Link href={'/app'}>
                    <Return variant="secondary" />
                </Link>
                <div className="mt-5">
                    <Navigationitem icon={<KeyRound size={16} />} href="/app/settings/api-keys">API Keys</Navigationitem>
                </div>
            </div>
            <div className="h-screen w-full p-5 isolate overflow-y-auto">
                <div className="h-full rounded-2xl bg-background overflow-y-auto py-8 px-15 border border-border shadow">
                    {children}
                </div>
            </div>
        </div>
    )
}