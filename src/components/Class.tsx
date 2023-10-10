import { StaticImageData} from "next/image"
import Image from "next/image"


type classProps = {
    name: string
    description: string
    image: StaticImageData
}


export default function Class({name, description, image}: classProps) {
    const overlayStyles = `p-5 absolute z-10 flex h-[380px] w-[450px] flex-col items-center justify-center whitespace-normal bg-primary text-center text-white opacity-0 transition duration-500 hover:opacity-90 hover:cursor-default`
  return (
    <li className="relative mx-5 inline-block h-[380px] w-[450px]">
        <div className={overlayStyles}>
            <p className="text-2xl mb-5 font-semibold">{name}</p>
            <p>{description}</p>
        </div>
        <Image alt={`${name}`} src={image}/>
    </li>
  )
}
