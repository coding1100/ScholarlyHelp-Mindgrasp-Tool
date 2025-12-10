import AuthLayout from "@/app/components/Auth/AuthLayout";
// import SignInCard from "@/app/components/Auth/SignInCard";
import SignUpCard from "@/app/components/Auth/SignUpCard";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthLayout>
        {/* <SignInCard /> */}
        <SignUpCard />
      </AuthLayout>
    </div>
  );
};

export default page;
