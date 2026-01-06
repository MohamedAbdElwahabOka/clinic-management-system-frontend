"use client";

import * as React from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
// import { useLanguage } from '@/context/language-context';
import {
  DollarSign,
  BarChart,
  ShieldCheck,
  Users,
  FileText as FileTextIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import CircularGallery from "@/components/Ogl/CircularGallery";
import { PricingSection } from "@/components/landing/pricing-section";
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
      defaultDescription: "Easily log and categorize all clinic expenses.",
    },
    {
      icon: BarChart,
      titleKey: "landingFeatureFinancialSubItem2Title",
      defaultTitle: "Income Reports",
      descriptionKey: "landingFeatureFinancialSubItem2Desc",
      defaultDescription: "Generate comprehensive reports on revenue streams.",
    },
  ];

  const clinicManagementFeatures = [
    {
      icon: ShieldCheck,
      titleKey: "landingFeatureClinicMgmtSubItem1Title",
      defaultTitle: "Efficient Patient Management Made Simple",
      descriptionKey: "landingFeatureClinicMgmtSubItem1Desc",
      defaultDescription:
        "Simplify patient registration, scheduling, and communication.",
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
          imageUrl="/hero/Clinic Management1200-600.png"
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
          imageUrl="/hero/Clinic Management600-400.png"
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

        <section
          id="testimonials"
          className="py-16 lg:py-24 bg-secondary dark:bg-secondary/10 text-secondary-foreground"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              {translate("landingTestimonialsTitle", "Customer Testimonials")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  quote={translate(
                    testimonial.quoteKey,
                    testimonial.defaultQuote
                  )}
                  author={translate(
                    testimonial.authorKey,
                    testimonial.defaultAuthor
                  )}
                  role={translate(testimonial.roleKey, testimonial.defaultRole)}
                  stars={testimonial.stars}
                />
              ))}
            </div>
          </div>
        </section>
        {/* <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery bend={3} textColor="#000" borderRadius={0.05} scrollEase={0.02}/>
            </div>   */}
        <PricingSection globalDiscount={0} />

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

// "use client";

// import * as React from "react";
// import { useLocale, useTranslations } from "next-intl";
// import {
//   Cloud,
//   Shield,
//   Zap,
//   TrendingUp,
//   Users,
//   DollarSign,
//   BarChart3,
//   Sparkles,
//   CheckCircle2,
//   ArrowRight,
//   Globe,
//   Lock,
//   Smartphone,
//   HeartPulse,
//   Calendar,
//   Activity,
//   Award,
//   Stethoscope,
//   Pill,
//   Syringe,
//   Microscope,
//   Brain,
//   Heart,
//   ClipboardPlus,
// } from "lucide-react";
// import { LandingFooter } from "@/components/landing/landing-footer";
// import { PricingSection } from "@/components/landing/pricing-section";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";

// // Floating Medical Icons Component
// const FloatingMedicalIcons = () => {
//   const medicalIcons = [
//     { Icon: HeartPulse, delay: 0, x: "10%", y: "20%" },
//     { Icon: Stethoscope, delay: 1, x: "80%", y: "30%" },
//     { Icon: Pill, delay: 2, x: "15%", y: "70%" },
//     { Icon: Syringe, delay: 1.5, x: "70%", y: "60%" },
//     { Icon: Microscope, delay: 0.5, x: "85%", y: "80%" },
//     { Icon: Brain, delay: 2.5, x: "25%", y: "85%" },
//     { Icon: Heart, delay: 1.2, x: "90%", y: "15%" },
//     { Icon: Activity, delay: 1.8, x: "5%", y: "50%" },
//   ];

//   return (
//     <div className="absolute inset-0 pointer-events-none overflow-hidden">
//       {medicalIcons.map(({ Icon, delay, x, y }, index) => (
//         <div
//           key={index}
//           className="floating-icon"
//           style={{
//             left: x,
//             top: y,
//             animationDelay: `${delay}s`,
//           }}
//         >
//           <Icon className="w-8 h-8 text-primary/20" />
//         </div>
//       ))}
//     </div>
//   );
// };

