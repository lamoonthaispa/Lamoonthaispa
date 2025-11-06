import Image from "next/image";

export default function HeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover
          rounded-xl 
          w-[255px] h-[289px]
          md:w-[335px] md:h-[482px]
          lg:w-[496px] lg:h-[431px]
        "
        />
    </div>
  )
}