"use client";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import Logo from "@/app/assets/Images/logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgRename } from "react-icons/cg";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import toast from "react-hot-toast";
// import GoogleButton from "./GoogleButton";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const SignUpCard = () => {
  const route = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Password validation function
  const getPasswordValidationMsg = (password: string) => {
    if (!password) return "";
    if (password.length < 8) return "At least 8 characters required.";
    if (!/[A-Z]/.test(password))
      return "At least one uppercase letter required.";
    if (!/[a-z]/.test(password))
      return "At least one lowercase letter required.";
    if (!/\d/.test(password)) return "At least one number required.";
    if (!passwordRegex.test(password))
      return "Only letters and numbers allowed.";
    return "";
  };

  const getNameValidationMsg = (name: string) => {
    if (!name.trim()) return "Name is required.";
    if (name.trim().length < 3)
      return "Name must be at least 3 characters long.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEmail = email.toLowerCase();
    // Validate password and name on submit
    const validationMsg = getPasswordValidationMsg(password);
    if (validationMsg !== "") {
      setPasswordError(validationMsg);
      return;
    } else {
      setPasswordError(null);
    }
    const nameValidationMsg = getNameValidationMsg(name);
    if (nameValidationMsg !== "") {
      setNameError(nameValidationMsg);
      return;
    } else {
      setNameError(null);
    }

    let payload: any = {
      email: newEmail,
      password,
      userData: {
        email: newEmail,
        name,
      },
    };
    setLoading(true);
    try {
      // Sign up API only
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NGROX_URL}/auth/signup`,
        payload
      );
      // Only proceed if response is OK
      toast.success(res?.data?.message || "Sign up successfully!");
      localStorage.setItem("user_name", name);
      localStorage.setItem("user_email", email);
      localStorage.setItem("user_password", password);

      setName("");
      setEmail("");
      setPassword("");
      route.push("/otp");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" space-y-6 text-[#2B1C50]">
      <div className="flex items-center justify-center ">
        <Image
          src={Logo}
          alt="logo is here"
          width={225}
          height={56}
          className="object-cover"
        />
      </div>

      <form className="flex flex-col gap-2 md:gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium t">Name</label>
          <div className="relative mt-2">
            <CgRename className="absolute left-3 top-1/2 -translate-y-1/2 " />
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(getNameValidationMsg(e.target.value));
              }}
              required
            />
          </div>
          {nameError && (
            <p className="text-red-500 text-xs mt-1">{nameError}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium t">Email</label>
          <div className="relative mt-2">
            <MdOutlineEmail className="absolute left-3 top-1/2 -translate-y-1/2 " />
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium ">Password</label>
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(getPasswordValidationMsg(e.target.value));
              }}
              required
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 cursor-pointer -translate-y-1/2 "
              tabIndex={0}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {passwordError ? (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          ) : (
            <div className="h-5"></div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="lg:w-[90%] bg-orange-500 text-white font-semibold h-[39px] px-4 rounded-lg hover:bg-orange-600 transition duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <ColorRing
              height="24"
              width="24"
              ariaLabel="color-ring-loading"
              colors={["white", "white", "white", "white", "white"]}
            />
          ) : (
            "Sign Up"
          )}
          <FaArrowRight />
        </button>
        {/* <GoogleButton /> */}
      </form>
      <p className="text-center text-sm  mt-8 relative">
        If you have an account?
        <Link href="/sign-in/" className="hover:underline pl-1">
          Sign in Here
        </Link>
      </p>
    </div>
  );
};

export default SignUpCard;
