import Image from "next/image"

export function SocialProof() {
  const logos = [
    { src: "/logos/indus/bharat-petrolium-logo-v2.png", alt: "Bharat Petroleum logo" },
    { src: "/logos/indus/colorbar-logo.png", alt: "Colorbar logo" },
    { src: "/logos/indus/century-logo.png", alt: "Century logo" },
    { src: "/logos/indus/iffco-logo.png", alt: "IFFCO logo" },
    { src: "/logos/indus/nykaa-logo.png", alt: "Nykaa logo" },
    { src: "/logos/indus/rupa-logo.png", alt: "Rupa logo" },
    { src: "/logos/indus/samsung.png", alt: "Samsung logo" },
    { src: "/logos/indus/casio.png", alt: "Casio logo" },
    { src: "/logos/indus/bharat-petrolium.png", alt: "Bharat Petroleum logo" },
    { src: "/logos/indus/bikaji.png", alt: "Bikaji logo" },
    { src: "/logos/indus/denver.png", alt: "Denver logo" },
    { src: "/logos/indus/friends.png", alt: "Friends logo" },
    { src: "/logos/indus/heilderburg-cement.png", alt: "Heidelberg Cement logo" },
    { src: "/logos/indus/iffco-logo-old.png", alt: "IFFCO logo" },
    { src: "/logos/indus/kajaria.png", alt: "Kajaria logo" },
    { src: "/logos/indus/toi.png", alt: "Times of India logo" },
    { src: "/logos/indus/vini.png", alt: "Vini logo" },
    { src: "/logos/indus/volvo-eicher.png", alt: "Volvo Eicher logo" },
    { src: "/logos/indus/aws-logo.png", alt: "AWS logo" },
    { src: "/logos/indus/google-workspace-logo.png", alt: "Google Workspace logo" },
  ]

  return (
    <section className="self-stretch py-16 flex flex-col justify-center items-center gap-6 overflow-hidden">
      <div className="text-center text-gray-300 text-sm font-medium leading-tight">
        Trusted by fast-growing enterprises and innovators
      </div>
      <div className="self-stretch grid grid-cols-2 md:grid-cols-5 gap-8 justify-items-center">
        {logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={400}
            height={120}
            className="h-8 w-full max-w-[120px] object-contain grayscale opacity-70 md:h-10 md:max-w-[140px]"
          />
        ))}
      </div>
    </section>
  )
}
