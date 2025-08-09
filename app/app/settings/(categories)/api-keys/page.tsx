import Link from "next/link";
import { KeysRender } from "./keys-render";
import { Return } from "@/components/return";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function APIKeysPage() {
    return (
        <div className="h-full w-full">
            <div className="px-8 md:px-15">
                <Link href={'/app/settings'} className="md:hidden">
                    <Return variant="ghost" className="mb-2">Change category</Return>
                </Link>
            </div>
            <div className="gap-2 flex flex-col pb-8 px-8 md:px-15 relative">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">API Keys</h1>
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">These keys are part of the widget embed URL. Every one of them allows to access your whole account.</p>
                <Link href='/app/settings/api-keys/create'>
                    <Button className="absolute top-0 right-8 md:right-15"><Plus /> <span className="not-md:hidden">Create API Key</span></Button>
                </Link>
            </div>
            <KeysRender />
        </div>
    )
}