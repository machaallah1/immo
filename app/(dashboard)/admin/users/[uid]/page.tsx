// app/dashboard/admin/users/[uid]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserManagement } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  User,
  Shield
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchUserProfile, canManageUsers } = useUserManagement();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userId = params.uid as string;

  useEffect(() => {
    loadUser();
  }, [userId]);

  console.log("user",user)

  const loadUser = async () => {
    try {
      const userData = await fetchUserProfile(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: 'Administrateur', variant: 'destructive' as const },
      OWNER: { label: 'Propriétaire', variant: 'default' as const },
      TENANT: { label: 'Locataire', variant: 'secondary' as const }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return role;
  };

  const getUserName = () => {
    if (user.tenant) {
      return `${user.tenant.firstName} ${user.tenant.lastName}`;
    }
    if (user.owner) {
      return `${user.owner.firstName} ${user.owner.lastName}`;
    }
    return 'Non renseigné';
  };

  const getUserPhone = () => {
    return user.tenant?.phone || user.owner?.phone || 'Non renseigné';
  };

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Accès refusé</h3>
              <p className="text-gray-500 mt-2">
                Vous n'avez pas les permissions nécessaires pour voir les détails des utilisateurs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Utilisateur non trouvé</h3>
        <p className="text-gray-500 mt-2">
          L'utilisateur que vous recherchez n'existe pas.
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/users">
            Retour à la liste
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{getUserName()}</h1>
            <p className="text-muted-foreground">
              Détails de l'utilisateur
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/users/${user.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                  <p className="text-base">{getUserName()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rôle</label>
                  <div className="mt-1">{getRoleBadge(user.role)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-base">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <p className="text-base">{getUserPhone()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations du profil spécifique */}
          {(user.tenant || user.owner) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Informations {user.role === 'TENANT' ? 'du locataire' : 'du propriétaire'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.tenant && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                        <p className="text-base">{user.tenant.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                        <p className="text-base">{user.tenant.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                        <p className="text-base">{user.tenant.phone}</p>
                      </div>
                    </>
                  )}
                  {user.owner && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                        <p className="text-base">{user.owner.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Nom</label>
                        <p className="text-base">{user.owner.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                        <p className="text-base">{user.owner.phone}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Métadonnées */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de création
                </label>
                <p className="text-base">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Dernière modification
                </label>
                <p className="text-base">
                  {new Date(user.updatedAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID utilisateur
                </label>
                <p className="text-base font-mono text-sm break-all">{user.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/admin/users/${user.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier l'utilisateur
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}