import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-2xl">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
