import Link from "next/link";

export const EmbedError = ({ title, description }: { title: string, description: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-lg">{description}</p>
            <Link className="text-sm text-muted-foreground hover:underline underline-offset-2" href="https://mopsior.pl" target="_blank">Go to dashboard</Link>
        </div>
    );
}