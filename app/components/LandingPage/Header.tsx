"use client";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import megaMenuImage from "@/app/assets/Images/mega-menu-image.svg";
import Image from "next/image";
import LogoSmall from "@/app/assets/Images/logoSmall.png";
import LogoNormal from "@/app/assets/Images/logo.png";
import Phone from "@/app/assets/Icons/phone.svg";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);

  const navItems = [
    {
      title: "Online Class",
      submenu: [
        {
          title: "Subjects",
          links: [
            {
              name: "Take My Chemistry Class",
              href: "/online-class/chemistry/",
            },
            { name: "Take My Biology Class", 
              href: "/online-class/biology/" },
            {
              name: "Take My Economics Class",
              href: "/online-class/economics/",
            },
            { name: "Take My Math Class",
              href: "/online-class/math/" },
            {
              name: "Take My Law Class",
              href: "/online-class/law/",
            },
            
          ],
          button: [{ name: "See All Subjects", href: "/online-class/" }],
        },
        {
          title: "How It Works & Proof",
          links: [
            { name: "100% Confidentiality Pact", href: "/guarantee-anonymity/" },
            { name: "0% Plagiarism Guarantee", href: "/plagiarism-free-process/" },
            { name: "A or B Grade Guarantee", href: "/a-or-b-grade-guarantee/" },
            { name: "On-Time Delivery Guarantee", href: "/on-time-delivery-guarantee/" },
            { name: "Our US-Based PhD Experts", href: "/us-based-phd-experts/" },
          ],
          button: [{ name: "Success Stories & Reviews", href: "/success-stories-and-reviews/" }],
        },
        {
          title: "Online Class Support",
          links: [
            {
              name: "Improve Your Grades",
              href: "https://scholarlyhelp.com/blog/how-to-get-better-grades/",
            },
            {
              name: "Time Management Help",
              href: "https://scholarlyhelp.com/blog/time-management-for-students/",
            },
            { name: "Work–Study Balance", 
              href: "https://scholarlyhelp.com/blog/how-to-balance-work-and-study/" },
            {
              name: "Study Tips & Productivity",
              href: "https://scholarlyhelp.com/blog/15-study-tips-for-students/",
            },
            {
              name: "Tough Math & Study Help",
              href: "https://scholarlyhelp.com/blog/hardest-math-class-in-high-school/",
            },
            
          ],
          button: [{ name: "Ask for Class Help", href: "/online-class/" }],
        },
      ],
      href: "/online-class/",
    },
    {
      title: "Exam Help",
      submenu: [
        {
          title: "Subjects",
          links: [
            { name: "Take My History Exam", href: "/exams/history/" },
            { name: "Take My Philosophy Exam", href: "/exams/philosophy/" },
            { name: "Take My Finance Exam", href: "/exams/finance/" },
            { name: "Take My Nursing Exam", href: "/exams/nursing/" },
            { name: "Take My Math Exam", href: "/exams/math/" },
          ],
          button: [{ name: "See All Subjects", href: "/exams/" }],
        },
        {
          title: "How It Works & Proof",
          links: [
            { name: "100% Confidentiality Pact", href: "/guarantee-anonymity/" },
            { name: "0% Plagiarism Guarantee", href: "/plagiarism-free-process/" },
            { name: "A or B Grade Guarantee", href: "/a-or-b-grade-guarantee/" },
            { name: "On-Time Delivery Guarantee", href: "/on-time-delivery-guarantee/" },
            { name: "Our US-Based PhD Experts", href: "/us-based-phd-experts/" },
          ],
          button: [{ name: "Success Stories & Reviews", href: "/success-stories-and-reviews/" }],
        },
        {
          title: "Exam Help Center",
          links: [
            {
              name: "Math Exam Preparation",
              href: "https://scholarlyhelp.com/blog/how-to-prepare-for-maths-exam/",
            },
            {
              name: "Exam Passing Tips",
              href: "https://scholarlyhelp.com/blog/how-to-prepare-for-maths-exam/",
            },
            { name: "Bonus Questions Strategy", href: "https://scholarlyhelp.com/blog/bonus-questions-in-exam/" },
            {
              name: "Edgenuity Cumulative Exam Help",
              href: "https://scholarlyhelp.com/blog/edgenuity-cumulative-exam/",
            },
            {
              name: "ATI Nutrition Proctored Exam",
              href: "https://scholarlyhelp.com/blog/ati-nutrition-proctored-exam/",
            },
          ],
          button: [{ name: "Get Expert Exam Help", href: "/exams/" }],
        },
      ],
      href: "/exams/",
    },
    {
      title: "Assignment Help",
      submenu: [
        {
          title: "Subjects",
          links: [
            {
              name: "Statistics Assignment Help",
              href: "/assignment/statistics/",
            },
            { name: "Finance Assignment Help", 
              href: "/assignment/finance/" },
            {
              name: "Marketing Assignment Help",
              href: "/assignment/marketing/",
            },
            { name: "Math Assignment Help", 
              href: "/assignment/math/" },
            {
              name: "Accounting Assignment Help",
              href: "/assignment/accounting/",
            },
          ],
          button: [{ name: "See All Subjects", href: "/assignment/" }],
        },
        {
          title: "How It Works & Proof",
          links: [
            { name: "100% Confidentiality Pact", href: "/guarantee-anonymity/" },
            { name: "0% Plagiarism Guarantee", href: "/plagiarism-free-process/" },
            { name: "A or B Grade Guarantee", href: "/a-or-b-grade-guarantee/" },
            { name: "On-Time Delivery Guarantee", href: "/on-time-delivery-guarantee/" },
            { name: "Our US-Based PhD Experts", href: "/us-based-phd-experts/" },
          ],
          button: [{ name: "Success Stories & Reviews", href: "/success-stories-and-reviews/" }],
        },
      ],
      href: "/assignment/",
      
    },
    {
      title: "Homework",
      submenu: [
        {
          title: "Subjects",
          links: [
            { name: "Math Homework Help", href: "/homework/math/" },
            { name: "Statistics Homework Help", href: "/homework/statistics/" },
            { name: "Chemistry Homework Help", href: "/homework/chemistry/" },
            { name: "Accounting Homework Help", href: "/homework/accounting/" },
            {
              name: "Computer science Homework Help",
              href: "/homework/computer-science/",
            }
          ],
          button: [{ name: "See All Subjects", href: "/homework/" }],
        },
      ],
      href: "/homework/",
    },
    {
      title: "Essay Writing",
      submenu: [
        {
          title: "Subjects",
          links: [
            { name: "Law essay writing", href: "/essay-writing/law/" },
            { name: "History essay writing", href: "/essay-writing/history/" },
            { name: "Nursing essay writing", href: "/essay-writing/nursing/" },
            { name: "Psychology essay writing", href: "/essay-writing/psychology/" },
            { name: "Economics essay writing", href: "/essay-writing/economics/" },
          ],
          button: [{ name: "See All Subjects", href: "/essay-writing/" }],
        },
      ],
      href: "/essay-writing/",
    },
    {
      title: "Tools",
      href: "/tools/"
    },
  ];

  return (
    <header className="sticky top-0 bg-white z-[9999] relative max-[1020px]:py-3">
      {/* Header Top Bar */}
      <div className="max-w-7xl mx-auto max-[1320px]:px-8 flex items-center justify-between pt-2 px-6">
        {/* Logo */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="min-[1200px]:hidden text-gray-700"
        >
          {mobileOpen ? <X size={28} color="#3e42b3" /> : <Menu size={28} color="#3e42b3" />}
        </button>
        <Link href="/">
          <Image
            src={LogoSmall}
            alt="Scholarly Help Logo"
            className="max-[480px]:block hidden max-w-[30px] min-w-[30px]"
            width={30}
            height={30}
            priority
          />
          <Image
            src={LogoNormal}
            alt="Scholarly Help"
            className="min-[480px]:block hidden max-w-[142px] min-w-[142px]"
            width={142}
            height={40}
            priority
          />
        </Link>

        {/* Mobile Toggle */}
        

        {/* Desktop Navigation */}
        <nav className="hidden min-[1200px]:flex items-center font-medium text-gray-700 ">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="gap-2"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link
                href={item.href || "#"}
                className="flex items-center hover:bg-[#F9FBFF] transition py-[20px] px-[10px] ml-[10px]"
              >
                {item.title}
                {item.submenu && (
                  <ChevronDown
                    size={16}
                    className={`transition ${activeMenu === index ? "rotate-180" : ""
                      }`}
                  />
                )}
              </Link>

              {/* Full Width Mega Menu */}
              {item.submenu && activeMenu === index && (
                <div className="absolute left-0 right-0 top-full bg-[#F9FBFF] flex gap-y-8 px-10 py-10 max-h-[400px] overflow-auto">
                  {/* Invisible hover buffer to prevent flicker */}
                  <div className="absolute top-[-12px] left-0 w-full h-12 bg-transparent"></div>
                  <div className="flex mx-auto">
                    <div className=" flex mx-auto gap-8 max-[1500px]:grid-cols-2">
                      {item.submenu.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col justify-between shadow-[0px_0px_31.8px_0px_#00000012] p-[25px] rounded-[5px] w-[350px]"
                        >
                          <div className="text-gray-900 mb-2 font-semibold">{sub.title}</div>
                          {sub.links.map((link, linkIdx) => (
                            <Link
                              key={linkIdx}
                              href={link.href}
                              className="block text-gray-700 hover:text-blue-600 transition mb-1"
                            >
                              {link.name}
                            </Link>
                          ))}
                          {sub.button &&
                            sub.button.map((btn, btnIdx) => (
                              <Link
                                key={`button-${btnIdx}`}
                                href={btn.href}
                                className="rounded-md flex cursor-pointer bg-[#ff641a] text-white border border-transparent transition duration-300 text-[15px] font-medium flex items-center justify-center hover:bg-white hover:text-[#ff641a] hover:border-[#ff641a] min-h-[54px]"
                              >
                                {btn.name}
                              </Link>
                            ))}
                        </div>
                      ))}
                    </div>
                    <div className=" ">
                      <Image
                        src={megaMenuImage}
                        alt="SiteJabber"
                        width={367}
                        height={250}
                        loading="lazy"
                        className="h-[100%]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mr-4">
          <a
            href={`tel:${process.env.NEXT_PUBLIC_COMPANY_PHONE_NUMBER}`}
            className="flex items-center text-primary-400 text-[#565add]"
          >
            <span className="w-6 mr-1 text-primary-400">
              <Image
                src={Phone}
                alt="Phone"
                width={22}
                height={22}
                loading="lazy"
              />
            </span>
            1-716-708-1869
          </a>
        </div>
      </div>

      {/* Mobile Navigation - full-width dropdown under header with smooth transition and outside click close */}
      <div
        className={`min-[1200px]:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => {
          setMobileOpen(false);
          setMobileActiveIndex(null);
        }}
      >
        <div
          className={`absolute inset-x-0 top-[60px] mx-auto max-w-7xl bg-white border-t shadow-lg rounded-b-2xl max-h-[70vh] overflow-auto transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-y-0" : "-translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="flex flex-col divide-y">
            {navItems.map((item, index) => (
              <li key={index} className="p-3">
                {item.submenu ? (
                  <details
                    className="group"
                    open={mobileActiveIndex === index}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileActiveIndex(
                        mobileActiveIndex === index ? null : index
                      );
                    }}
                  >
                    <summary className="flex justify-between items-center cursor-pointer font-medium text-[#1e1e1e]">
                      {item.title}
                      <ChevronDown
                        size={18}
                        className="transition-transform duration-300 ease-in-out group-open:rotate-180"
                      />
                    </summary>
                    <div className="mt-2 overflow-hidden transition-all duration-300 ease-in-out max-h-0 group-open:max-h-fit">
                      <ul className="pl-3 border-l border-gray-200 space-y-1">
                        {item.submenu.map((sub, idx) => (
                          <li key={idx}>
                            <div className="mb-2">
                              <span className="font-medium text-gray-800">
                                {sub.title}
                              </span>
                              <ul className="ml-2 mt-1 space-y-1">
                                {sub.links.map((link, linkIdx) => (
                                  <li key={linkIdx}>
                                    <Link
                                      href={link.href}
                                      className="block text-gray-600 hover:text-blue-600 py-1"
                                      onClick={() => {
                                        setMobileOpen(false);
                                        setMobileActiveIndex(null);
                                      }}
                                    >
                                      {link.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="block text-gray-700 hover:text-blue-600"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileActiveIndex(null);
                    }}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
