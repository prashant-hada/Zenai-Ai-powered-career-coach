import React from 'react'
import {
    Card,
    CardContent
  } from "@/components/ui/card"
import { testimonial } from '@/data/testimonials'
import Image from 'next/image'

const Testimonial = () => {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className="container mx-auto px-4 md:px-6">
            <h2 className='text-3xl font-bold tracking-tighter text-center mb-12'>
                What Our Users Say
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto ">
            {testimonial.map((item,id)=>(
                <Card key={id}
                 className=' bg-background'
                >
                <CardContent className='pt-6'>
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative h-12 w-12 flex-shrink-0">
                                <Image 
                                width={40}
                                height={40}
                                src={item.image}
                                alt={item.author}
                                className='rounded-full object-cover border-2 border-primary/30'
                                />
                            </div>
                            <div className="">
                                <p className='font-semibold'>{item.author}</p>
                                <p className='text-sm text-muted-foreground'>{item.role}</p>
                                <p className='text-sm text-primary'>{item.company}</p>
                            </div>
                        </div>
                        <blockquote>
                           <p className='text-muted-foreground italic relative'>
                            <span className='text-3xl text-primary absolute -top-4 -left-2'>&quot;</span>
                            {item.quote}
                            <span className='text-3xl text-primary absolute -bottom-4'>&quot;</span>
                            </p>  
                        </blockquote>
                    </div>
                </CardContent>
              </Card>
              
            ))}
        </div>
    </section>
  )
}

export default Testimonial