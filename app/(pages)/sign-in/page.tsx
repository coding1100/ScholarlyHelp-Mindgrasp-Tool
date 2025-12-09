import AuthLayout from "@/app/components/Auth/AuthLayout";
import SignInCard from "@/app/components/Auth/SignInCard";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthLayout>
        <SignInCard />
      </AuthLayout>
    </div>
  );
};

export default page;
