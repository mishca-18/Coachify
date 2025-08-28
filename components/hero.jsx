import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';

const HeroSection = () => {
    return (
        <section className='w-full pt-36 md:pt-48 pb-10'>
            <div className='flex flex-col gap-6 text-center'>
                <div className='space-y-6 mx-auto'>
                    <h1 className='text-5x1 font-bold md:text6x1 lg:text-7xl x1:text-8x1'>
                        Your AI Career Coach for
                        <br />
                        Professional Success
                    </h1>
                    <p className='mx-auto max-w-[600] text-muted-foreground md:text-xl'>
                        Advance your career with persolnalized gudiance, interview prep, and
                        AI-powered tools for job success.
                    </p>
                </div>

                <div>
                    <Link href='/dashboard'>
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                </div>

                <div className='hero-image-wrapper mt-5 md:mt-0'>
                    <div className='hero-image'>
                        <Image
                            src={'/banner3.jpeg'}
                            width={1080}
                            height={720}
                            alt='Banner Coachify'
                            className='rounded-lg shadow-2xl border mx-auto'
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;
