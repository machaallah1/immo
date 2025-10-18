// lib/actions/auth.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Types pour les permissions
type UserRole = 'ADMIN' | 'OWNER' | 'TENANT';

// Vérifier les permissions
async function checkPermissions(currentUserId: string, allowedRoles: UserRole[], targetRole?: UserRole) {
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId }
  });

  if (!currentUser) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier si le rôle actuel est autorisé
  if (!allowedRoles.includes(currentUser.role)) {
    throw new Error('Permission refusée');
  }

  // Vérifier les restrictions de rôle pour les OWNER
  if (currentUser.role === 'OWNER' && targetRole && targetRole !== 'TENANT') {
    throw new Error('Les propriétaires ne peuvent créer que des locataires');
  }

  return currentUser;
}

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
    revalidatePath('/owner/tenants');
    return { success: true };
  } catch (error: any) {
    console.error('signUpAndCreateUser error:', error);
    return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
  }
}

// Créer un utilisateur avec gestion des permissions
export async function createUser(formData: FormData, currentUserId?: string) {
  try {
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as UserRole;

    // Validation des champs obligatoires
    if (!email || !firstName || !lastName || !phone || !role) {
      return { error: "Tous les champs sont obligatoires" };
    }

    // Vérifier les permissions si currentUserId est fourni
    if (currentUserId) {
      await checkPermissions(currentUserId, ['ADMIN', 'OWNER'], role);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Un utilisateur avec cet email existe déjà" };
    }

    let userData: any = {
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
    }
    // Pour ADMIN, pas de profil spécifique

    const user = await prisma.user.create({
      data: userData,
      include: {
        tenant: true,
        owner: true,
      }
    });

    revalidatePath('/admin/users');
    revalidatePath('/owner/tenants');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating user:', error);
    return { error: error.message || "Erreur lors de la création de l'utilisateur" };
  }
}

// Créer un locataire (spécifique pour les propriétaires)
export async function createTenant(formData: FormData, ownerUserId: string) {
  try {
    // Vérifier que l'utilisateur est bien un propriétaire
    await checkPermissions(ownerUserId, ['OWNER'], 'TENANT');

    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;

    if (!email || !firstName || !lastName || !phone) {
      return { error: "Tous les champs sont obligatoires" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: "Un utilisateur avec cet email existe déjà" };
    }

    const user = await prisma.user.create({
      data: {
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
      include: {
        tenant: true,
      }
    });

    revalidatePath('/owner/tenants');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error creating tenant:', error);
    return { error: error.message || "Erreur lors de la création du locataire" };
  }
}

// Mettre à jour un utilisateur avec gestion des permissions
export async function updateUser(id: string, formData: FormData, currentUserId?: string) {
  try {
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as UserRole;

    // Vérifier les permissions si currentUserId est fourni
    if (currentUserId) {
      const currentUser = await checkPermissions(currentUserId, ['ADMIN', 'OWNER'], role);
      
      // Un OWNER ne peut modifier que ses propres locataires
      if (currentUser.role === 'OWNER') {
        const targetUser = await prisma.user.findUnique({
          where: { id },
          include: { tenant: true }
        });
        
        if (!targetUser || targetUser.role !== 'TENANT') {
          throw new Error('Permission refusée');
        }
      }
    }

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
        updateData.tenant = {
          update: {
            firstName,
            lastName,
            phone,
          }
        };
      } else {
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
        updateData.owner = {
          update: {
            firstName,
            lastName,
            phone,
          }
        };
      } else {
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
      // Pour les admins, supprimer les profils spécifiques
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
    revalidatePath('/owner/tenants');
    revalidatePath('/owner/profile');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { error: error.message || "Erreur lors de la mise à jour de l'utilisateur" };
  }
}

// Supprimer un utilisateur avec gestion des permissions
export async function deleteUser(id: string, currentUserId?: string) {
  try {
    // Vérifier les permissions si currentUserId est fourni
    if (currentUserId) {
      const currentUser = await checkPermissions(currentUserId, ['ADMIN', 'OWNER']);
      
      // Un OWNER ne peut supprimer que des locataires
      if (currentUser.role === 'OWNER') {
        const targetUser = await prisma.user.findUnique({
          where: { id }
        });
        
        if (!targetUser || targetUser.role !== 'TENANT') {
          throw new Error('Permission refusée');
        }
      }
    }

    await prisma.user.delete({
      where: { id }
    });

    revalidatePath('/admin/users');
    revalidatePath('/owner/tenants');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { error: error.message || "Erreur lors de la suppression de l'utilisateur" };
  }
}

// Obtenir tous les utilisateurs (avec filtrage pour OWNER)
export async function getUsers(currentUserId?: string) {
  try {
    let whereCondition: any = {};

    // Si currentUserId est fourni, appliquer les filtres de permission
    if (currentUserId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId }
      });

      // Un OWNER ne peut voir que les locataires
      if (currentUser?.role === 'OWNER') {
        whereCondition.role = 'TENANT';
      }
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
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

// Obtenir les utilisateurs par rôle (avec permissions)
export async function getUsersByRole(role: UserRole, currentUserId?: string) {
  try {
    // Vérifier les permissions si currentUserId est fourni
    if (currentUserId) {
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId }
      });

      // Un OWNER ne peut voir que les locataires
      if (currentUser?.role === 'OWNER' && role !== 'TENANT') {
        return [];
      }
    }

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

