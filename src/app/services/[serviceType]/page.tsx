export default function ServiceDetail({
  params
}: {
  params: { serviceType: string };
}) {
  return (
    <div>
      {params.serviceType}
    </div>
  )
}