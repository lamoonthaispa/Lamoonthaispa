'use client'

import { ArrowRight } from "lucide-react";
import Image from "next/image";
export default function ServiceHighlight({
  title,
  description,
  image,
  reverse = false,
  buttonText,
  href
}: {
  title: string;
  description: {
    type: string;
    value: string;
  }[];
  image: string;
  reverse: boolean;
  buttonText: string;
  href:string;
}) {
  return (
    <article
      className={`
      flex flex-col items-center md:flex-row ${reverse && "md:flex-row-reverse"}
      py-[60px] px-[70px] gap-10 
      md:py-[75px] md:px-[70px] md:gap-16 
      lg:py-[75px] lg:px-[112px]
      bg-background
    `}
    >

      <figure className="w-[235px] h-[234px] md:w-[30%] md:h-[340px] lg:h-[340px] relative rounded-xl">
        <Image 
          src={image}
          alt={title}
          fill
          loading="lazy"
          className="object-cover rounded-xl"
        />
      </figure>

      <div className="flex flex-col gap-[15px] md:gap-[20px] lg:gap-[30px] md:w-[70%]">
        <h3 className="text-landing-services-text-title text-2xl md:text-5xl lg:text-6xl">
          { title }
        </h3>

        <p className="text-landing-services-text-description text-xs md:text-sm lg:text-xl">
          {description.map((part, index) => {
            if (part.type === "highlight") {
              return <span key={index} className="font-bold">{part.value}</span>;
            }
            return <span key={index}>{part.value}</span>;
          })}
        </p>

        <a href={href} className="rounded-[5.26px] py-3 md:max-w-[163px] flex justify-center items-center gap-3 text-landing-services-button-text bg-landing-services-button-background">
          { buttonText }
          <ArrowRight size={20} />
        </a>
      </div>

    </article>
  )
}