// // 3D Medical Card Component
// const Medical3DCard = ({
//   icon: Icon,
//   title,
//   description,
//   gradient,
//   index,
// }: any) => {
//   return (
//     <div className="perspective-container">
//       <Card className="medical-3d-card group relative p-8 overflow-hidden h-full border-2 border-transparent hover:border-primary/20">
//         {/* Animated background gradient */}
//         <div
//           className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//         />

//         {/* 3D Icon Container */}
//         <div className="relative mb-6">
//           <div
//             className={`icon-3d-wrapper inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}
//           >
//             <Icon className="w-8 h-8 text-white medical-icon-glow" />
//           </div>
//           {/* Pulse rings */}
//           <div className="pulse-ring pulse-ring-1 text-primary/50"></div>
//           <div className="pulse-ring pulse-ring-2 text-primary/30"></div>
//         </div>

//         <h3 className="text-xl font-bold mb-3 medical-text-glow group-hover:text-primary transition-colors">
//           {title}
//         </h3>
//         <p className="text-muted-foreground">{description}</p>

//         {/* Medical cross decoration */}
//         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity">
//           <ClipboardPlus className="w-6 h-6 text-primary" />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default function LandingPage() {
//   const t = useTranslations("Landing");
//   const locale = useLocale();
//   const [scrollY, setScrollY] = React.useState(0);

//   // Use simple effect for scroll position to drive parallax
//   React.useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const translate = (key: string, defaultValue: string) => {
//     const translation = t(key);
//     return translation === key ? defaultValue : translation;
//   };

//   // SaaS advantages for the clinic management system
//   const saasAdvantages = [
//     {
//       icon: Cloud,
//       title: "Cloud-Based Access",
//       description:
//         "Access your clinic data from anywhere, anytime on any device with secure cloud storage.",
//       gradient: "from-blue-500 to-cyan-500",
//     },
//     {
//       icon: DollarSign,
//       title: "Cost-Effective",
//       description:
//         "No expensive hardware needed. Pay only for what you use with our flexible pricing plans.",
//       gradient: "from-green-500 to-emerald-500",
//     },
//     {
//       icon: Zap,
//       title: "Instant Updates",
//       description:
//         "Always get the latest features with automatic cloud updates without any downtime.",
//       gradient: "from-purple-500 to-pink-500",
//     },
//     {
//       icon: Shield,
//       title: "Enterprise Security",
//       description:
//         "Bank-level encryption and full compliance with healthcare data protection standards.",
//       gradient: "from-orange-500 to-red-500",
//     },
//     {
//       icon: TrendingUp,
//       title: "Scalable Growth",
//       description:
//         "Start small and scale as your practice grows without limits on data or users.",
//       gradient: "from-indigo-500 to-blue-500",
//     },
//     {
//       icon: Users,
//       title: "Collaborative Teams",
//       description:
//         "Enable seamless collaboration across your entire staff with role-based access control.",
//       gradient: "from-teal-500 to-green-500",
//     },
//   ];

//   // Medical-specific features
//   const medicalFeatures = [
//     {
//       icon: Stethoscope,
//       title: "Smart Diagnostics",
//       description:
//         "AI-powered clinical decision support for accurate diagnoses",
//       color: "text-blue-500",
//     },
//     {
//       icon: HeartPulse,
//       title: "Patient Monitoring",
//       description: "Real-time vital signs tracking and automated alerts",
//       color: "text-red-500",
//     },
//     {
//       icon: Pill,
//       title: "Prescription Management",
//       description: "Digital prescriptions with drug interaction warnings",
//       color: "text-green-500",
//     },
//     {
//       icon: Calendar,
//       title: "Smart Scheduling",
//       description: "AI-powered appointment booking with automated reminders",
//       color: "text-purple-500",
//     },
//     {
//       icon: BarChart3,
//       title: "Analytics Dashboard",
//       description: "Real-time insights into practice performance and revenue",
//       color: "text-orange-500",
//     },
//     {
//       icon: Lock,
//       title: "HIPAA Compliant",
//       description: "Healthcare-grade security and data privacy protection",
//       color: "text-indigo-500",
//     },
//   ];

