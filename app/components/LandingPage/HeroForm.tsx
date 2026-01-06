"use client";

import axiosInstance from "@/app/axios";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState, useRef } from "react";
import { IoIosMail } from "react-icons/io";
import { IoChatbubbles } from "react-icons/io5";
import { MdPhoneInTalk } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import Image, { StaticImageData } from "next/image";
import FormBackImg from "@/app/assets/Images/Hero-Group-195.png";
import { usePageData } from "./usePageData";

interface ZohoForm2Props {
  nameValue?: string;
  textAreaRows?: number;
  formBackImg2?: StaticImageData;
}

const HeroForm: FC<ZohoForm2Props> = ({
  nameValue,
  textAreaRows = 4,
  formBackImg2,
}) => {
  const data = usePageData();
  const getQuote = data?.getQuote;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [otherSubjectDescription, setOtherSubjectDescription] = useState<string>("");
  const [formData, setFormData] = useState({
    Email: "",
    Last_Name: "DefaultLastName",
    Phone: "",
    Description: "",
  });
  const [FBCLID, setFBCLID] = useState("");
  const [GCLID, setGCLID] = useState("");
  const [wholeUrl, setWholeUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const currentPage = usePathname();
  const router = useRouter();

  const subjects = [
    { emoji: "🧮", label: "Math" },
    { emoji: "🧬", label: "Science" },
    { emoji: "📊", label: "Business" },
    { emoji: "📝", label: "Essay/English" },
    { emoji: "💻", label: "Coding" },
    { emoji: "📂", label: "Other" },
  ];

  const deadlines = [
    { emoji: "🔥", label: "Urgent (Within 24 Hours)" },
    { emoji: "📅", label: "Within 3 Days" },
    { emoji: "🗓️", label: "This Week" },
    { emoji: "📆", label: "Later" },
  ];

  useEffect(() => {
    setWholeUrl(window.location?.href ?? currentPage);
  }, [currentPage]);

  useEffect(() => {
    const href = window?.location?.href ?? "";
    if (href.includes("fbclid=")) setFBCLID(href);
    if (href.includes("gclid=")) setGCLID(href);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!formRef.current) return;

    const checkVisibility = () => {
      if (!formRef.current) return;
      const rect = formRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      // Form is visible if any part of it is in the viewport
      const visible = rect.top < windowHeight && rect.bottom > 0;
      setIsFormVisible(visible);
    };

    // Check initial visibility
    checkVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px", // Account for button space at bottom
      }
    );

    observer.observe(formRef.current);

    // Also check on scroll for more reliable detection
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = () => {
    const email = formData.Email.trim();
    if (!email) return true;
    const at = email.indexOf("@");
    const dot = email.lastIndexOf(".");
    if (at < 1 || dot < at + 2 || dot + 2 >= email.length) {
      alert("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const checkMandatory = () => {
    if (!formData.Last_Name.trim()) {
      alert("Last Name cannot be empty.");
      return false;
    }
    return validateEmail();
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    // Clear other subject description if not "Other"
    if (subject !== "Other") {
      setOtherSubjectDescription("");
    }
  };

  const handleDeadlineSelect = (deadline: string) => {
    setSelectedDeadline(deadline);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedSubject) {
      // If "Other" is selected, require description
      if (selectedSubject === "Other" && !otherSubjectDescription.trim()) {
        alert("Please describe what kind of subject help you are seeking.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedDeadline) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!checkMandatory()) {
      setLoading(false);
      return;
    }

    const fd = new FormData();
    if (FBCLID) fd.append("fbclid", FBCLID);
    if (GCLID) fd.append("gclid", GCLID);
    fd.append("url", wholeUrl);
    fd.append("email", formData.Email);
    if (formData.Phone) fd.append("phone_number", formData.Phone);
    // Include subject and deadline in description
    let description = "";
    if (selectedSubject) {
      description += `Subject: ${selectedSubject}`;
      if (selectedSubject === "Other" && otherSubjectDescription.trim()) {
        description += ` - ${otherSubjectDescription.trim()}`;
      }
      description += `\n`;
    }
    if (selectedDeadline) description += `Deadline: ${selectedDeadline}\n`;
    if (formData.Description) description += `Additional Info: ${formData.Description}`;
    if (description) fd.append("instructions", description);

    try {
      await axiosInstance.post(`/order/quote`, fd);
      // Clear form fields on successful submission
      setFormData({
        Email: "",
        Last_Name: "DefaultLastName",
        Phone: "",
        Description: "",
      });
      setSelectedSubject("");
      setSelectedDeadline("");
      setOtherSubjectDescription("");
      setCurrentStep(1);
      setLoading(false);
      router.push("/thank-you");
    } catch {
      alert("Failed to send request – try again later");
      setLoading(false);
      return;
    }
  };

  const scrollToForm = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isFormVisible && formRef.current) {
      const top =
        formRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };
  console.log(formBackImg2);
  return (
    <div className="relative">
      {formBackImg2 ? (
        <Image
          src={formBackImg2}
          alt="bg1"
          className="min-[1200px]:max-w-[650px] max-w-[550px] cus-img absolute min-[1200px]:right-[-322px] min-[1200px]:top-[-148px] -z-[1] max-[1025px]:hidden min-[1000px]:right-[-272px] min-[1000px]:top-[-120px]"
        />
      ) : (
        <Image
          src={FormBackImg}
          alt="bg1"
          className="cus-img absolute min-[1200px]:right-[-258px] -z-[1] max-[1025px]:hidden min-[1100px]:right-[-208px] min-[1150px]:right-[-150px]"
        />
      )}
      <div className="max-w-[600px] mx-auto cus-div">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 -z-[999]"
          id="quote-form"
        >
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-[#ff641a] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-1 w-12 transition-all duration-300 ${
                      currentStep > step ? "bg-[#ff641a]" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Subject Selection */}
          {currentStep === 1 && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                What Subject You Need Help With?
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSubjectSelect(subject.label)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-all duration-200 text-sm font-medium ${
                      selectedSubject === subject.label
                        ? "border-[#ff641a] bg-[#fff5f0] text-[#ff641a]"
                        : "border-[#E3E5F3] bg-[#EDEFFE] text-gray-700 hover:border-[#ff641a] hover:bg-[#fff5f0]"
                    }`}
                  >
                    <span className="text-lg">{subject.emoji}</span>
                    <span>{subject.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Textarea for "Other" subject */}
              {selectedSubject === "Other" && (
                <div className="mb-4">
                  <textarea
                    value={otherSubjectDescription}
                    onChange={(e) => setOtherSubjectDescription(e.target.value)}
                    placeholder="What Subject You Need Help With?"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-[#E3E5F3] rounded-md bg-[#EDEFFE] text-black outline-none resize-none text-sm placeholder-[#9CA3AF] focus:border-[#ff641a] transition-all duration-200"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedSubject || (selectedSubject === "Other" && !otherSubjectDescription.trim())}
                className={`rounded-md px-3 cursor-pointer border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center h-[54px] w-full ${
                  selectedSubject && (selectedSubject !== "Other" || otherSubjectDescription.trim())
                    ? "bg-[#ff641a] text-white hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </>
          )}

          {/* Step 2: Deadline Selection */}
          {currentStep === 2 && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                When is your deadline?
              </h3>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {deadlines.map((deadline, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDeadlineSelect(deadline.label)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-all duration-200 text-sm font-medium ${
                      selectedDeadline === deadline.label
                        ? "border-[#ff641a] bg-[#fff5f0] text-[#ff641a]"
                        : "border-[#E3E5F3] bg-[#EDEFFE] text-gray-700 hover:border-[#ff641a] hover:bg-[#fff5f0]"
                    }`}
                  >
                    <span className="text-lg">{deadline.emoji}</span>
                    <span>{deadline.label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedDeadline}
                className={`rounded-md px-3 cursor-pointer border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center h-[54px] w-full ${
                  selectedDeadline
                    ? "bg-[#ff641a] text-white hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </>
          )}

          {/* Step 3: Contact Information */}
          {currentStep === 3 && (
            <>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Where should we send your quote?
              </h3>

              {/* Email Field */}
              <div className="flex items-center sm:h-18 h-[65px] border rounded-md bg-[#EDEFFE] border-[#E3E5F3] px-4">
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  placeholder="Email Address"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  className="flex-1 text-black bg-transparent outline-none text-sm placeholder-[#9CA3AF] pr-3 "
                />
                <IoIosMail className="text-[#6B7280] text-xl" />
              </div>

              {/* Phone Field */}
              <div className="flex text-black items-center sm:h-18 h-[65px] border rounded-md bg-[#EDEFFE] border-[#E3E5F3] px-4">
                <input
                  type="text"
                  id="Phone"
                  name="Phone"
                  placeholder="Phone Number"
                  value={formData.Phone}
                  onChange={handleChange}
                  maxLength={30}
                  required
                  className="flex-1 bg-transparent outline-none text-sm placeholder-[#9CA3AF] pr-3 "
                />
                <MdPhoneInTalk className="text-[#6B7280] text-xl" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] w-full"
              >
                {loading ? (
                  <ClipLoader color="#fff" size={22} />
                ) : (
                  "CHECK MY PRICE"
                )}
              </button>

              {/* Micro-copy */}
              <p className="text-center text-xs text-gray-500 mt-2">
                🔒 Anonymous & 100% Confidential.
              </p>
            </>
          )}
        </form>
      </div>

      {/* Sticky Button for Mobile - Only visible when form is NOT visible */}
      {isMobile && !isFormVisible ? (
        <button
          type="button"
          onClick={scrollToForm}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[75%] h-12 rounded-md font-medium text-sm text-white uppercase tracking-wider bg-[#ff641a] hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] border border-transparent shadow-lg transition-all duration-300 z-50 cursor-pointer"
        >
          {getQuote?.ctaButton?.text || "Get My Free, Confidential Quote"}
        </button>
      ) : null}
    </div>
  );
};

export default HeroForm;
