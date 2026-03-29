import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Service {
  id?: number;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  active: boolean;
}

const EMPTY_SERVICE: Service = {
  name: "",
  description: "",
  durationMinutes: 60,
  price: 0,
  active: true,
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Service>(EMPTY_SERVICE);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/services`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar servicios"));
      }
      setServices(await res.json());
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar servicios");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_BASE}/admin/services/${editingId}` : `${API_BASE}/admin/services`;

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al guardar servicio"));
      }

      toast.success(editingId ? "Servicio actualizado" : "Servicio creado");
      fetchServices();
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al guardar servicio");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Estas seguro de eliminar este servicio?")) return;

    try {
      const res = await authFetch(`${API_BASE}/admin/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al eliminar servicio"));
      }

      toast.success("Servicio eliminado");
      fetchServices();
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al eliminar servicio");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id || null);
    setFormData({ ...EMPTY_SERVICE, ...service });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_SERVICE);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Gestion de Servicios</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus size={20} className="mr-2" /> Nuevo Servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Servicio" : "Nuevo Servicio"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nombre del servicio"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Textarea
                placeholder="Descripcion"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Input
                placeholder="Duracion (minutos)"
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              />
              <Input
                placeholder="Precio"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <label className="text-sm">Servicio activo</label>
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Actualizar" : "Crear"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                {service.active ? (
                  <Check className="text-green-600" size={20} />
                ) : (
                  <X className="text-red-600" size={20} />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{service.description || "Sin descripcion"}</p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">Duracion:</span> {service.durationMinutes} minutos
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Precio:</span> ${service.price}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(service)}>
                  <Edit size={16} />
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => service.id && handleDelete(service.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