//   // Trust indicators
//   const stats = [
//     { value: "500+", label: "Clinics Trust Us", icon: Heart },
//     { value: "50K+", label: "Patients Managed", icon: Users },
//     { value: "99.9%", label: "Uptime SLA", icon: Activity },
//     { value: "24/7", label: "Support Available", icon: HeartPulse },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
//       <main className="flex-grow">
//         {/* Enhanced Hero Section with 3D Medical Elements */}
//         <section className="relative overflow-hidden medical-hero-section min-h-[90vh] flex items-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
//           {/* Animated medical background icons */}
//           <FloatingMedicalIcons />

//           {/* Parallax Gradient Orbs */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             <div
//               className="absolute -top-40 -right-40 w-96 h-96 medical-gradient-orb orb-blue transition-transform duration-700 ease-out"
//               style={{ transform: `translateY(${scrollY * 0.1}px)` }}
//             />
//             <div
//               className="absolute -bottom-40 -left-40 w-96 h-96 medical-gradient-orb orb-green transition-transform duration-700 ease-out"
//               style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
//             />
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] medical-gradient-orb orb-purple" />
//           </div>

//           <div className="container mx-auto px-4 py-20 relative z-10">
//             <div className="grid lg:grid-cols-2 gap-12 items-center">
//               <div className="space-y-8 text-center lg:text-left">
//                 {/* Medical badge */}
//                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-sm">
//                   <Sparkles className="w-4 h-4 text-yellow-500" />
//                   <span className="font-medium">
//                     Advanced Healthcare SaaS Platform
//                   </span>
//                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
//                 </div>

//                 <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
//                   <span className="block">
//                     {translate("landingHeroTitle", "Transform Healthcare")}
//                   </span>
//                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
//                     with Cloud Tech
//                   </span>
//                 </h1>

//                 <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
//                   {translate(
//                     "landingHeroSubtitle",
//                     "Revolutionize patient care with AI-powered diagnostics, seamless workflows, and enterprise-grade security. The future of medical practice management is here."
//                   )}
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
//                   <Link href={`/${locale}/signup`}>
//                     <Button
//                       size="lg"
//                       className="w-full sm:w-auto h-14 text-lg px-8 rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1"
//                     >
//                       <Stethoscope className="mr-2 w-5 h-5" />
//                       {translate(
//                         "landingHeroCtaGetStarted",
//                         "Start Free Trial"
//                       )}
//                       <ArrowRight className="ml-2 w-5 h-5" />
//                     </Button>
//                   </Link>
//                   <Link href="#features">
//                     <Button
//                       size="lg"
//                       variant="outline"
//                       className="w-full sm:w-auto h-14 text-lg px-8 rounded-xl hover:bg-secondary/50 backdrop-blur-sm border-2"
//                     >
//                       {translate("landingHeroCtaLearnMore", "Explore Features")}
//                     </Button>
//                   </Link>
//                 </div>

//                 {/* Trust badges with icons */}
//                 <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-6 border-t border-border/50">
//                   {[
//                     { text: "No credit card required", icon: Shield },
//                     { text: "14-day free trial", icon: Calendar },
//                     { text: "HIPAA Compliant", icon: CheckCircle2 },
//                   ].map((badge, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50"
//                     >
//                       <badge.icon className="w-4 h-4 text-green-500" />
//                       <span>{badge.text}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* 3D Dashboard Preview */}
//               <div className="relative pt-10 lg:pt-0 perspective-container">
//                 <div className="dashboard-3d-container">
//                   <div className="dashboard-3d-inner relative z-10">
//                     <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl pointer-events-none" />
//                     <img
//                       src="/hero/Clinic Management1200-600.png"
//                       alt="Clinic Management Dashboard"
//                       className="w-full h-full object-cover rounded-2xl border-4 border-background/50 shadow-2xl"
//                     />

