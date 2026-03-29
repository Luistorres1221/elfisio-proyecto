import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_BASE, authFetch, getErrorMessage } from "@/lib/api";

interface Patient {
  id: number;
  fullName: string;
  documentId: string;
  medicalObservations: string;
}

interface ClinicalNote {
  id?: number;
  patientId: number;
  noteText: string;
  createdAt?: string;
}

const ClinicalHistoryPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchClinicalNotes(selectedPatient.id);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const res = await authFetch(`${API_BASE}/admin/patients`);
      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al cargar pacientes"));
      }
      setPatients(await res.json());
    } catch (err) {
      console.error("Error fetching patients:", err);
      toast.error(err instanceof Error ? err.message : "Error al cargar pacientes");
    }
  };

  const fetchClinicalNotes = async (patientId: number) => {
    try {
      const res = await authFetch(`${API_BASE}/admin/clinical-notes/${patientId}`);
      if (res.ok) {
        setClinicalNotes(await res.json());
      } else {
        setClinicalNotes([]);
      }
    } catch (err) {
      console.error("Error fetching clinical notes:", err);
      setClinicalNotes([]);
    }
  };

  const handleAddNote = async () => {
    if (!selectedPatient || !noteText.trim()) {
      toast.error("Por favor selecciona un paciente y escribe una nota");
      return;
    }

    try {
      const res = await authFetch(`${API_BASE}/admin/clinical-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          noteText,
        }),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al guardar la nota"));
      }

      toast.success("Nota clinica agregada");
      setNoteText("");
      fetchClinicalNotes(selectedPatient.id);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al guardar la nota");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm("Estas seguro de eliminar esta nota?")) return;

    try {
      const res = await authFetch(`${API_BASE}/admin/clinical-notes/${noteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res, "Error al eliminar nota"));
      }

      toast.success("Nota eliminada");
      if (selectedPatient) {
        fetchClinicalNotes(selectedPatient.id);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error al eliminar nota");
    }
  };

  const filteredPatients = patients.filter(
    (p) => p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || p.documentId.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">Historial Clinico</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Pacientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Buscar paciente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedPatient?.id === patient.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-semibold text-sm">{patient.fullName}</p>
                  <p className="text-xs text-muted-foreground">{patient.documentId}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {selectedPatient ? `Historia de ${selectedPatient.fullName}` : "Selecciona un paciente"}
              </CardTitle>
              {selectedPatient && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus size={16} className="mr-2" /> Nueva Nota
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nota Clinica</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold">Paciente</label>
                        <p className="text-sm text-muted-foreground">{selectedPatient.fullName}</p>
                      </div>
                      <Textarea
                        placeholder="Escribe la nota clinica..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={6}
                      />
                      <Button onClick={handleAddNote} className="w-full">
                        Guardar Nota
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPatient ? (
              <>
                <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Documento:</span> {selectedPatient.documentId}
                  </p>
                  {selectedPatient.medicalObservations && (
                    <p className="text-sm">
                      <span className="font-semibold">Observaciones:</span> {selectedPatient.medicalObservations}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Notas Clinicas</h3>
                  {clinicalNotes.length > 0 ? (
                    clinicalNotes.map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <FileText size={16} className="text-primary mt-1" />
                            <div className="flex-1">
                              <p className="text-sm">{note.noteText}</p>
                              {note.createdAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(note.createdAt).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => note.id && handleDeleteNote(note.id)}>
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay notas clinicas aun</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Selecciona un paciente para ver su historial clinico</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicalHistoryPage;
