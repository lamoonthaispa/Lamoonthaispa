import { ArrowRight } from 'lucide-react'
import messages from '@/content/messages.json'

export default function Button({ buttonText }: { buttonText: string }) {
const href = messages.landing.section_intro.href
  return (
    <a href = {href} className='inline-flex justify-center items-center gap-3 py-3 px-12
      bg-landing-hero-button-background text-landing-hero-button-text rounded-md
      text-lg md:text-2xl
    '>
      { buttonText }
      <ArrowRight size={20} />
    </a>
  )
}