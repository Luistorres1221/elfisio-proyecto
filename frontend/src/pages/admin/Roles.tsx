import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Role {
  id?: number;
  name: string;
  description: string;
  active: boolean;
}

const EMPTY_ROLE: Role = {
  name: "",
  description: "",
  active: true,
};

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Role>(EMPTY_ROLE);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`${API_BASE}/admin/roles`);
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "No se pudieron cargar los roles"));
      }

      setRoles(await response.json());
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudieron cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_ROLE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE}/admin/roles/${editingId}` : `${API_BASE}/admin/roles`;
      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "No se pudo guardar el rol"));
      }

      toast.success(editingId ? "Rol actualizado" : "Rol creado");
      setIsDialogOpen(false);
      resetForm();
      fetchRoles();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el rol");
    }
  };

  const handleEdit = (role: Role) => {
    setEditingId(role.id ?? null);
    setFormData(role);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Estas seguro de eliminar este rol?")) {
      return;
    }

    try {
      const response = await authFetch(`${API_BASE}/admin/roles/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "No se pudo eliminar el rol"));
      }

      toast.success("Rol eliminado");
      fetchRoles();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el rol");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Roles</h2>
          <p className="text-muted-foreground">Crea, edita y activa roles para asignarlos a los usuarios.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus size={18} className="mr-2" /> Nuevo rol
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar rol" : "Nuevo rol"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del rol</label>
                <Input
                  placeholder="Ej: RECEPCION"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descripcion</label>
                <Textarea
                  placeholder="Describe que puede hacer este rol"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Rol activo</p>
                  <p className="text-sm text-muted-foreground">Solo los roles activos se pueden asignar.</p>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Actualizar rol" : "Crear rol"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de roles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando roles...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description || "Sin descripcion"}</TableCell>
                    <TableCell>{role.active ? "Activo" : "Inactivo"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(role)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => role.id && handleDelete(role.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPage;
