import React from 'react'
import HomePageText from '../../public/HomePageText.png'
import HomepageGraphic from '../../public/HomePageGraphic.png'
import SponsorRedBull from '../../public/SponsorRedBull.png'
import SponsorFortune from '../../public/SponsorFortune.png'
import SponsorForbes from '../../public/SponsorForbes.png'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

export default function Hero() {
  return (
    <section className='gap-16 py-16 md:h-full md:pb-0' id='home'>
        {/* img and main header */}
        <div className='md:flex mx-auto w-5/6 items-center justify-center md:h-5/6 container'>
            {/* main header */}
            <div className='mt-32 md:basis-3/5'>
                {/* headings */}
                <div className='flex flex-col gap-6 mb-3'>
                    <div className='relative'>
                        <div className='before:absolute before:-top-20 before:-left-20 before:z-[-1] md:before:content-evolvetext'>
                            <Image src={HomePageText} alt="home-page-text" />
                        </div>
                    </div>
                    <p className='w-3/4 text-sm text-muted-foreground'>Unrivaled Gym. Unparalleled Training Fitness Classes. World Class Studios to get the Body Shapes That you Dream of... Get that Dream Body Now.</p>
                </div>
                {/* actions */}
                <div className=' flex gap-2 items-center mt-8'>
                    <Button>Join Now</Button>
                    <Link href='#contact' className='text-primary font-bold'>Learn More</Link>
                </div>
            </div>
            {/* Image */}
            <div>
                <Image alt='home-pageGraphic' src={HomepageGraphic}/>
            </div>
        </div>
        {/* sponsors */}
        <div className='hidden md:block h-[150px] w-full bg-muted py-10'>
            <div className='w-5/6 mx-auto'>
                <div className='flex w-3/5 items-center justify-between gap-8 mx-auto'>
                    <Image alt='redbull-sponsor' src={SponsorRedBull}/>
                    <Image alt='forbes-sponsor' src={SponsorForbes}/>
                    <Image alt='fortune-sponsor' src={SponsorFortune}/>
                </div>
            </div>
        </div>
    </section>
  )
}
