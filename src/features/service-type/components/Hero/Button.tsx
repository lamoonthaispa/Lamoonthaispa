import { ArrowRight } from "lucide-react"
export default function Button({
  buttonText
}: {
  buttonText: string
}) {
  return (
    <button className="
      w-full flex justify-center items-center py-3 
      bg-service-detail-button-background text-service-detail-button-text
    ">
      <ArrowRight size={20} />
      { buttonText }
    </button>
  )
}