export default function Description({
  descriptions
}: {
  descriptions: {
    type: 'text' | 'highlight';
    value: string;
  }[]
}) {
  return (
    <p className="text-sm md:text-base lg:text-xl">
      {descriptions.map((desc, idx) => (
        <span
          key={idx}
          className={
            `text-service-detail-text-description ${
            desc.type === 'highlight' ? 'font-bold' : 'font-normal'
          }`
        }
      >
        {desc.value}
      </span>
    ))}
  </p>
  )
}