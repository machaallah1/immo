// hooks/useAuth.ts
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/db/supabaseClient";
import { 
  getCurrentUser, 
  getUsers, 
  getUsersByRole, 
  createUser, 
  createTenant, 
  updateUser, 
  deleteUser, 
  updateUserRole,
  getUserProfile 
} from "@/lib/actions/auth";
import type { User, Tenant, Owner } from "@prisma/client";

export type UserRole = 'ADMIN' | 'OWNER' | 'TENANT';

export interface FullUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  tenant?: Tenant | null;
  owner?: Owner | null;
}

interface UseAuthReturn {
  // État de l'utilisateur
  user: FullUser | null;
  loading: boolean;
  error: string | null;
  
  // Méthodes d'authentification
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData: { firstName: string; lastName: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  
  // Méthodes de gestion des utilisateurs
  fetchUsers: () => Promise<FullUser[]>;
  fetchUsersByRole: (role: UserRole) => Promise<FullUser[]>;
  createNewUser: (formData: FormData) => Promise<{ success: boolean; error?: string; user?: FullUser }>;
  createNewTenant: (formData: FormData) => Promise<{ success: boolean; error?: string; user?: FullUser }>;
  updateUserData: (userId: string, formData: FormData) => Promise<{ success: boolean; error?: string; user?: FullUser }>;
  deleteUserData: (userId: string) => Promise<{ success: boolean; error?: string }>;
  updateUserRoleData: (userId: string, role: UserRole) => Promise<{ success: boolean; error?: string; user?: FullUser }>;
  fetchUserProfile: (userId: string) => Promise<FullUser | null>;
  
  // Utilitaires
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  canManageUsers: () => boolean;
  canManageTenants: () => boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<FullUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Charger l'utilisateur actuel
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading current user:', err);
        setError('Erreur lors du chargement de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setError(null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Connexion
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Récupérer les données utilisateur complètes
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string; phone: string }) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('phone', userData.phone);

      const result = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer tous les utilisateurs (avec permissions)
  const fetchUsers = async (): Promise<FullUser[]> => {
    try {
      const currentUserId = user?.id;
      return await getUsers(currentUserId);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Erreur lors de la récupération des utilisateurs');
      return [];
    }
  };

  // Récupérer les utilisateurs par rôle (avec permissions)
  const fetchUsersByRole = async (role: UserRole): Promise<FullUser[]> => {
    try {
      const currentUserId = user?.id;
      return await getUsersByRole(role, currentUserId);
    } catch (err) {
      console.error(`Error fetching users by role ${role}:`, err);
      setError(`Erreur lors de la récupération des ${role.toLowerCase()}s`);
      return [];
    }
  };

  // Créer un nouvel utilisateur
  const createNewUser = async (formData: FormData) => {
    try {
      setError(null);
      const currentUserId = user?.id;
      const result = await createUser(formData, currentUserId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return { success: true, user: result.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création de l\'utilisateur';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Créer un nouveau locataire (pour les propriétaires)
  const createNewTenant = async (formData: FormData) => {
    try {
      setError(null);
      
      if (!user?.id) {
        throw new Error('Utilisateur non authentifié');
      }

      const result = await createTenant(formData, user.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return { success: true, user: result.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création du locataire';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Mettre à jour un utilisateur
  const updateUserData = async (userId: string, formData: FormData) => {
    try {
      setError(null);
      const currentUserId = user?.id;
      const result = await updateUser(userId, formData, currentUserId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return { success: true, user: result.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour de l\'utilisateur';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Supprimer un utilisateur
  const deleteUserData = async (userId: string) => {
    try {
      setError(null);
      const currentUserId = user?.id;
      const result = await deleteUser(userId, currentUserId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la suppression de l\'utilisateur';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRoleData = async (userId: string, role: UserRole) => {
    try {
      setError(null);
      const currentUserId = user?.id;
      const result = await updateUserRole(userId, role, currentUserId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return { success: true, user: result.user };
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour du rôle';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Récupérer le profil d'un utilisateur
  const fetchUserProfile = async (userId: string): Promise<FullUser | null> => {
    try {
      return await getUserProfile(userId);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Erreur lors de la récupération du profil');
      return null;
    }
  };

  // Vérifier les permissions
  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    return user ? allowedRoles.includes(user.role) : false;
  };

  // Vérifier si l'utilisateur peut gérer les utilisateurs
  const canManageUsers = (): boolean => {
    return hasPermission(['ADMIN']);
  };

  // Vérifier si l'utilisateur peut gérer les locataires
  const canManageTenants = (): boolean => {
    return hasPermission(['ADMIN', 'OWNER']);
  };

  return {
    // État
    user,
    loading,
    error,
    
    // Authentification
    signIn,
    signUp,
    signOut,
    
    // Gestion des utilisateurs
    fetchUsers,
    fetchUsersByRole,
    createNewUser,
    createNewTenant,
    updateUserData,
    deleteUserData,
    updateUserRoleData,
    fetchUserProfile,
    
    // Permissions
    hasPermission,
    canManageUsers,
    canManageTenants,
  };
}

// Hook simplifié pour l'utilisateur courant uniquement
export function useCurrentUser() {
  const { user, loading, error } = useAuth();
  return { user, loading, error };
}

// Hook pour la gestion des utilisateurs (admin/owner)
export function useUserManagement() {
  const auth = useAuth();
  
  return {
    usersLoading: auth.loading,
    usersError: auth.error,
    fetchUsers: auth.fetchUsers,
    fetchUsersByRole: auth.fetchUsersByRole,
    fetchUserProfile: auth.fetchUserProfile,
    createUser: auth.createNewUser,
    createTenant: auth.createNewTenant,
    updateUser: auth.updateUserData,
    deleteUser: auth.deleteUserData,
    updateUserRole: auth.updateUserRoleData,
    canManageUsers: auth.canManageUsers,
    canManageTenants: auth.canManageTenants,
    currentUser: auth.user,
  };
}

// Hook pour les permissions
export function usePermissions() {
  const { user, hasPermission, canManageUsers, canManageTenants } = useAuth();
  
  return {
    user,
    hasPermission,
    canManageUsers,
    canManageTenants,
    isAdmin: user?.role === 'ADMIN',
    isOwner: user?.role === 'OWNER',
    isTenant: user?.role === 'TENANT',
  };
}