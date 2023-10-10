import image1 from '../../public/image1.png'
import image2 from '../../public/image2.png'
import image3 from '../../public/image3.png'
import image4 from '../../public/image4.png'
import image5 from '../../public/image5.png'
import image6 from '../../public/image6.png'
import Class from './Class'
import Image from 'next/image'
import { StaticImageData } from 'next/image'


export default function Classes() {
    type card = {
        name: string
        description: string
        image: StaticImageData
    }

    const classes:card[] = [
        {
            name: "Weight Training Classes",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero iste odio nulla mollitia facere voluptatem aperiam quam animi excepturi, repellat incidunt quisquam et quidem, harum quis doloribus deleniti tempore pariatur',
            image: image1,
        },
        {
            name: "Functional Training Classes",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero iste odio nulla mollitia facere voluptatem aperiam quam animi excepturi, repellat incidunt quisquam et quidem, harum quis doloribus deleniti tempore pariatur',
            image: image2,
        },
        {
            name: "Strong Classes",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero iste odio nulla mollitia facere voluptatem aperiam quam animi excepturi, repellat incidunt quisquam et quidem, harum quis doloribus deleniti tempore pariatur',
            image: image3,
        },
        {
            name: "Core Training Classes",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero iste odio nulla mollitia facere voluptatem aperiam quam animi excepturi, repellat incidunt quisquam et quidem, harum quis doloribus deleniti tempore pariatur',
            image: image4,
        },
        {
            name: "Spinning Classes",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero iste odio nulla mollitia facere voluptatem aperiam quam animi excepturi, repellat incidunt quisquam et quidem, harum quis doloribus deleniti tempore pariatur',
            image: image5,
        },
        {
            name: "Yoga Classes",
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero iste odio nulla mollitia facere voluptatem aperiam quam animi excepturi, repellat incidunt quisquam et quidem, harum quis doloribus deleniti tempore pariatur',
            image: image6,
        }

    ]



  return (
    <section id='classes' className='w-full bg-muted py-24'>
        <div className='container'>
            <h2 className='font-montserrat text-3xl text-primary font-bold mb-8'>Our Classes</h2>
            <p className='text-muted-foreground text-base'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere dicta rerum ullam enim fuga? Dolorem, ex! Quas sequi voluptates dolorum commodi, ex hic? Doloremque quis fugiat deserunt sit totam natus! Facere dicta rerum ullam enim fuga? Dolorem, ex! Quas sequi voluptates dolorum commodi, ex hic? Doloremque quis fugiat deserunt sit totam natus!</p>
        </div>
        <div className='mt-10 h-[353px] w-full overflow-x-auto overflow-y-hidden'>
            <ul className='w-[2800px] whitespace-nowrap'>
                {classes.map((item, i) => (
                    <Class
                    key={i}
                    name={item.name}
                    description={item.description}
                    image={item.image}
                    />
                ))}
            </ul>
        </div>
    </section>
  )
}
