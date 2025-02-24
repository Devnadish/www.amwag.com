"use client";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  EffectFade,
  EffectCreative,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/effect-creative";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Define the Offer type
interface Offer {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  title: string;
  description: string;
  active: boolean;
  productIds: string[];
  buttonText?: string;
  link?: string;
}

// Define the props for OfferSlider
interface OfferSliderProps {
  offers: Offer[];
}

const OfferSlider: React.FC<OfferSliderProps> = ({ offers }) => {
  // Memoize the offers array to prevent unnecessary re-renders
  const memoizedOffers = useMemo(() => offers, [offers]);

  return (
    <section className="relative">
      <div className="relative h-[80vh] min-h-[500px]">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade, EffectCreative]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          effect="creative"
          creativeEffect={{
            prev: {
              shadow: true,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          }}
          fadeEffect={{ crossFade: true }}
          className="h-full"
        >
          {memoizedOffers.map((offer) => (
            <SwiperSlide key={offer.id}>
              <div className="h-full flex items-center justify-center relative">
                {/* Image background using next/image */}
                {offer.imageUrl && (
                  <Image
                    src={offer.imageUrl}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    quality={75}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                {/* Content Box */}
                <Card className="relative w-full max-w-2xl mx-4 md:mx-auto text-center p-6 md:p-8 rounded-lg shadow-xl bg-white/10 backdrop-blur-sm z-10 border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-4xl md:text-5xl font-bold text-primary mb-4">
                      {offer.title}
                    </CardTitle>
                    <CardDescription className="text-lg md:text-xl text-gray-200 mb-6">
                      {offer.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 text-lg md:text-xl font-semibold rounded-lg transition duration-300"
                      aria-label={`Order ${offer.title}`}
                    >
                      {offer.buttonText || "اطلب الان"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OfferSlider;