//                     {/* 3D Floating cards */}
//                     <div className="floating-stat-card stat-card-1 absolute top-[10%] -right-[5%] z-20">
//                       <div className="bg-primary/10 p-2 rounded-full">
//                         <Activity className="w-5 h-5 text-primary" />
//                       </div>
//                       <div className="ml-3">
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
//                           Active Patients
//                         </p>
//                         <p className="text-xl font-bold text-foreground">
//                           2,847
//                         </p>
//                       </div>
//                     </div>

//                     <div className="floating-stat-card stat-card-2 absolute bottom-[20%] -left-[5%] z-20">
//                       <div className="bg-red-500/10 p-2 rounded-full">
//                         <Heart className="w-5 h-5 text-red-500 heartbeat-animation" />
//                       </div>
//                       <div className="ml-3">
//                         <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
//                           Consultations
//                         </p>
//                         <p className="text-xl font-bold text-foreground">156</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Animated Stats Section */}
//         <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden">
//           <div className="absolute inset-0 medical-cross-pattern opacity-5 mix-blend-overlay" />
//           <div className="container mx-auto px-4 relative z-10">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-foreground/10">
//               {stats.map((stat, index) => (
//                 <div key={index} className="text-center p-4">
//                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4 backdrop-blur-sm">
//                     <stat.icon className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="text-4xl md:text-5xl font-bold mb-2 counter-animation tracking-tight">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm md:text-base opacity-90 font-medium uppercase tracking-wider">
//                     {stat.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* SaaS Advantages with 3D Cards */}
//         <section id="features" className="py-24 lg:py-32 relative">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-20">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-500/20 mb-6">
//                 <Microscope className="w-4 h-4" />
//                 <span>Powered by Advanced Technology</span>
//               </div>
//               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
//                 Why Choose Cloud-Based Healthcare?
//               </h2>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
//                 Experience cutting-edge SaaS technology designed specifically
//                 for modern medical practices, enabling you to focus on what
//                 matters most—your patients.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {saasAdvantages.map((advantage, index) => (
//                 <Medical3DCard key={index} {...advantage} index={index} />
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Medical Features Grid with Hover Effects */}
//         <section className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
//           <div className="absolute inset-0 medical-dna-helix opacity-5 pointer-events-none" />

//           <div className="container mx-auto px-4 relative z-10">
//             <div className="text-center mb-20">
//               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
//                 Complete Medical Practice Suite
//               </h2>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
//                 A comprehensive ecosystem of tools designed to streamline every
//                 aspect of your clinical operations.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {medicalFeatures.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="group p-8 rounded-2xl bg-background/60 backdrop-blur-xl border border-primary/5 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 cursor-default relative overflow-hidden"
//                 >
//                   <div
//                     className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}
//                   >
//                     <feature.icon className="w-32 h-32" />
//                   </div>

//                   <div className="relative z-10">
//                     <div className="inline-flex p-3 rounded-xl bg-background border border-border shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
//                       <feature.icon className={`w-8 h-8 ${feature.color}`} />
//                     </div>
//                     <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
//                     <p className="text-muted-foreground leading-relaxed">
//                       {feature.description}
//                     </p>

//                     <div className="mt-6 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
//                       <span>Learn more</span>
//                       <ArrowRight className="w-4 h-4 ml-1" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* How It Works with Medical Theme */}
//         <section className="py-24 lg:py-32">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-20">
//               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
//                 Start Your Digital Clinic
//               </h2>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Launch your fully integrated digital practice in three simple
//                 steps.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">
//               {/* Connecting line */}
//               <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/30 z-0" />

