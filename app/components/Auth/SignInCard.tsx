"use client";
import { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { FaArrowRight, FaApple, FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import Logo from "@/app/assets/Images/logo.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CgRename } from "react-icons/cg";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import toast from "react-hot-toast";
// import GoogleButton from "./GoogleButton";
// import SignIn from "./SignIn";

// Password regex: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, only letters and numbers
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

const SignInCard = () => {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmail = email.toLowerCase();
    let payload: any = {
      email: newEmail,
      password,
    };
    try {
      setLoading(true);
      // Sign in API only
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NGROX_URL}/auth/signin`,
        payload
      );
      toast.success("Sign in successfully!");
      setEmail("");
      setPassword("");
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("user_id", res.data.user.user_id);
      localStorage.setItem("user_name", res.data.user.name);
      localStorage.setItem("package_type", res.data.user.package_type);
      route.push("/tools/paraphraser-tool/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
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
              onChange={(e) => setPassword(e.target.value)}
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
        </div>
        <Link href="/forgot-password/" className="text-sm hover:underline ">
          Forgot Password?
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="w-[90%] bg-orange-500 text-white font-semibold h-[39px] px-4 rounded-lg hover:bg-orange-600 transition duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <ColorRing
              height="24"
              width="24"
              ariaLabel="color-ring-loading"
              colors={["white", "white", "white", "white", "white"]}
            />
          ) : (
            "Sign In"
          )}
          <FaArrowRight />
        </button>
        {/* google button will be here */}
        {/* <GoogleButton /> */}
      </form>
      {/* <SignIn /> */}
      <p className="text-center text-sm  mt-8 relative">
        Do not have an account?
        <Link href="/sign-up/" className="hover:underline pl-1">
          Sign up Here
        </Link>
      </p>
    </div>
  );
};

export default SignInCard;
