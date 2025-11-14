/* import { Search, SlidersHorizontal } from 'lucide-react'
import messages from '@/content/messages.json'

export default function SearchBox() {
  const searchPlaceholder = messages.info.search 
  return (
    <form role="search" className='flex justify-between items-center bg-info-search-background gap-2 py-3 px-4 rounded-lg'>
      <label htmlFor="info-search" className="sr-only">
        {searchPlaceholder}
      </label>
      <Search size={24} className='text-info-search-text shrink-0' aria-hidden="true" />
      <input
        id="info-search"
        name="search"
        type="search"
        placeholder={searchPlaceholder}
        className='w-[60.47px] md:w-[129px] lg:w-[324px] text-info-search-text flex-1 outline-none bg-transparent'
      />
      <button type="submit" className='shrink-0' aria-label="Filtrer les résultats">
        <SlidersHorizontal size={24} className='text-info-search-text' aria-hidden="true" />
      </button>
    </form>
  )
} */