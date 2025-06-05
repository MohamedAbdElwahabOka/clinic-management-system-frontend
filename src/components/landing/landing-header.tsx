
"use client";

import * as React from 'react';
import { Link } from '@/i18n/navigation';
import {  Menu, HeartPulse, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import LocalSwitcher from '../local-switcher';

interface NavLinkDef {
  href: string; 
  labelKey: string;
  defaultLabel: string;
}

export function LandingHeader() {
   const [darkMode, setDarkMode] = React.useState(false);
  const t= useTranslations("Landing");
  const tHeader = useTranslations("Header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
   // Helper translate function
  const translate = (key: string, defaultValue: string) => {
    const translation = t(key);
    // If the translation is the same as the key, use the default value
    return translation === key ? defaultValue : translation;
  };
  const translateHeader = (key: string, defaultValue: string) => {
    const translation = tHeader(key);
    // If the translation is the same as the key, use the default value
    return translation === key ? defaultValue : translation;
  };
 React.useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };
  const navLinks: NavLinkDef[] = [
    { href: '#financial-features', labelKey: 'landingHeaderNavFeatures', defaultLabel: 'Features' },
    { href: '#testimonials', labelKey: 'landingHeaderNavTestimonials', defaultLabel: 'Testimonials' },
    { href: '#cta', labelKey: 'landingHeaderNavPricing', defaultLabel: 'Pricing' }, 
    { href: '#footer-contact', labelKey: 'landingHeaderNavContact', defaultLabel: 'Contact Us' },
  ];

  const NavItems = ({ inSheet = false }: { inSheet?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Button
          key={link.labelKey}
          variant="ghost"
          asChild
          className={`text-sm font-medium ${inSheet ? 'w-full justify-start text-foreground hover:bg-accent/80' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => inSheet && setIsMobileMenuOpen(false)}
        >
          <Link href={link.href}>
            {translate(link.labelKey, link.defaultLabel)}
          </Link>
        </Button>
      ))}
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          href="/" 
          className="flex items-center gap-2" 
          aria-label={translateHeader('name', 'Clinica Home')}
          data-test-id="landing-header-logo-link"
        >
          <HeartPulse className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold text-primary">
            {translateHeader('name', 'Clinica')}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItems />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild data-test-id="landing-login-button">
              <Link href="/login">{translate('landingHeaderLogin', 'Login')}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{translate('landingHeaderSignUp', 'Sign Up')}</Link>
            </Button>
          </div>
          <div className="flex items-center space-x-3">
        <div className='p-2'>
          <LocalSwitcher />
        </div>

        <div className="relative border border-blue-500 p-1.5 rounded-full">
          <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300 cursor-pointer" />
          <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
        </div>

        <button onClick={toggleDarkMode} className="flex items-center justify-center rounded-full border border-blue-500 p-1.5">
          {darkMode ? <Moon className="h-5 w-5 text-gray-300" /> : <Sun className="h-5 w-5 text-yellow-400" />}
        </button>
      </div>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{translateHeader('toggleNavigation', 'Toggle navigation')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="p-6">
                   <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                    <HeartPulse className="h-7 w-7 text-primary" />
                    <span className="text-xl font-semibold text-primary">
                        {translateHeader('name', 'Clinica')}
                    </span>
                  </Link>
                  <div className="flex flex-col gap-2">
                    <NavItems inSheet={true} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                            <Link href="/login">{translate('landingHeaderLogin', 'Login')}</Link>
                        </Button>
                        <Button asChild className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                            <Link href="/signup">{translate('landingHeaderSignUp', 'Sign Up')}</Link>
                        </Button>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