//               {[
//                 {
//                   number: 1,
//                   title: "Sign Up",
//                   desc: "Create your secure account. No credit card required.",
//                   gradient: "from-blue-500 to-cyan-500",
//                   icon: ClipboardPlus,
//                 },
//                 {
//                   number: 2,
//                   title: "Configure",
//                   desc: "Customize your clinic profile, staff, and medical services.",
//                   gradient: "from-purple-500 to-pink-500",
//                   icon: Stethoscope,
//                 },
//                 {
//                   number: 3,
//                   title: "Launch",
//                   desc: "Start seeing patients and managing your practice digitally.",
//                   gradient: "from-green-500 to-emerald-500",
//                   icon: RocketIcon,
//                 },
//               ].map((step, idx) => (
//                 <div
//                   key={step.number}
//                   className="relative text-center z-10 group"
//                 >
//                   <div
//                     className={`w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${step.gradient} p-0.5 transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-xl`}
//                   >
//                     <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center relative overflow-hidden">
//                       <div
//                         className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-10`}
//                       />
//                       <step.icon className="w-10 h-10 text-foreground relative z-10" />
//                       <div className="absolute -bottom-2 -right-2 text-6xl font-black text-foreground/5 select-none">
//                         {step.number}
//                       </div>
//                     </div>
//                   </div>

//                   <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed px-4">
//                     {step.desc}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Benefits Comparison */}
//         <section className="py-24 lg:py-32 bg-secondary/30">
//           <div className="container mx-auto px-4">
//             <div className="max-w-5xl mx-auto">
//               <div className="text-center mb-20">
//                 <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
//                   SaaS vs Traditional Software
//                 </h2>
//                 <p className="text-lg md:text-xl text-muted-foreground">
//                   See why leading clinics are switching to the cloud.
//                 </p>
//               </div>

//               <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
//                 {/* Traditional */}
//                 <Card className="p-8 md:p-10 bg-background/50 border-border/60 hover:bg-background transition-colors relative opacity-80 hover:opacity-100">
//                   <h3 className="text-2xl font-bold mb-8 text-muted-foreground flex items-center">
//                     <span className="w-3 h-3 rounded-full bg-red-400 mr-3" />
//                     Traditional Software
//                   </h3>
//                   <ul className="space-y-5">
//                     {[
//                       "High upfront costs & licensing fees",
//                       "Expensive server hardware required",
//                       "Manual, risky software updates",
//                       "Limited or no remote access",
//                       "Dependent on local IT support",
//                       "Data at risk of local hardware failure",
//                     ].map((item, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-3 text-muted-foreground/80"
//                       >
//                         <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <div className="w-2 h-2 bg-red-500 rounded-full" />
//                         </div>
//                         <span>{item}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </Card>

//                 {/* SaaS */}
//                 <Card className="p-8 md:p-10 border-2 border-primary/20 shadow-2xl relative overflow-hidden transform md:-translate-y-4 bg-background">
//                   <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
//                   <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
//                     Recommended
//                   </div>

//                   <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center">
//                     <span className="w-3 h-3 rounded-full bg-green-500 mr-3 animate-pulse" />
//                     Cloud-Based SaaS
//                   </h3>
//                   <ul className="space-y-5 relative z-10">
//                     {[
//                       "Affordable monthly subscription",
//                       "Zero hardware investment needed",
//                       "Automated, free security updates",
//                       "Secure access from any device",
//                       "Enterprise-grade reliability",
//                       "Automatic daily backups",
//                     ].map((item, i) => (
//                       <li key={i} className="flex items-start gap-3">
//                         <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
//                         </div>
//                         <span className="font-medium text-foreground/90">
//                           {item}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   {/* Background decoration */}
//                   <div className="absolute -bottom-10 -right-10 opacity-5">
//                     <Cloud className="w-48 h-48" />
//                   </div>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="py-24 lg:py-32">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-20">
//               <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
//                 {translate(
//                   "landingTestimonialsTitle",
//                   "Trusted by Healthcare Professionals"
//                 )}
//               </h2>
//               <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Join thousands of medical practices delivering better care with
//                 our platform.
//               </p>
//             </div>

