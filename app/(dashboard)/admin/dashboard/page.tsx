"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/auth";

export default function AdminDashboard() {
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
      <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
      <p className="text-gray-600 mt-2">
        Bienvenue, {user?.firstName} {user?.lastName}
      </p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Utilisateurs</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">156</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Propriétés</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">89</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Revenus totaux</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">12.5M FCFA</p>
        </div>
      </div>
    </div>
  );
}