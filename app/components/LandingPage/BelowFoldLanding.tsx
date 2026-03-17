"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import DeliveredOn from "@/app/(pages)/take-my-class/DeliveredOn";
import { onlineClassSubjects } from "@/app/(pages)/online-class/content";
import SubSubjectsSection from "./SubSubjects";

// Lightweight skeleton for below-the-fold sections
const LoadingSkeleton = ({ height = "400px" }: { height?: string }) => (
  <div
    className="w-full bg-gray-100 animate-pulse"
    style={{ minHeight: height }}
  />
);

// All heavy / below-the-fold sections are already code-split
const Ratings = dynamic(() => import("./Ratings"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="104px" />,
});

const OnlinePlatform = dynamic(
  () => import("../OnlinePlatform/OnlinePlatform"),
  {
    ssr: false,
    loading: () => <LoadingSkeleton height="600px" />,
  },
);
const PriceSection = dynamic(() => import("../PriceSection/PriceSection"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="600px" />,
});
// const Subjects = dynamic(() => import("./Subjects"), {
//   ssr: false,
//   loading: () => <LoadingSkeleton height="600px" />,
// });
const CardCarousel = dynamic(() => import("./CardCarousel"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="600px" />,
});
const Description = dynamic(() => import("./Description"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="300px" />,
});

// const Description2 = dynamic(() => import("./Description2"), {
//   ssr: false,
//   loading: () => <LoadingSkeleton height="300px" />,
// });

const GuaranteedBlock = dynamic(() => import("./GuaranteedBlock"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="400px" />,
});

const WhySlider = dynamic(() => import("./WhySlider"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="500px" />,
});

const CustomerReviews = dynamic(() => import("./CustomerReviews"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="500px" />,
});

const ProcessSection = dynamic(() => import("./ProcessSection"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="400px" />,
});

const Success = dynamic(() => import("./Success"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="300px" />,
});

const AcademicPartners = dynamic(() => import("./AcademicPartners"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="200px" />,
});

const GetQouteDynamic = dynamic(() => import("./GetQoute"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="400px" />,
});

const Faq = dynamic(() => import("./Faq"), {
  ssr: false,
  loading: () => <LoadingSkeleton height="400px" />,
});

type BelowFoldLandingProps = {
  children?: ReactNode;
};

/**
 * This component waits until the page is fully interactive on the client
 * (after hydration / idle) and only then mounts all below-the-fold sections.
 * This keeps LCP focused on the hero while still rendering the rest quickly after.
 */
export default function BelowFoldLanding({ children }: BelowFoldLandingProps) {
  const [ready, setReady] = useState(false);
  const currentPath = usePathname();
  const isOnlineClassPage = currentPath.includes("online-class");
  useEffect(() => {
    // Defer until after main thread is idle to be extra safe for LCP
    if (typeof window === "undefined") return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      setReady(true);
      window.removeEventListener("scroll", start);
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(start, { timeout: 200 });
    } else {
      // Fallback: run soon after first paint
      setTimeout(start, 100);
    }

    // Also start on first scroll (user likely scrolled before timeout)
    window.addEventListener("scroll", start, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", start);
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      {currentPath.includes("take-my-class") ||
      isOnlineClassPage ||
      currentPath === "/" ? (
        <DeliveredOn />
      ) : (
        <Ratings />
      )}{" "}
      {isOnlineClassPage || (currentPath === "/" && <Success />)}
      <CardCarousel />
      <Description />
      {/* <Description2 /> */}
      {!isOnlineClassPage ||
        (currentPath === "/" && (
          <>
            <GuaranteedBlock />
            <WhySlider />
          </>
        ))}
      <CustomerReviews />
      <ProcessSection />
      <SubSubjectsSection defaultSubSubjects={onlineClassSubjects} />
      {!isOnlineClassPage || (currentPath !== "/" && <Success />)}
      {children}
      {isOnlineClassPage || (currentPath === "/" && <OnlinePlatform />)}
      <AcademicPartners />
      {isOnlineClassPage || (currentPath === "/" && <PriceSection />)}
      {!isOnlineClassPage || (currentPath === "/" && <GetQouteDynamic />)}
      {currentPath !== "/" && <Faq />}
    </>
  );
}
