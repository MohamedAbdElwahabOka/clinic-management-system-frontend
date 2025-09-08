"use client";

import * as React from 'react';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureSection } from '@/components/landing/feature-section';
import { TestimonialCard } from '@/components/landing/testimonial-card';
import { CtaSection } from '@/components/landing/cta-section';
import { LandingFooter } from '@/components/landing/landing-footer';
// import { useLanguage } from '@/context/language-context';
import { DollarSign, BarChart, ShieldCheck, Users, FileText as FileTextIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import CircularGallery from '@/components/Ogl/CircularGallery'
// import CurvedLoop from '@/components/Ogl/CurvedLoop';


export default function LandingPage() {
  const t = useTranslations("Landing");
  const locale = useLocale();

  // Helper translate function
  const translate = (key: string, defaultValue: string) => {
    const translation = t(key);
    // If the translation is the same as the key, use the default value
    return translation === key ? defaultValue : translation;
  };

  const financialFeatures = [
    {
      icon: DollarSign,
      titleKey: "landingFeatureFinancialSubItem1Title",
      defaultTitle: "Expense Tracking",
      descriptionKey: "landingFeatureFinancialSubItem1Desc",
      defaultDescription: "Easily log and categorize all clinic expenses."
    },
    {
      icon: BarChart,
      titleKey: "landingFeatureFinancialSubItem2Title",
      defaultTitle: "Income Reports",
      descriptionKey: "landingFeatureFinancialSubItem2Desc",
      defaultDescription: "Generate comprehensive reports on revenue streams."
    },
  ];

  const clinicManagementFeatures = [
     {
      icon: ShieldCheck,
      titleKey: "landingFeatureClinicMgmtSubItem1Title", 
      defaultTitle: "Efficient Patient Management Made Simple",
      descriptionKey: "landingFeatureClinicMgmtSubItem1Desc",
      defaultDescription: "Simplify patient registration, scheduling, and communication.",
    },
    {
      icon: Users,
      titleKey: "landingFeatureClinicMgmtSubItem2Title", 
      defaultTitle: "Optimize Your Receptionist Operations Today",
      descriptionKey: "landingFeatureClinicMgmtSubItem2Desc",
      defaultDescription: "Automate tasks and improve front-desk efficiency.",
    },
    {
      icon: FileTextIcon, // Use aliased icon
      titleKey: "landingFeatureClinicMgmtSubItem3Title", 
      defaultTitle: "Access Medical Records Anytime, Anywhere",
      descriptionKey: "landingFeatureClinicMgmtSubItem3Desc",
      defaultDescription: "Securely manage patient data with ease.",
    },
    {
      icon: DollarSign, 
      titleKey: "landingFeatureClinicMgmtSubItem4Title", 
      defaultTitle: "Stay on Top of Payment Tracking",
      descriptionKey: "landingFeatureClinicMgmtSubItem4Desc",
      defaultDescription: "Monitor payment statuses and send reminders.",
    },
  ];

  const testimonials = [
    {
      quoteKey: "landingTestimonial1Quote",
      defaultQuote: "I'm impressed with the support & engagement!", 
      authorKey: "landingTestimonial1Author",
      defaultAuthor: "Dr. Anna K.",
      roleKey: "landingTestimonial1Role",
      defaultRole: "General Practitioner, City Clinic",
      stars: 5,
    },
    {
      quoteKey: "landingTestimonial2Quote",
      defaultQuote: "Efficient and user-friendly, a real time saver!", 
      authorKey: "landingTestimonial2Author",
      defaultAuthor: "Dr. Mark S.",
      roleKey: "landingTestimonial2Role",
      defaultRole: "Clinic Manager, HealthPoint",
      stars: 5,
    },
    {
      quoteKey: "landingTestimonial3Quote",
      defaultQuote: "A game changer for patient management!", 
      authorKey: "landingTestimonial3Author",
      defaultAuthor: "Dr. Sarah L.",
      roleKey: "landingTestimonial3Role",
      defaultRole: "Pediatrician, Kids Care Center",
      stars: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">

      <main className="flex-grow">
        <HeroSection
          titleKey="landingHeroTitle"
          defaultTitle="Streamline Your Clinic Management Effortlessly"
          subtitleKey="landingHeroSubtitle"
          defaultSubtitle="Transform your practice with our all-in-one clinic management software. From patient scheduling to automated billing, we provide the tools you need to operate efficiently and deliver superior care."
          cta1Key="landingHeroCtaGetStarted"
          defaultCta1="Get Started"
          cta2Key="landingHeroCtaLearnMore"
          defaultCta2="Learn More"
          imageUrl="https://placehold.co/1200x600.png"
          imageAltKey="landingHeroImageAlt"
          defaultImageAlt="Clinic management software interface"
          imageHint="software interface"
        />
       

      
{/* <CurvedLoop marqueeText="222 " /> */}

{/* 
<CurvedLoop 
  marqueeText="fgfhfgh"
  speed={3}
  curveAmount={500}
  direction="right"
  interactive={true}
  className="custom-text-style"
/> */}

{/* 
<CurvedLoop 
  marqueeText="Smooth Curved Animation"
  speed={1}
  curveAmount={300}
  interactive={false}
/> */}
        <FeatureSection
          titleKey="landingFeatureFinancialTitle"
          defaultTitle="Streamline Your Clinic's Financial Management with Our Expense Tracking Feature"
          descriptionKey="landingFeatureFinancialDesc"
          defaultDescription="Our intuitive tools make it easy to track income, manage expenses, and gain clear insights into your clinic's financial health. Simplify bookkeeping and make informed decisions."
          features={financialFeatures}
          gridCols="md:grid-cols-2" 
          sectionId="financial-features"
        />
        
        <FeatureSection
          titleKey="landingFeaturePaymentsTitle"
          defaultTitle="Effortless Management of Appointment Payments"
          descriptionKey="landingFeaturePaymentsDesc"
          defaultDescription="Our secure payment processing system simplifies billing, reduces administrative work, and ensures you get paid on time. Integrated with appointment scheduling for a seamless experience."
          imageUrl="https://placehold.co/600x400.png" 
          imageAltKey="landingFeaturePaymentsImageAlt"
          defaultImageAlt="Secure payment processing interface"
          imageHint="payment interface"
          reverseLayout={false} 
          cta1Key="landingFeaturePaymentsCtaExplore"
          defaultCta1="Explore Features"
          cta1Href="#"
          cta2Key="landingFeaturePaymentsCtaSignUp"
          defaultCta2="Sign Up"
          cta2Href={`/${locale}/signup`}
          sectionId="payment-features"
        />

        <FeatureSection
          titleKey="landingFeatureClinicMgmtTitle" 
          defaultTitle="Streamline Your Clinic Management Effortlessly" 
          descriptionKey="landingFeatureClinicMgmtDesc" 
          defaultDescription="Our comprehensive platform streamlines daily operations from patient check-in to medical records management. Reduce administrative burden, improve workflow efficiency, and focus on providing exceptional patient care."
          features={clinicManagementFeatures}
          gridCols="md:grid-cols-2" 
          cta1Key="landingFeatureClinicMgmtCtaLearnMore"
          defaultCta1="Learn More"
          cta1Href="#"
          cta2Key="landingFeatureClinicMgmtCtaTryFree"
          defaultCta2="Try for Free"
          cta2Href={`/${locale}/signup`}
          sectionId="management-features"
        />

        <section id="testimonials" className="py-16 lg:py-24 bg-secondary dark:bg-secondary/10 text-secondary-foreground">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {translate('landingTestimonialsTitle', "Customer Testimonials")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={translate(testimonial.quoteKey, testimonial.defaultQuote)}
                  author={translate(testimonial.authorKey, testimonial.defaultAuthor)}
                  role={translate(testimonial.roleKey, testimonial.defaultRole)}
                  stars={testimonial.stars}
                />
              ))}
            </div>
          </div>
        </section>
            <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#000" borderRadius={0.05} scrollEase={0.02}/>
            </div>  

        <CtaSection
          titleKey="landingCtaBottomTitle"
          defaultTitle="Transform Your Clinic Today"
          subtitleKey="landingCtaBottomSubtitle"
          defaultSubtitle="Join hundreds of satisfied clinics. Get started with Clinica and revolutionize your practice management."
          cta1Key="landingCtaBottomButton1"
          defaultCta1="Request a Demo"
          cta1Href="#"
          cta2Key="landingCtaBottomButton2"
          defaultCta2="Explore Plans"
          cta2Href="#"
        />
      </main>
      <LandingFooter />
    </div>
  );
}

