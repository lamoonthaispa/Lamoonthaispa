import Title from "./Title"
import Description from "./Description"
import HeroImage from "./HeroImage"
import Button from "./Button"

export default function Hero({
  title,
  descriptions,
  buttonText,
  src,
  alt,
}: {
  title: string;
  descriptions: {
    type: 'text' | 'highlight';
    value: string;
  }[],
  buttonText: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="flex flex-col gap-10 py-[25px] px-[60px] 
      md:flex-row md:gap-5 md:py-[30px] md:px-[45px]
      lg:flex-row-reverse lg:gap-[64px] lg:py-[75px] lg:px-[112px]
    ">
      <HeroImage src={src} alt={alt} />

      <div className="flex flex-col gap-[15px] md:gap-[20px] lg:gap-[30px]">
        <Title title={title} />
        <Description descriptions={descriptions} />
        <Button buttonText={buttonText} />
      </div>
    </div>
  )
}