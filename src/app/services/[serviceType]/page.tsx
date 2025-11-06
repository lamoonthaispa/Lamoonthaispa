import { ServiceType } from "@/types/serviceType";
export default function ServiceDetail({
  params
}: {
  params: { serviceType: ServiceType };
}) {
  return (
    <div>
      {params.serviceType}
    </div>
  )
}