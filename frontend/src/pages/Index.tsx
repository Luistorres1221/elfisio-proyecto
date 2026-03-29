import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BookingSection from "@/components/BookingSection";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <>
      <main>
        {!user && <HeroSection />}
        <ServicesSection />
        <BookingSection />
      </main>
    </>
  );
};

export default Index;
