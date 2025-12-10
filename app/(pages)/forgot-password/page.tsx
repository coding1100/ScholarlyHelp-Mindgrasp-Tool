import AuthLayout from "@/app/components/Auth/AuthLayout";
import ForgotPassword from "@/app/components/Auth/ForgotPassword";
import React from "react";

const page = () => {
  return (
    <div>
      <AuthLayout>
        <ForgotPassword />
      </AuthLayout>
    </div>
  );
};

export default page;
