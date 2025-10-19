// app/dashboard/admin/owners/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  Home,
  Building2,
  Users,
  CreditCard
} from 'lucide-react';

export default function AdminOwnerDetailPage() {
  const params = useParams();
  const { fetchUserProfile, canManageUsers } = useUserManagement();
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const ownerId = params.id as string;

  useEffect(() => {
    loadOwner();
  }, [ownerId]);

  const loadOwner = async () => {
    try {
      const ownerData = await fetchUserProfile(ownerId);
      setOwner(ownerData);
    } catch (error) {
      console.error('Error loading owner:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Accès refusé</h3>
              <p className="text-gray-500 mt-2">
                Vous n'avez pas les permissions nécessaires pour voir les détails des propriétaires.
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

  if (!owner) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Propriétaire non trouvé</h3>
        <p className="text-gray-500 mt-2">
          Le propriétaire que vous recherchez n'existe pas.
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/owners">
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
            <Link href="/admin/owners">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {owner.owner?.firstName} {owner.owner?.lastName}
            </h1>
            <p className="text-muted-foreground">
              Détails du propriétaire - Administration
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/users/${owner.id}/edit`}>
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
                  <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                  <p className="text-base">{owner.owner?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom</label>
                  <p className="text-base">{owner.owner?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-base">{owner.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <p className="text-base">{owner.owner?.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Rôle</label>
                  <div className="mt-1">
                    <Badge variant="default">Propriétaire</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques du portefeuille */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Portefeuille immobilier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Propriétés</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Locataires</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-muted-foreground">Taux occupation</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">750K FCFA</p>
                  <p className="text-sm text-muted-foreground">Revenus/mois</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dernières activités */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Aucune activité récente</h3>
                <p className="text-gray-500 mt-2">
                  Aucune activité enregistrée pour ce propriétaire.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métadonnées et actions */}
        <div className="space-y-6">
          {/* Métadonnées */}
          <Card>
            <CardHeader>
              <CardTitle>Métadonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date d'inscription
                </label>
                <p className="text-base">
                  {new Date(owner.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Dernière connexion
                </label>
                <p className="text-base">Il y a 2 jours</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ID utilisateur
                </label>
                <p className="text-base font-mono text-sm break-all">{owner.id}</p>
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
                <Link href={`/admin/users/${owner.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le propriétaire
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Building2 className="h-4 w-4 mr-2" />
                Voir les propriétés
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Voir les locataires
              </Button>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Voir les revenus
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}