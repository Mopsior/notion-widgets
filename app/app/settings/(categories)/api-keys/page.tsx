import { KeysRender } from "./keys-render";

export default function APIKeysPage() {
    return (
        <div className="h-full">
            <div className="gap-2 flex flex-col pb-8 px-8 md:px-15">
                <h1 className="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">API Keys</h1>
                <p className="text-muted-foreground text-[1.05rem] text-balance sm:text-base">These keys are part of the widget embed URL. Every one of them allows to access your whole account.</p>
            </div>
            <KeysRender />
        </div>
    )
}