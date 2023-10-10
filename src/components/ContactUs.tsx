import ContactUsPageGraphic from "../../public/ContactUsPageGraphic.png"
import Image from "next/image"
import ContactPageForm from "./ContactPageForm"

export default function ContactUs() {
  return (
    <section id='contact' className="container pt-24 pb-32">
      <div>
        <h2 className="text-3xl font-montserrat mb-6"><span className="text-destructive">JOIN NOW </span>TO GET IN SHAPE</h2>
        <p className="text-muted-foreground">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet non quos illo aut, facilis minus accusantium culpa pariatur debitis. Hic est enim veniam quaerat, quidem voluptas at minima beatae tenetur?</p>
      </div>
      <div className="my-20 justify-between gap-8 md:grid grid-flow-row grid-cols-2 items-center ">
        <ContactPageForm />
        <Image src={ContactUsPageGraphic} alt='' className="rounded-md mx-auto"/>
      </div>


    </section>
  )
}
