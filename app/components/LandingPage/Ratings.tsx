"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { usePageData } from "./usePageData";

// Import all images at the top (Next.js static imports)
import sitejabberLogo from "@/app/assets/Images/sidejabber.webp";
import googleLogo from "@/app/assets/Images/google.webp";
import trustpilotLogo from "@/app/assets/Images/Trustpilot.webp";
import reviewIoLogo from "@/app/assets/Images/review.webp";

export default function ReviewRatings() {
  const data = usePageData();
  const ratings = data?.ratings;

  type PlatformType = {
    name: string;
    rating: string;
    stars: number;
    logo: string | any;
  };

  const defaultPlatforms: PlatformType[] = [
    { name: "Sitejabber", rating: "4.9", stars: 4.5, logo: sitejabberLogo },
    { name: "Google Reviews", rating: "4.8", stars: 4.5, logo: googleLogo },
    { name: "Trustpilot", rating: "4.9", stars: 4.5, logo: trustpilotLogo },
    { name: "Review.io", rating: "4.9", stars: 4.5, logo: reviewIoLogo },
  ];

  const platforms =
    ratings?.platforms &&
    Array.isArray(ratings.platforms) &&
    ratings.platforms.length > 0
      ? ratings.platforms.map((p: any) => ({
          name: p.name || "",
          rating: p.rating || "0",
          stars: p.stars || 0,
          logo: p.logo || sitejabberLogo,
        }))
      : defaultPlatforms;

  return (
    <div>
      <div className="xl:flex justify-center py-8 mt-[-96px]">
        {ratings?.mainHeading && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">{ratings.mainHeading}</h2>
            {ratings.trustpilotRating && (
              <p className="text-sm text-gray-600">
                {ratings.trustpilotRating}
              </p>
            )}
          </div>
        )}
        <div
          className="max-w-7xl container py-6 px-12 rounded-lg lg:flex justify-between grid grid-cols-2 gap-6 bg-[#fff] "
          style={{ boxShadow: " 0px 11px 32px 0px #DFE5FF " }}
        >
          {platforms.map((platform: PlatformType, index: number) => {
            const starCount = Math.floor(platform.stars);
            const hasHalfStar = platform.stars % 1 >= 0.5;

            // Handle logo - could be string path or imported image
            const getLogo = () => {
              if (typeof platform.logo === "string") {
                return platform.logo;
              }
              // Map string paths to imported logos
              const logoMap: Record<string, any> = {
                "/assets/Images/sidejabber.webp": sitejabberLogo,
                "/assets/Images/google.webp": googleLogo,
                "/assets/Images/Trustpilot.webp": trustpilotLogo,
                "/assets/Images/review.webp": reviewIoLogo,
              };
              return logoMap[platform.logo] || sitejabberLogo;
            };

            return (
              <div
                key={index}
                className="flex items-center justify-center col-span-1"
              >
                <div className="md:w-14 w-10 mr-3">
                  <Image
                    src={getLogo()}
                    alt={platform.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <p className="md:text-lg text-sm font-semibold tracking-normal text-[#171717]">
                    {platform.rating}
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 md:w-5 md:h-5 ${
                          i < starCount
                            ? "fill-yellow-400 text-yellow-400"
                            : i === starCount && hasHalfStar
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="md:text-lg text-sm text-gray-600 tracking-normal">
                    {platform.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-[-100px] pt-[110px] bg-white w-full h-[100px]"></div>
    </div>
  );
}
