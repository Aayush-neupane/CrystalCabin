import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { ScrollExpansionHero } from './components/ScrollExpansionHero/ScrollExpansionHero';
import { WhyChooseUs } from './components/WhyChooseUs/WhyChooseUs';
import { Pricing } from './components/Pricing/Pricing';
import { AppointmentModal } from './components/AppointmentModal/AppointmentModal';
import { MobileDetailingExperience } from './components/MobileDetailingExperience/MobileDetailingExperience';
import { ProofOfWork } from './components/ProofOfWork/ProofOfWork';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { addOns as addOnCatalog } from './data/pricing';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    packageId: string;
    packageName: string;
    vehicleTypeId: string;
    vehicleTypeName: string;
    price: number;
    addOns: { id: string; name: string; price: number }[];
  } | null>(null);

  const handleBookAppointment = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handlePricingBookAppointment = useCallback((
    packageId: string,
    vehicleTypeId: string,
    price: number,
    addOnIds: string[]
  ) => {
    const vehicleTypes = [
      { id: 'sedan', name: 'Sedan' },
      { id: 'compact-suv', name: 'Compact SUV' },
      { id: 'truck-large-suv', name: 'Truck / Large SUV' },
    ];
    const vehicleType = vehicleTypes.find(v => v.id === vehicleTypeId);
    const packageNames: Record<string, string> = {
      basic: 'BASIC',
      premium: 'PREMIUM',
      signature: 'CRYSTAL SIGNATURE',
    };

    const selectedAddOns = addOnIds
      .map(id => addOnCatalog.find(a => a.id === id))
      .filter((addOn): addOn is { id: string; name: string; price: number } => Boolean(addOn));

    setModalData({
      packageId,
      packageName: packageNames[packageId] || packageId,
      vehicleTypeId,
      vehicleTypeName: vehicleType?.name || vehicleTypeId,
      price,
      addOns: selectedAddOns,
    });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalData(null);
  }, []);

  return (
    <>
      <Navbar onBookAppointment={handleBookAppointment} />
      <main>
        <ScrollExpansionHero
          onBookAppointment={handleBookAppointment}
          onExploreServices={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <WhyChooseUs />
        <Pricing onBookAppointment={handlePricingBookAppointment} />
        <MobileDetailingExperience />
        <ProofOfWork />
        <Contact />
      </main>
      <Footer />
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={modalData}
      />
    </>
  );
}

export default App;