"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Globe, Check } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from 'next-intl';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import React from "react";

export function UserNav() {
  const t = useTranslations('Header');
  const translate = (key: string, fallback: string) => t(key, { default: fallback });
  const locale = useLocale();
  const [selectedLocale, setSelectedLocale] = React.useState(locale);
  const handleLanguageChange = (newLocale: string) => {
    setSelectedLocale(newLocale);
    // Optionally, add logic to update the app's locale using next-intl router if needed
  };
  const router = useRouter();

  const user = {
    name: "Dr. John Doe", 
    email: "john.doe@smartclinic.com",
    avatarUrl: "https://placehold.co/100x100.png", 
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                            <Globe className="h-5 w-5" />
                            <span className="sr-only">{translate('changeLanguage', 'Change language')}</span>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>{translate('changeLanguage', 'Change language')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>{translate('selectLanguage', 'Select Language')}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedLocale} onValueChange={handleLanguageChange}>
            <DropdownMenuRadioItem value="en">
              {translate('English', 'English')} {selectedLocale === 'en' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ar">
              {translate('Arabic', 'العربية')} {selectedLocale === 'ar' && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar" />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{translate('userAccount', 'User Account')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>{translate('profile', 'Profile')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>{translate('settings', 'Settings')}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout" className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{translate('logout', 'Log out')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
