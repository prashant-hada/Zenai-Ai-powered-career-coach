"use client";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageRef?.current.classList.add("scrolled");
      } else {
        imageRef?.current.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className=" z-10 pt-16 md:pt-28 pb-10">
      <div className=" space-y-6 text-center flex flex-col items-center justify-center">
        <div className=" space-y-6 mx-auto flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold md:text-5xl lg:text-7xl gradient-title">
            Your Ai Career Coach for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w[600px] text-muted-foreground text-sm md:text-xl md:mx-[150px] lg:mx-[250px]">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for jobs success.
          </p>
          <div className=" flex items-center gap-4">
            <Link href={"/dashboard"}>
              <Button size={"lg"} className="px-8">
                Get Started
              </Button>
            </Link>
            <Link href={"/dashboard"}>
              <Button size={"lg"} className="px-8" variant={"outline"}>
                Watch Demo
              </Button>
            </Link>
          </div>

          <div className="hero-image-wrapper mt-5 md:mt-0">
            <div ref={imageRef} className="hero-image">
              <Image
                src="/banner4.png"
                width={1080}
                height={720}
                alt="Banner Image"
                className="rounded-lg shadow-2xl border mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