// Mettre à jour le rôle d'un utilisateur avec permissions
export async function updateUserRole(id: string, role: UserRole, currentUserId?: string) {
  try {
    // Vérifier les permissions si currentUserId est fourni
    if (currentUserId) {
      await checkPermissions(currentUserId, ['ADMIN', 'OWNER'], role);
    }

    const currentUser = await prisma.user.findUnique({
      where: { id },
      include: { tenant: true, owner: true }
    });

    let updateData: any = { role };

    // Gérer la transition de rôle
    if (role === 'TENANT' && !currentUser?.tenant) {
      updateData.tenant = {
        create: {
          firstName: currentUser?.owner?.firstName || 'Nouveau',
          lastName: currentUser?.owner?.lastName || 'Locataire',
          phone: currentUser?.owner?.phone || '',
        }
      };
      if (currentUser?.owner) {
        await prisma.owner.delete({ where: { userId: id } });
      }
    } else if (role === 'OWNER' && !currentUser?.owner) {
      updateData.owner = {
        create: {
          firstName: currentUser?.tenant?.firstName || 'Nouveau',
          lastName: currentUser?.tenant?.lastName || 'Propriétaire',
          phone: currentUser?.tenant?.phone || '',
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
    revalidatePath('/owner/tenants');
    return { success: true, user };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return { error: error.message || "Erreur lors de la mise à jour du rôle" };
  }
}

// Obtenir l'utilisateur courant
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

    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
        owner: true,
      }
    });

    if (!dbUser && user) {
      // Vérifier si un utilisateur existe déjà avec cet email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: {
          tenant: true,
          owner: true,
        }
      });

      if (existingUser) {
        console.log('User already exists with this email but different ID:', user.email);
        // L'utilisateur existe avec le même email mais un ID différent
        // Cela peut arriver si l'ID Supabase a changé
        // On retourne l'utilisateur existant
        dbUser = existingUser;
      } else {
        console.log('Creating user in database:', user.email);
        
        try {
          dbUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              role: 'TENANT', 
            },
            include: {
              tenant: true,
              owner: true,
            }
          });
          
          console.log('User created successfully:', dbUser.email);
        } catch (createError: any) {
          // Si la création échoue à cause d'un conflit, réessayer de récupérer l'utilisateur
          if (createError.code === 'P2002') {
            console.log('Conflict detected, fetching existing user');
            dbUser = await prisma.user.findUnique({
              where: { email: user.email! },
              include: {
                tenant: true,
                owner: true,
              }
            });
          } else {
            throw createError;
          }
        }
      }
    }

    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Obtenir le profil utilisateur
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