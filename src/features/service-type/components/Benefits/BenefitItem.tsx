import { ICONS, IconName } from "@/components/icons";

export default function BenefitItem({
  icon, 
  label
}: {
  icon: IconName;
  label: string;
}) {
  const Icon = ICONS[icon];
  
  return (
    <div className="w-full flex justify-start items-center
      gap-8 lg:gap-10
    ">
      {Icon && <Icon className="w-6 h-6 shrink-0" />}
      <p className="text-lg leading-relaxed">{label}</p>
    </div>
  )
}