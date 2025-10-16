"use client"
/* import Image from "next/image"; */
import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen h-screen">
            {/* Left: Page-specific content */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md p-8">{children}</div>
            </div>
            {/* Right: Auth branding/info */}
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 px-12 bg-blue-200">
                <div className="text-center">
                    {/* Logo or Illustration */}
                    <div className="mb-6">
                       {/*  <Image
                            src="/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                        /> */}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Bienvenue sur Gl</h2>
                    <p className="text-black">
                        {/* location et vente de voitures */}
                        Gestion immobilière
                    </p>
                </div>
            </div>
        </div>
    );
}