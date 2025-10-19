// app/dashboard/owner/tenants/[id]/page.tsx
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
  Home,
  FileText,
  CreditCard
} from 'lucide-react';

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchUserProfile, canManageTenants } = useUserManagement();
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const tenantId = params.id as string;

  useEffect(() => {
    loadTenant();
  }, [tenantId]);

  const loadTenant = async () => {
    try {
      const tenantData = await fetchUserProfile(tenantId);
      setTenant(tenantData);
    } catch (error) {
      console.error('Error loading tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canManageTenants) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Accès refusé</h3>
              <p className="text-gray-500 mt-2">
                Vous n'avez pas les permissions nécessaires pour voir les détails des locataires.
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

  if (!tenant) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Locataire non trouvé</h3>
        <p className="text-gray-500 mt-2">
          Le locataire que vous recherchez n'existe pas.
        </p>
        <Button asChild className="mt-4">
          <Link href="/owner/tenants">
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
            <Link href="/owner/tenants">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {tenant.tenant?.firstName} {tenant.tenant?.lastName}
            </h1>
            <p className="text-muted-foreground">
              Détails du locataire
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/owner/tenants/${tenant.id}/edit`}>
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
                  <p className="text-base">{tenant.tenant?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nom</label>
                  <p className="text-base">{tenant.tenant?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-base">{tenant.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <p className="text-base">{tenant.tenant?.phone || 'Non renseigné'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contrat actuel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Contrat actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Aucun contrat actif</h3>
                <p className="text-gray-500 mt-2">
                  Ce locataire n'a pas de contrat actif pour le moment.
                </p>
                <Button className="mt-4">
                  Créer un contrat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Historique des paiements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Derniers paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Aucun paiement</h3>
                <p className="text-gray-500 mt-2">
                  Aucun paiement enregistré pour ce locataire.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métadonnées et actions */}
        <div className="space-y-6">
          {/* Statut */}
          <Card>
            <CardHeader>
              <CardTitle>Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Statut du locataire</label>
                <div className="mt-2">
                  <Badge variant="secondary">Actif</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Propriété assignée</label>
                <p className="text-base mt-1">Aucune</p>
              </div>
            </CardContent>
          </Card>

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
                  {new Date(tenant.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Dernière modification
                </label>
                <p className="text-base">
                  {new Date(tenant.updatedAt).toLocaleDateString('fr-FR')}
                </p>
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
                <Link href={`/owner/tenants/${tenant.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier le locataire
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Créer un contrat
              </Button>
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Assigner une propriété
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}