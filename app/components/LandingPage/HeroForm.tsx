"use client";

import axiosInstance from "@/app/axios";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState, useRef } from "react";
import { IoIosMail } from "react-icons/io";
import { IoChatbubbles } from "react-icons/io5";
import { MdPhoneInTalk } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import Image, { StaticImageData } from "next/image";
import FormBackImg from "@/app/assets/Images/Hero-Group-195.webp";
import { usePageData } from "./usePageData";

interface ZohoForm2Props {
  nameValue?: string;
  textAreaRows?: number;
  formBackImg2?: StaticImageData;
  showStickyOnMobile?: boolean;
}

const HeroForm: FC<ZohoForm2Props> = ({
  nameValue,
  textAreaRows = 4,
  formBackImg2,
  showStickyOnMobile = true,
}) => {
  const data = usePageData();
  const getQuote = data?.getQuote;
  const currentPage = usePathname();
  const router = useRouter();

  // Check if we're on the multi-step form route
  const isMultiStepRoute =
    currentPage === "/take-my-class-1" ||
    currentPage === "/take-my-class-1/" ||
    currentPage === "/take-my-class-2" ||
    currentPage === "/take-my-class-2/";

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");
  const [otherSubjectDescription, setOtherSubjectDescription] = useState<string>("");
  const [otherDeadlineDescription, setOtherDeadlineDescription] = useState<string>("");

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

  const subjects = [
    { emoji: "🧮", label: "Math" },
    { emoji: "🧬", label: "Science" },
    { emoji: "📊", label: "Business" },
    { emoji: "📝", label: "Essay/English" },
    { emoji: "💻", label: "Coding" },
    { emoji: "📂", label: "Other" },
  ];

  const deadlines = [
    { emoji: "🔥", label: "Urgent" },
    { emoji: "🗓️", label: "This Week" },
    { emoji: "📝", label: "Other" },
  ];

  useEffect(() => {
    setWholeUrl(window.location?.href ?? currentPage);
  }, [currentPage]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fbclid = searchParams.get("fbclid");
    const gclid = searchParams.get("gclid");

    if (fbclid) {
      setFBCLID(fbclid);
    }
    if (gclid) {
      setGCLID(gclid);
    }
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
    if (isMultiStepRoute) {
      // For multi-step form: require either email or phone
      const email = formData.Email.trim();
      const phone = formData.Phone.trim();
      if (!email && !phone) {
        alert("Please provide either an email address or a phone number.");
        return false;
      }
      if (email && !validateEmail()) {
        return false;
      }
      return true;
    }
    return validateEmail();
  };

  // Multi-step form handlers
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    if (subject !== "Other") {
      setOtherSubjectDescription("");
    }
  };

  const handleDeadlineSelect = (deadline: string) => {
    setSelectedDeadline(deadline);
    if (deadline !== "Other") {
      setOtherDeadlineDescription("");
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedSubject) {
      if (selectedSubject === "Other" && !otherSubjectDescription.trim()) {
        alert("Please describe what kind of subject help you are seeking.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedDeadline) {
      if (selectedDeadline === "Other" && !otherDeadlineDescription.trim()) {
        alert("Please specify your deadline.");
        return;
      }
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
    if (formData.Email) fd.append("email", formData.Email);
    if (formData.Phone) fd.append("phone_number", formData.Phone);

    if (isMultiStepRoute) {
      // Include subject and deadline in description for multi-step form
      let description = "";
      if (selectedSubject) {
        description += `Subject: ${selectedSubject}`;
        if (selectedSubject === "Other" && otherSubjectDescription.trim()) {
          description += ` - ${otherSubjectDescription.trim()}`;
        }
        description += `\n`;
      }
      if (selectedDeadline) {
        description += `Deadline: ${selectedDeadline}`;
        if (selectedDeadline === "Other" && otherDeadlineDescription.trim()) {
          description += ` - ${otherDeadlineDescription.trim()}`;
        }
        description += `\n`;
      }
      if (formData.Description) description += `Additional Info: ${formData.Description}`;
      if (description) fd.append("instructions", description);
    } else {
      if (formData.Description) fd.append("instructions", formData.Description);
    }

    try {
      await axiosInstance.post(`/order/quote`, fd);
      // Clear form fields on successful submission
      setFormData({
        Email: "",
        Last_Name: "DefaultLastName",
        Phone: "",
        Description: "",
      });
      if (isMultiStepRoute) {
        setSelectedSubject("");
        setSelectedDeadline("");
        setOtherSubjectDescription("");
        setOtherDeadlineDescription("");
        setCurrentStep(1);
      }
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

  // Multi-step form render
  if (isMultiStepRoute) {
    return (
      <div className="relative">
        {formBackImg2 ? (
          <Image
            src={formBackImg2}
            alt="Academic success illustration"
            width={526}
            height={551}
            className="min-[1200px]:max-w-[450px] max-w-[450px] cus-img absolute min-[1200px]:right-[-280px] min-[1200px]:top-[-83px] -z-[1] max-[1025px]:hidden min-[1000px]:right-[-272px] min-[1000px]:top-[-83px]"
            priority
            fetchPriority="high"
          />
        ) : (
          <Image
            src="/images/Hero-Group-195.webp"
            alt="Academic success illustration"
            width={526}
            height={551}
            className="cus-img absolute min-[1200px]:right-[-258px] -z-[1] max-[1025px]:hidden min-[1100px]:right-[-208px] min-[1150px]:right-[-150px]"
            priority
            fetchPriority="high"
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentStep >= step
                      ? "bg-[#ff641a] text-white"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-1 w-12 transition-all duration-300 ${currentStep > step ? "bg-[#ff641a]" : "bg-gray-200"
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
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-all duration-200 text-sm font-medium ${selectedSubject === subject.label
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
                      className="w-full px-4 py-3 border-2 border-[#E3E5F3] rounded-md bg-[#EDEFFE] text-black outline-none resize-none text-sm placeholder:text-[#6B7280] focus:border-[#ff641a] transition-all duration-200"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedSubject || (selectedSubject === "Other" && !otherSubjectDescription.trim())}
                  className={`rounded-md px-3 cursor-pointer border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center h-[54px] w-full ${selectedSubject && (selectedSubject !== "Other" || otherSubjectDescription.trim())
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
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-all duration-200 text-sm font-medium ${selectedDeadline === deadline.label
                        ? "border-[#ff641a] bg-[#fff5f0] text-[#ff641a]"
                        : "border-[#E3E5F3] bg-[#EDEFFE] text-gray-700 hover:border-[#ff641a] hover:bg-[#fff5f0]"
                        }`}
                    >
                      <span className="text-lg">{deadline.emoji}</span>
                      <span>{deadline.label}</span>
                    </button>
                  ))}
                </div>

                {/* Textarea for "Other" deadline */}
                {selectedDeadline === "Other" && (
                  <div className="mb-4">
                    <textarea
                      value={otherDeadlineDescription}
                      onChange={(e) => setOtherDeadlineDescription(e.target.value)}
                      placeholder="Please specify your deadline"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-[#E3E5F3] rounded-md bg-[#EDEFFE] text-black outline-none resize-none text-sm placeholder:text-[#6B7280] focus:border-[#ff641a] transition-all duration-200"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedDeadline || (selectedDeadline === "Other" && !otherDeadlineDescription.trim())}
                  className={`rounded-md px-3 cursor-pointer border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center h-[54px] w-full ${selectedDeadline && (selectedDeadline !== "Other" || otherDeadlineDescription.trim())
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
                    className="flex-1 text-black bg-transparent outline-none text-sm placeholder:text-[#6B7280] pr-3 "
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
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#6B7280] pr-3 "
                  />
                  <MdPhoneInTalk className="text-[#6B7280] text-xl" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || (!formData.Email.trim() && !formData.Phone.trim())}
                  className="rounded-md px-3 cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] h-[54px] w-full disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:text-gray-500 disabled:hover:border-transparent"
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
        {showStickyOnMobile && isMobile && !isFormVisible ? (
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
  }

  // Original form render for all other routes
  return (
    <div className="relative">
      {formBackImg2 ? (
        <Image
          src={formBackImg2}
          alt="Academic success illustration"
          width={526}
          height={551}
          className="min-[1200px]:max-w-[450px] max-w-[450px] cus-img absolute min-[1200px]:right-[-280px] min-[1200px]:top-[-83px] -z-[1] max-[1025px]:hidden min-[1000px]:right-[-272px] min-[1000px]:top-[-120px]"
          priority
          fetchPriority="high"
        />
      ) : (
        <Image
          src="/images/Hero-Group-195.webp"
          alt="Academic success illustration"
          width={526}
          height={551}
          className="cus-img absolute min-[1200px]:right-[-258px] -z-[1] max-[1025px]:hidden min-[1100px]:right-[-208px] min-[1150px]:right-[-150px]"
          priority
          fetchPriority="high"
        />
      )}
      <div className="w-full mx-auto cus-div">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white max-[768px]:bg-transparent max-[768px]:shadow-none max-[768px]:p-0 rounded-lg shadow-sm p-6 flex flex-col gap-4 -z-[999]"
          id="quote-form"
        >
          {/* Email Field */}
          <div className="flex items-center sm:h-18 h-[65px] max-[768px]:h-[50px] border rounded-md bg-[#EDEFFE] max-[768px]:bg-[#F5F6FA] border-[#E3E5F3] px-4 max-[768px]:relative
          ">
            <input
              type="email"
              id="Email"
              name="Email"
              placeholder="Email *"
              value={formData.Email}
              onChange={handleChange}
              required
              className="flex-1 text-black bg-transparent outline-none text-sm placeholder-[#9CA3AF] pr-3"
            />
            <div className="absolute top-[15px] right-[50px] w-[2px] h-[20px] bg-gray-200  min-[768px]:hidden"></div>
            <IoIosMail className="text-[#9ea9bf] text-xl flex-shrink-0 max-[768px]:absolute max-[768px]:right-4" />
          </div>

          {/* Phone Field */}
          <div className="flex text-black items-center sm:h-18 h-[65px] max-[768px]:h-[50px] border rounded-md bg-[#EDEFFE] max-[768px]:bg-[#F5F6FA] border-[#E3E5F3] px-4 max-[768px]:relative">
            <input
              type="text"
              id="Phone"
              name="Phone"
              placeholder="Phone # *"
              value={formData.Phone}
              onChange={handleChange}
              maxLength={30}
              required
              className="flex-1 bg-transparent outline-none text-sm placeholder-[#9CA3AF] pr-3 "
            />
            <div className="absolute top-[15px] right-[50px] w-[2px] h-[20px] bg-gray-200 min-[768px]:hidden"></div>
            <MdPhoneInTalk className="text-[#9ea9bf] text-xl flex-shrink-0 max-[768px]:absolute max-[768px]:right-4" />
          </div>

          {/* Instructions Field */}
          <div className="flex items-start border rounded-md bg-[#EDEFFE] border-[#E3E5F3] h-[65px] max-[768px]:bg-[#F5F6FA] px-4 pt-3 pb-2 min-[768px]:min-h-[150px] max-[768px]:relative">
            <textarea
              id="Description"
              name="Description"
              placeholder="What do you need help with? *"
              rows={4}
              value={formData.Description}
              onChange={handleChange}
              required
              className="flex-1 bg-transparent text-black outline-none resize-none text-sm pr-3 bg-[#EDEFFE] min-[768px]:min-h-[100px] max-[768px]:h-[50px]"
            />
            <div className="absolute top-[15px] right-[50px] w-[2px] h-[20px] bg-gray-200 min-[768px]:hidden"></div>
            <IoChatbubbles className="text-[#9ea9bf] text-xl mt-1 flex-shrink-0" />
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
              getQuote?.ctaButton?.text || "Get My Free, Confidential Quote"
            )}
          </button>
        </form>
      </div>

      {/* Sticky Button for Mobile - Only visible when form is NOT visible */}
      {showStickyOnMobile && isMobile && !isFormVisible ? (
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
