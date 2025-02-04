import React from 'react'

interface Stats{
    main:string;
    sub:string
}
const Stats = () => {

    const statsData:Stats[] = [
        {main:'1000+', sub:"Interview Questions"},
        {main:'95%', sub:"Success Rate"},
        {main:'24/7', sub:"AI Support"}

    ]
  return (
    <section className='w-full py-12 md:py-24  bg-muted/50'>
        <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto ">
            {statsData.map((stat,index)=>(
                <div key={index} className="flex flex-col items-center justify-center space-y-2">
                    <h3 className='text-4xl font-bold'>{stat.main}</h3>
                    <p className='text-muted-foreground'>{stat.sub}</p>
                </div>
            ))}
            </div>
        </div>
    </section>
  )
}

export default Stats