//             <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//               {[
//                 {
//                   quote:
//                     "This platform has revolutionized how we manage our clinic. The cloud-based access means I can check patient data securely even when I'm away.",
//                   author: "Dr. Anna K.",
//                   role: "General Practitioner",
//                   location: "City Clinic",
//                   avatar: "👩‍⚕️",
//                 },
//                 {
//                   quote:
//                     "The cost savings alone justify the switch. No more expensive servers or IT staff. Everything just works, and the support is phenomenal.",
//                   author: "Dr. Mark S.",
//                   role: "Clinic Director",
//                   location: "HealthPoint Center",
//                   avatar: "👨‍⚕️",
//                 },
//                 {
//                   quote:
//                     "Patient satisfaction has increased significantly since we started using this system. The automated appointments and reminders are game-changers.",
//                   author: "Dr. Sarah L.",
//                   role: "Head of Pediatrics",
//                   location: "Kids Care",
//                   avatar: "👩‍⚕️",
//                 },
//               ].map((testimonial, index) => (
//                 <Card
//                   key={index}
//                   className="p-8 hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/30 flex flex-col h-full bg-secondary/5"
//                 >
//                   <div className="flex gap-1 mb-6">
//                     {[...Array(5)].map((_, i) => (
//                       <Award
//                         key={i}
//                         className="w-5 h-5 fill-yellow-400 text-yellow-400"
//                       />
//                     ))}
//                   </div>
//                   <p className="text-muted-foreground mb-8 italic leading-relaxed flex-grow">
//                     "{testimonial.quote}"
//                   </p>

//                   <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/60">
//                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shadow-sm border border-primary/10">
//                       {testimonial.avatar}
//                     </div>
//                     <div>
//                       <p className="font-bold text-foreground">
//                         {testimonial.author}
//                       </p>
//                       <div className="text-xs text-muted-foreground flex flex-col">
//                         <span className="font-semibold text-primary">
//                           {testimonial.role}
//                         </span>
//                         <span>{testimonial.location}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Pricing */}
//         <PricingSection globalDiscount={0} />

//         {/* Final CTA with Medical Theme */}
//         <section className="relative py-24 lg:py-32 overflow-hidden bg-primary text-primary-foreground">
//           {/* Animated Background */}
//           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-primary opacity-90"></div>

//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             <div className="absolute top-0 right-0 p-20 opacity-10 transform rotate-12">
//               <HeartPulse className="w-96 h-96" />
//             </div>
//             <div className="absolute bottom-0 left-0 p-20 opacity-10 transform -rotate-12">
//               <Activity className="w-96 h-96" />
//             </div>
//           </div>

//           <div className="container mx-auto px-4 relative z-10">
//             <div className="max-w-4xl mx-auto text-center">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20 mb-8 backdrop-blur-md">
//                 <HeartPulse className="w-4 h-4 animate-pulse" />
//                 <span>Join the Healthcare Revolution</span>
//               </div>

//               <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
//                 {translate(
//                   "landingCtaBottomTitle",
//                   "Ready to Transform Your Clinic?"
//                 )}
//               </h2>

//               <p className="text-xl md:text-2xl mb-10 text-white/90 font-light max-w-2xl mx-auto">
//                 {translate(
//                   "landingCtaBottomSubtitle",
//                   "Join hundreds of satisfied clinics using our secure, cloud-based platform."
//                 )}
//               </p>

//               <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
//                 <Link href={`/${locale}/signup`}>
//                   <Button
//                     size="lg"
//                     variant="secondary"
//                     className="h-16 text-xl px-10 rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 group font-bold text-primary"
//                   >
//                     <Stethoscope className="mr-3 w-6 h-6" />
//                     {translate("landingCtaBottomButton1", "Start Free Trial")}
//                     <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </Link>
//                 <Link href="#pricing">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="h-16 text-xl px-10 rounded-xl bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
//                   >
//                     {translate("landingCtaBottomButton2", "View Pricing")}
//                   </Button>
//                 </Link>
//               </div>

//               <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm md:text-base font-medium text-white/80">
//                 {[
//                   { icon: Calendar, text: "14-day free trial" },
//                   { icon: Shield, text: "No credit card needed" },
//                   { icon: CheckCircle2, text: "Cancel anytime" },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
//                   >
//                     <item.icon className="w-5 h-5 text-green-300" />
//                     <span>{item.text}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       <LandingFooter />
//     </div>
//   );
// }

// // Icon for step 3
// function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
//       <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
//       <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
//       <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
//     </svg>
//   );
// }
