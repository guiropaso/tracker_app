import {Building2, Users, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import BenefitsPageGraphic from '../../public/BenefitsPageGraphic.png'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Benefits() {

  type benefitProps = {
    icon: string
    title: string
    text: string
  }

  const benefits:benefitProps[] = [
    {icon: 'Building2', title: 'State of the art facilities', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed laoreet non elit et fringilla. Morbi rhoncus, elit eget congue semper.'},
    {icon: 'Users', title: '100s of Diverse Classes', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra maximus tellus condimentum interdum. Nullam ultricies leo neque, ut finibus mi vulputate et. Praesent tincidunt ornare lobortis. Fusce fermentum at.'},
    {icon: 'GraduationCap', title: 'Expert and Pro Trainers', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra maximus te vulputate et. Praesent tincidunt ornare lobortis. Fusce fermentum at.'},
  ]

  const iconComponents: { [key: string]: React.ElementType } = {
    Building2,
    Users,
    GraduationCap,
  };

  return (
    <section id='benefits' className='mx-auto container min-h-full py-20'>
      <div className='md:my-5 md:w-3/5'>
        <h2 className='font-montserrat text-3xl text-primary font-bold'>MORE THAN JUST A GYM.</h2>
        <p className='my-5 text-muted-foreground'>
          We provide world class fitness equipment, trainers and classes to get you to your ultimate fitness goals with ease. We provide true care into each and every member.
        </p>
      </div>
      <div className='flex flex-col gap-4 lg:gap-8 items-center justify-between my-10 md:grid md:grid-rows-1 grid-flow-col'>
        {benefits.map((benefit, i) => {
          const IconComponent = iconComponents[benefit.icon]
          return (

            <div key={i} className='bg-card w-5/6 md:w-full flex flex-col items-center p-5 gap-4 border border-border h-full'>
              <div className='rounded-full bg-destructive p-4'>
                <IconComponent className='w-12 h-12 text-foreground'/>
              </div>
              <h2 className='text-xl text-primary font-bold'>{benefit.title}</h2>
              <p className='text-center text-sm text-muted-foreground'>{benefit.text}</p>
              <Link href='#contact' className='underline underline-offset-2 text-destructive font-semibold'>Learn More</Link>
            </div>
          )
        })}
      
      </div>
      <div className='md:flex mt-16 md:mt-20 items-center justify-between text-center'>
        <Image alt='benefits-image' src={BenefitsPageGraphic} className='mx-auto'/>
        <div>
          <div className='relative'>
            <div className='before:absolute before:-top-20 before:-left-20 before:z-[1] before:content-abstractwaves'>
              <div>
                <h2 className='text-4xl font-bold'>MILLIONS OF HAPPY MEMBERS GETTING <span className='text-destructive'>FIT</span></h2>
              </div>
            </div>
          </div>
          <div className='lg:w-4/5 mx-auto'>
            <p className='my-5 font-semibold'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam dolore odio tempore, itaque aut illo modi autem deleniti ipsam, deserunt id explicabo est dolor neque iusto in perspiciatis nemo laudantium. nt id explicabo est dolor neque iusto in perspiciatis nemo Numquam dolore odio tempore, itaque aut illo modi autem deleniti ipsamlaudantium</p>
            <p className='mb-5 font-semibold'>tempore, itaque aut illo modi autem deleniti ipsam, deserunt id explicabo est dolor neque iusto in perspiciatis nemo laudantium. est dolor neque iusto in perspiciatis nemo laudantium explicabo est dolor</p>
          </div>
          <div className='relative mt-10'>
            <div className='before:absolute before:-bottom-20 before:right-40 before:z-[-1] before:content-sparkles'></div>
            <Button>Join Now</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
