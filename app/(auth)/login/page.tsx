// app/(auth)/login/page.tsx
"use client";

import AuthLayout from "@/components/auth/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
      <Suspense fallback={<div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">Chargement...</div>}>
       <AuthLayout>
        <LoginForm />
       </AuthLayout>
      </Suspense>
  );
}