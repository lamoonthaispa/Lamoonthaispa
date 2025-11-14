import messages from "@/content/messages.json"
import ServiceHighlight from "./ServiceHighlight"
import Divider from "./Divider";
export default function Services() {
  const services = messages.landing.services
  const buttonText = services.button
  const href = services.href

  const serviceEntries = Object.entries(services)
    .filter(([key]) => key !== 'button' && key !== 'href')
    .map(([key, serviceData]) => {
      const service = serviceData as {
        title: string;
        description: { type: string; value: string }[];
        image: string;
        slug: string;
      };
      return { key, service };
    });

  return (
    <section aria-labelledby="services-heading">
      <h2 id="services-heading" className="sr-only">
        Nos services
      </h2>
      <Divider />
      {serviceEntries.map(({ key, service }, index) => (
        <ServiceHighlight
          key={key}
          title={service.title}
          description={service.description}
          image={service.image}
          reverse={index % 2 === 0}
          buttonText={buttonText}
          href={href + service.slug}
        />
      ))}
    </section>
  )
}