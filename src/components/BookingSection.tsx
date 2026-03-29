import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock, User, Phone, Mail, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBooking } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00",
];

const serviceOptions = [
  "Rehabilitación Traumatológica",
  "Fisioterapia Deportiva",
  "Terapia Neurológica",
  "Fisioterapia Cardiopulmonar",
  "Electroterapia",
  "Terapia Manual",
];

const BookingSection = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !service || !name || !phone) {
      toast.error("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      await createBooking({
        name,
        phone,
        email,
        service,
        date: date.toISOString().split("T")[0],
        time,
        notes,
      });
      toast.success("¡Cita agendada exitosamente!", {
        description: `${format(date, "PPP", { locale: es })} a las ${time}`,
      });
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al comunicar con el servidor.");
    }

    // Reset
    setDate(undefined);
    setTime("");
    setService("");
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
  };

  return (
    <section id="agendar" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Agenda tu Cita
          </span>
          <h2 className="heading-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Reserva en minutos
          </h2>
          <p className="text-muted-foreground text-lg">
            Selecciona la fecha, hora y servicio que necesitas. Te confirmaremos tu cita de inmediato.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-card rounded-2xl border border-border/50 p-6 md:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User size={16} className="text-primary" /> Nombre completo *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone size={16} className="text-primary" /> Teléfono *
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                type="tel"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail size={16} className="text-primary" /> Correo electrónico
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                type="email"
              />
            </div>

            {/* Service */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Servicio *
              </label>
              <Select value={service} onValueChange={setService}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviceOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary" /> Fecha *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date() || d.getDay() === 0}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock size={16} className="text-primary" /> Hora *
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText size={16} className="text-primary" /> Notas adicionales
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe brevemente tu motivo de consulta..."
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full mt-8 text-base">
            Confirmar Cita
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BookingSection;
