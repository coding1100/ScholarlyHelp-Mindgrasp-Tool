import AuthLayout from "@/app/components/Auth/AuthLayout";
import SignInCard from "@/app/components/Auth/SignInCard";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <AuthLayout>
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          <SignInCard />
        </Suspense>
      </AuthLayout>
    </div>
  );
};

export default page;
