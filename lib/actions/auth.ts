// lib/actions/auth.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Effectue l'inscription Supabase + création de l'utilisateur en DB côté serveur
export async function signUpAndCreateUser(formData: FormData) {
  'use server';
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;

    if (!email || !password || !firstName || !lastName || !phone) {
      return { success: false, error: 'Tous les champs sont obligatoires' };
    }

    const { createClient } = await import('@/lib/db/supabaseServer');
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          firstName, 
          lastName, 
          phone 
        } 
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    const supabaseUserId = authData.user?.id;
    if (!supabaseUserId) {
      return { success: false, error: 'Utilisateur Supabase non créé' };
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Un utilisateur avec cet email existe déjà' };
    }

    // Créer l'utilisateur et le tenant associé
    await prisma.user.create({
      data: {
        id: supabaseUserId,
        email,
        role: 'TENANT',
        tenant: {
          create: {
            firstName,
            lastName,
            phone,
          }
        }
      },
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('signUpAndCreateUser error:', error);
    return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
  }
}

export async function registerUser(id: string, email: string, firstName: string, lastName: string, phone: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, error: "Un utilisateur avec cet email existe déjà" };
    }

    await prisma.user.create({
      data: {
        id,
        email,
        role: 'TENANT',
        tenant: {
          create: {
            firstName,
            lastName,
            phone,
          }
        }
      }
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message || "Erreur lors de la création de l'utilisateur" };
  }
}

export async function createUser(formData: FormData) {
  try {
    const id = formData.get('id') as string || crypto.randomUUID();
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as 'ADMIN' | 'OWNER' | 'TENANT';

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Un utilisateur avec cet email existe déjà" };
    }

    let userData: any = {
      id,
      email,
      role,
    };

    // Créer le profil spécifique selon le rôle
    if (role === 'TENANT') {
      userData.tenant = {
        create: {
          firstName,
          lastName,
          phone,
        }
      };
    } else if (role === 'OWNER') {
      userData.owner = {
        create: {
          firstName,
          lastName,
          phone,
        }
      };
    } else if (role === 'ADMIN') {
      // Pour les admins, on ne crée pas de profil spécifique
      userData = {
        ...userData,
        // Les admins n'ont pas de profil owner/tenant
      };
    }

    const user = await prisma.user.create({
      data: userData,
      include: {
        tenant: true,
        owner: true,
      }
    });

    revalidatePath('/admin/users');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { error: error.message || "Erreur lors de la création de l'utilisateur" };
  }
}

export async function updateUser(id: string, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as 'ADMIN' | 'OWNER' | 'TENANT';

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== id) {
      return { error: "Un autre utilisateur utilise déjà cet email" };
    }

    // Récupérer l'utilisateur actuel pour connaître son rôle précédent
    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: { tenant: true, owner: true }
    });

    let updateData: any = {
      email,
      role,
    };

    // Mettre à jour le profil spécifique selon le rôle
    if (role === 'TENANT') {
      if (currentUser?.tenant) {
        // Mettre à jour le tenant existant
        updateData.tenant = {
          update: {
            firstName,
            lastName,
            phone,
          }
        };
      } else {
        // Créer un nouveau tenant
        updateData.tenant = {
          create: {
            firstName,
            lastName,
            phone,
          }
        };
        // Supprimer le owner s'il existait
        if (currentUser?.owner) {
          await prisma.owner.delete({ where: { userId: id } });
        }
      }
    } else if (role === 'OWNER') {
      if (currentUser?.owner) {
        // Mettre à jour le owner existant
        updateData.owner = {
          update: {
            firstName,
            lastName,
            phone,
          }
        };
      } else {
        // Créer un nouveau owner
        updateData.owner = {
          create: {
            firstName,
            lastName,
            phone,
          }
        };
        // Supprimer le tenant s'il existait
        if (currentUser?.tenant) {
          await prisma.tenant.delete({ where: { userId: id } });
        }
      }
    } else if (role === 'ADMIN') {
      // Pour les admins, supprimer les profils spécifiques s'ils existent
      if (currentUser?.tenant) {
        await prisma.tenant.delete({ where: { userId: id } });
      }
      if (currentUser?.owner) {
        await prisma.owner.delete({ where: { userId: id } });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
        owner: true,
      }
    });

    revalidatePath('/admin/users');
    revalidatePath('/profile');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { error: error.message || "Erreur lors de la mise à jour de l'utilisateur" };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { error: error.message || "Erreur lors de la suppression de l'utilisateur" };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        tenant: true,
        owner: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUsersByRole(role: 'ADMIN' | 'OWNER' | 'TENANT') {
  try {
    const users = await prisma.user.findMany({
      where: { role },
      include: {
        tenant: role === 'TENANT',
        owner: role === 'OWNER',
      },
      orderBy: { createdAt: 'desc' }
    });

    return users;
  } catch (error: any) {
    console.error('Error fetching users by role:', error);
    return [];
  }
}

export async function updateUserRole(id: string, role: 'ADMIN' | 'OWNER' | 'TENANT') {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: { tenant: true, owner: true }
    });

    let updateData: any = { role };

    // Gérer la transition de rôle
    if (role === 'TENANT' && !currentUser?.tenant) {
      updateData.tenant = {
        create: {
          firstName: 'Nouveau',
          lastName: 'Locataire',
          phone: '',
        }
      };
      if (currentUser?.owner) {
        await prisma.owner.delete({ where: { userId: id } });
      }
    } else if (role === 'OWNER' && !currentUser?.owner) {
      updateData.owner = {
        create: {
          firstName: 'Nouveau',
          lastName: 'Propriétaire',
          phone: '',
        }
      };
      if (currentUser?.tenant) {
        await prisma.tenant.delete({ where: { userId: id } });
      }
    } else if (role === 'ADMIN') {
      if (currentUser?.tenant) {
        await prisma.tenant.delete({ where: { userId: id } });
      }
      if (currentUser?.owner) {
        await prisma.owner.delete({ where: { userId: id } });
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
        owner: true,
      }
    });

    revalidatePath('/admin/users');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { error: error.message || "Erreur lors de la mise à jour du rôle" };
  }
}

export async function getCurrentUser() {
  try {
    const { createClient } = await import("@/lib/db/supabaseServer");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let userId = user?.id;
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
    }
    if (!userId) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        owner: true,
      }
    });

    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Fonction pour obtenir le profil complet de l'utilisateur
export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        owner: true,
      }
    });

    return user;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}