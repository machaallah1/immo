"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/auth";

export default function TenantDashboard() {
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
      <h1 className="text-3xl font-bold">Dashboard Locataire</h1>
      <p className="text-gray-600 mt-2">
        Bienvenue, {user?.firstName} {user?.lastName}
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Loyer mensuel</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">150K FCFA</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Paiements en retard</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Demandes en cours</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">2</p>
        </div>
      </div>
    </div>
  );
}