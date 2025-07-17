export default async function EmbedPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Embed Page for {slug}</h1>
        </div>
    )
}

