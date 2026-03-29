import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa6";
import { useAppSettings } from "@/hooks/useAppSettings";

const Footer = () => {
  const { settings } = useAppSettings({ requireAuth: false });
  const siteName = settings.siteName || "ELFISIO";
  const companyName = settings.companyName || siteName;
  const logoSrc = settings.logoUrl || "/elfisio-logo.png";
  const email = settings.companyEmail || "info@fisiovida.com";
  const phone = settings.companyPhone || "+57 300 123 4567";
  const address = settings.address || "Calle Principal #123, Ciudad";
  const legalLinks = [
    { label: "Politica de tratamiento de datos", to: "/tratamiento-datos" },
    { label: "Terminos y condiciones", to: "/terminos-condiciones" },
    { label: "Politica de cookies", to: "/politica-cookies" },
  ];
  const socialLinks = [
    { label: "Facebook", href: "https://www.facebook.com/", icon: FaFacebookF },
    { label: "Instagram", href: "https://www.instagram.com/", icon: FaInstagram },
    {
      label: "WhatsApp",
      href: "https://wa.me/573017749618?text=Hola%2C%20quiero%20informacion",
      icon: FaWhatsapp,
    },
    { label: "YouTube", href: "https://www.youtube.com/", icon: FaYoutube },
  ];

  return (
    <footer id="contacto" className="bg-foreground py-16 text-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoSrc}
                alt={`${siteName} logo`}
                className="h-14 w-14 rounded-full border-2 border-primary object-contain"
              />
              <div>
                <h3 className="heading-display mb-1 text-2xl font-bold text-background">
                  {siteName}
                </h3>
                <p className="text-sm text-muted-foreground">{companyName}</p>
              </div>
            </div>
            <p className="leading-relaxed text-background/60">
              Centro de fisioterapia {companyName} enfocado en tu recuperacion y bienestar
              integral.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ir a ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-background/20 bg-background/10 text-background transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background">Contacto</h4>
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex items-center gap-3">
                <MapPin size={16} /> {address}
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} /> {phone}
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} /> {email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-background">Horario</h4>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-3">
                <Clock size={16} /> Lunes - Viernes: 8:00 - 18:00
              </p>
              <p className="flex items-center gap-3">
                <Clock size={16} /> Sabado: 8:00 - 13:00
              </p>
              <p className="flex items-center gap-3">
                <Clock size={16} /> Domingo: Cerrado
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-background">Informacion legal</h4>
            <div className="space-y-3 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-background/70 transition-colors hover:text-background"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-8 text-center text-sm text-background/40">
          &copy; {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
