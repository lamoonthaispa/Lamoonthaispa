export default function Title({
  title
}: {
  title: string
}) {
  return (
    <h1 className="text-service-detail-text-title font-medium
      text-[24px] md:text-[32px] lg:text-[42px]
    ">
      { title }
    </h1>
  )
}