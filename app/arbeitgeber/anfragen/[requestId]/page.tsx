import EmployerChat from "@/components/employer-chat"

type Props = {
  params: Promise<{
    requestId: string
  }>
}

export default async function EmployerRequestPage({ params }: Props) {
  const { requestId } = await params

  return (
    <main className="w-full">
      <EmployerChat requestId={requestId} />
    </main>
  )
}
