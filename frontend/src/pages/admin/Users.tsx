import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface User {
  id: number;
  email: string;
  role: string;
}

interface RoleOption {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ email: string; password: string; role: string }>({
    email: "",
    password: "",
    role: "USER",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${API_BASE}/admin/users`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar usuarios"));
      }
      setUsers(await res.json());
    } catch (err) {
      console.error("Error fetching users", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/roles/active`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar roles"));
      }

      const data = await res.json();
      setRoles(data);

      if (!editingId && data.length > 0 && !data.some((role: RoleOption) => role.name === formData.role)) {
        setFormData((current) => ({ ...current, role: data[0].name }));
      }
    } catch (err) {
      console.error("Error fetching roles", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar roles");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE}/admin/users/${editingId}` : `${API_BASE}/admin/users`;

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al guardar usuario"));
      }

      toast.success(editingId ? "Usuario actualizado" : "Usuario creado");
      setIsDialogOpen(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error al guardar usuario");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Estas seguro de eliminar este usuario?")) return;
    try {
      const res = await authFetch(`${API_BASE}/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al eliminar usuario"));
      }
      toast.success("Usuario eliminado");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Error al eliminar usuario");
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ email: user.email, password: "", role: user.role });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ email: "", password: "", role: roles[0]?.name ?? "USER" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestion de Usuarios</h2>
          <p className="text-muted-foreground">Crea usuarios, administralos y asignales roles activos.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus size={20} className="mr-2" /> Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Correo electronico"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                placeholder={editingId ? "Nueva contrasena (opcional)" : "Contrasena"}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                {...(!editingId ? { required: true } : {})}
              />
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.role && (
                <p className="text-sm text-muted-foreground">
                  {roles.find((role) => role.name === formData.role)?.description || "Sin descripcion"}
                </p>
              )}
              <Button type="submit" className="w-full">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersPage;
