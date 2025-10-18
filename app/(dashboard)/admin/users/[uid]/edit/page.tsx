// app/dashboard/admin/users/[uid]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserManagement } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

type UserRole = 'ADMIN' | 'OWNER' | 'TENANT';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchUserProfile, updateUser, canManageUsers } = useUserManagement();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'TENANT' as UserRole
  });

  const userId = params.uid as string;

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const userData = await fetchUserProfile(userId);
      setUser(userData);
      
      if (userData) {
        setFormData({
          email: userData.email,
          firstName: userData.tenant?.firstName || userData.owner?.firstName || '',
          lastName: userData.tenant?.lastName || userData.owner?.lastName || '',
          phone: userData.tenant?.phone || userData.owner?.phone || '',
          role: userData.role
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Erreur lors du chargement de l\'utilisateur');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append('email', formData.email);
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('phone', formData.phone);
      form.append('role', formData.role);

      const result = await updateUser(userId, form);

      if (result.success) {
        toast.success('Utilisateur modifié avec succès');
        router.push(`/admin/users/${userId}`);
      } else {
        toast.error(result.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                Vous n'avez pas les permissions nécessaires pour modifier les utilisateurs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/users/${userId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier l'utilisateur</h1>
          <p className="text-muted-foreground">
            Modifiez les informations de l'utilisateur
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'utilisateur</CardTitle>
          <CardDescription>
            Modifiez les informations de l'utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="Prénom"
                    className="pl-9"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    placeholder="Nom"
                    className="pl-9"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemple.com"
                    className="pl-9"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="+228 XX XX XX XX"
                    className="pl-9"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Rôle */}
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as UserRole)}
                >
                  <option value="TENANT">Locataire</option>
                  <option value="OWNER">Propriétaire</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Modification...' : 'Modifier l\'utilisateur'}
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/admin/users/${userId}`}>
                  Annuler
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}