// app/(dashboard)/owner/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/auth";

export default function OwnerDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard Propriétaire</h1>
      <p className="text-gray-600 mt-2">
        Bienvenue, {user?.firstName} {user?.lastName}
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Propriétés</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">8</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Locataires</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Revenus mensuels</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">750K FCFA</p>
        </div>
      </div>
    </div>
  );
}