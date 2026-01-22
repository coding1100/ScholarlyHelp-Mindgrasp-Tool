"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { hideWhatsappModule } from "../HideLinks/HideLinks";
import whatsappIconFooter from "@/app/assets/Images/whatsapplogo.png";
import whatsappIcon2 from "@/app/assets/Images/whatsappIcon2.png";
import "../Footer/footer.css";

const WhatsApp = () => {
  const currentPage = usePathname();
  const hideWhatsapp = hideWhatsappModule.includes(currentPage);
  const [GCLID, setGCLID] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (window?.location?.href?.includes("gclid=")) {
      setGCLID(window?.location?.href);
    }
    setUrl(window?.location?.href);
  }, []);

  const postUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/quote/whatsapp`;
  const postData = {
    gclid: GCLID,
    url: url,
  };

  const apiCall = async () => {
    try {
      const res = await axios.post(postUrl, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("WhatsApp API error:", error);
      }
      throw error;
    }
  };

  if (hideWhatsapp || currentPage === "/order/") {
    return null;
  }

  return (
    <>
      {/* Whatsapp module */}
      <div>
        <button
          id="whatsapp-chat"
          className="whatsapp-chat"
          onClick={apiCall}
        >
          <a
            className="blantershow-chat inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
            href="https://wa.me/17167081869?text=Hi%20There!%20We are here for you!"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
          >
            <Image
              src={whatsappIconFooter}
              alt="whatsapp"
              className="whatsapp-icon-footer"
            />
            <span className="chat-text">Free Quote On Whatsapp</span>
          </a>
        </button>
        <button
          id="whatsapp-chat-2"
          className="whatsapp-chat"
          onClick={apiCall}
        >
          <a
            className="blantershow-chat2 inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
            href="https://wa.me/17167081869?text=Hi%20There!%20We are here for you!"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
          >
            <Image
              src={whatsappIcon2}
              alt="whatsapp"
              className="whatsapp-icon-footer"
            />
          </a>
        </button>
      </div>
    </>
  );
};

export default WhatsApp;
