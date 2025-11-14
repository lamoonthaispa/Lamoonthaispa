import messages from '@/content/messages.json'
import { Calendar } from "lucide-react"
export default function Button() {
  const buttonText = messages.landing.section_intro.button
  const href = messages.landing.section_intro.href
  return (
    <a href={href} className='w-full py-2 md:py-3 rounded-md inline-flex justify-center items-center gap-2 bg-card-button-background text-card-button-text'>
      <Calendar size={20}/>
      { buttonText }
    </a>
  )
}