import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { MinusSmallIcon } from "@heroicons/react/24/outline";

import { useNoAdmin } from "@/hooks/noAdmin";
import Loading from "@/components/loading";
import { apiFetcherSWR } from "@/lib/fetcher";
import { Restaurant, RestaurantsSchema } from "@/types/Restaurant";
import { ErrorResponse } from "@/types/ErrorResponse";

export default function Home() {
  const { isLoadingAccount } = useNoAdmin({ redirectTo: "/mi-restaurante" });
  const router = useRouter();

  const { data: restaurants, isLoading: isLoadingRestaurants } = useSWR<
    Restaurant[],
    ErrorResponse
  >("/restaurants", apiFetcherSWR({ schema: RestaurantsSchema }), {
    shouldRetryOnError: false,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? (restaurants?.length || 0) - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === (restaurants?.length || 0) - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  if (isLoadingAccount || isLoadingRestaurants)
    return (
      <>
        <Head>
          <title> Sabores Pasto - Inicio</title>
        </Head>
        <main className="mt-10 mx-auto flex max-w-7xl items-center justify-center">
          <Loading />
        </main>
      </>
    );

  return (
    <>
      <Head>
        <title> Sabores Pasto - Inicio </title>
      </Head>
      <main className="mt-10">
        {restaurants && restaurants.length > 0 && (
          <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-10 relative group">
            <div
              style={{
                backgroundImage: `url(${restaurants[currentIndex].image})`,
              }}
              className="w-full h-full rounded-2xl bg-center bg-cover duration-500 ease-in-out transition-all hover:scale-105 cursor-pointer"
              onClick={() => {
                router.push(`/restaurantes/${restaurants[currentIndex].slug}`);
              }}
            ></div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronLeftIcon className="w-6 h-6" onClick={prevSlide} />
            </div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
              <ChevronRightIcon className="w-6 h-6" onClick={nextSlide} />
            </div>
            <div className="flex top-4 justify-center py-2">
              {restaurants.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className="text-2xl cursor-pointer"
                >
                  <MinusSmallIcon
                    className={`w-8 h-8 text-gray-400 ${
                      currentIndex === slideIndex ? "text-gray-800" : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
