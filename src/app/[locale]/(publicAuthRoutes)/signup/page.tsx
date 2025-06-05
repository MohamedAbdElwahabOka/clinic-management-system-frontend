
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField, // Import useFormField
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useRouter, Link } from "@/i18n/navigation";
import { UserPlus, HeartPulse, User, CalendarDays, Stethoscope, Fingerprint, Phone, Users as GenderIcon, Lock, Mail } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { Locale } from "@/types";
import { Trans } from "@/components/trans";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from 'date-fns/locale/ar-SA';


interface SignupPageProps {
  params: { locale: Locale };
}

// Helper component to apply conditional styling for Input
const ValidatedInput: React.FC<React.ComponentProps<typeof Input>> = (props) => {
  const { error, isDirty, isTouched } = useFormField();
  return (
    <Input
      {...props}
      className={cn(
        props.className,
        (isDirty || isTouched) && error && "border-destructive focus-visible:ring-destructive",
        (isDirty || isTouched) && !error && "border-green-500 focus-visible:ring-green-500"
      )}
    />
  );
};

// Helper component to apply conditional styling for SelectTrigger
const ValidatedSelectTrigger: React.FC<React.ComponentProps<typeof SelectTrigger>> = (props) => {
  const { error, isDirty, isTouched } = useFormField();
  return (
    <SelectTrigger
      {...props}
      className={cn(
        props.className,
        (isDirty || isTouched) && error && "border-destructive focus-visible:ring-destructive",
        (isDirty || isTouched) && !error && "border-green-500 focus-visible:ring-green-500"
      )}
    />
  );
};

// Helper component to apply conditional styling for PopoverTrigger (Button)
const ValidatedPopoverTriggerButton: React.FC<React.ComponentProps<typeof Button>> = (props) => {
  const { error, isDirty, isTouched } = useFormField();
  return (
    <Button
      {...props}
      className={cn(
        props.className,
        (isDirty || isTouched) && error && "border-destructive focus-visible:ring-destructive",
        (isDirty || isTouched) && !error && "border-green-500 focus-visible:ring-green-500"
      )}
    />
  );
};


export default function SignupPage({ params }: SignupPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { translate, locale, direction } = useLanguage(); 
  const [isLoading, setIsLoading] = React.useState(false);

  const genderOptions = [
    { value: "Male", labelKey: "genderMale", default: "Male" },
    { value: "Female", labelKey: "genderFemale", default: "Female" },
    { value: "Other", labelKey: "genderOther", default: "Other" },
  ];

  const specialtyOptions = [
    { value: "Cardiology", labelKey: "specialtyCardiology", default: "Cardiology" },
    { value: "Dermatology", labelKey: "specialtyDermatology", default: "Dermatology" },
    { value: "Pediatrics", labelKey: "specialtyPediatrics", default: "Pediatrics" },
    { value: "Neurology", labelKey: "specialtyNeurology", default: "Neurology" },
    { value: "General", labelKey: "specialtyGeneral", default: "General Practice" },
    { value: "Empty", labelKey: "specialtyEmpty", default: "Empty" },
  ];


  const getSignupFormSchema = () => z.object({
    firstName: z.string().min(2, translate('errorFirstNameMin')),
    lastName: z.string().min(2, translate('errorLastNameMin')),
    dateOfBirth: z.date({ required_error: translate('requiredField', "{{field}} is required.", { field: translate('dateOfBirth')}) }),
    specialty: z.string({ required_error: translate('requiredField', "{{field}} is required.", { field: translate('specialty')}) }),
    nationalId: z.string()
      .min(1, translate('errorNationalIdRequired'))
      .length(14, translate('errorNationalIdDigits'))
      .regex(/^[0-9]+$/, translate('errorNationalIdNumbersOnly')),
    phoneNumber: z.string().min(1, translate('errorPhoneNumberRequired')).min(10, translate('errorPhoneMin')).regex(/^\S+$/, translate('errorPhoneNoSpaces')),
    gender: z.enum(["Male", "Female", "Other"], { required_error: translate('requiredField', "{{field}} is required.", { field: translate('gender')}) }),
    email: z.string().email(translate('errorEmailInvalid')).min(1, translate('errorEmailRequired')),
    password: z.string().min(6, translate('errorPasswordMin')),
    confirmPassword: z.string().min(6, translate('errorConfirmPasswordMin')),
    agreeTerms: z.boolean().refine(value => value === true, { message: translate('errorTermsRequired') }),
    subscribeNewsletter: z.boolean().optional(),
  }).refine(data => data.password === data.confirmPassword, {
    message: translate('errorPasswordsNoMatch'),
    path: ["confirmPassword"],
  });

  type SignupFormValues = z.infer<ReturnType<typeof getSignupFormSchema>>;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(getSignupFormSchema()),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      specialty: undefined,
      nationalId: "",
      phoneNumber: "",
      gender: undefined,
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
      subscribeNewsletter: false,
    },
    mode: 'onTouched', // Or 'onChange' for more immediate feedback
  });

  React.useEffect(() => {
    // Re-initialize form or specific fields if locale changes affecting validation messages
    const currentValues = form.getValues();
    form.reset(currentValues, {
      keepValues: true,
      keepDirty: form.formState.isDirty,
      keepErrors: true, // Keep existing errors but they might be re-evaluated with new messages
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, translate]); // form is not added to avoid re-creating it unnecessarily

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Attempting to sign up with data:", data);

    toast({
      title: translate('accountCreatedSuccessToast'),
      description: translate('accountCreatedSuccessDesc'),
    });
    router.push("/login");

    setIsLoading(false);
  }

  return (
    <div className="w-full">
       <div className="flex flex-col items-center mb-6 text-center">
        <Link href="/" className="flex items-center gap-2 text-primary mb-4">
          <HeartPulse className="h-10 w-10" />
          <h1 className="text-3xl font-bold">
            {translate('clinicaName', 'Clinica')}
          </h1>
        </Link>
        <h2 className="text-2xl font-semibold text-foreground">
          {translate('authSignupTitle', 'Create Your Account')}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {translate('authSignupSubtitle1', 'Start and manage all your clinic affairs with ease now!')} <br/>
          {translate('authSignupSubtitle2', "Let's start by registering all your data, then you can start managing your clinic.")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('firstName')}</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <ValidatedInput placeholder={translate('firstNamePlaceholder')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('lastName')}</FormLabel>
                   <div className="relative">
                    <User className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <ValidatedInput placeholder={translate('lastNamePlaceholder')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{translate('dateOfBirth')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <ValidatedPopoverTriggerButton
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 pl-3 text-left font-normal justify-start",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarDays className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 opacity-50" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: locale === 'ar' ? arSA : undefined })
                          ) : (
                            <span>{translate('pickDate')}</span>
                          )}
                        </ValidatedPopoverTriggerButton>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        locale={locale === 'ar' ? arSA : undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('specialty')}</FormLabel>
                  <div className="relative">
                     <Stethoscope className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading} dir={direction}>
                      <FormControl>
                        <ValidatedSelectTrigger className="h-12 pl-10 rtl:pr-10">
                          <SelectValue placeholder={translate('specialtyPlaceholder')} />
                        </ValidatedSelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialtyOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{translate(opt.labelKey, opt.default)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('nationalId')}</FormLabel>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <ValidatedInput placeholder={translate('nationalIdPlaceholder')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('phoneNumber')}</FormLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <ValidatedInput type="tel" placeholder={translate('phoneNumberPlaceholder')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('gender')}</FormLabel>
                   <div className="relative">
                    <GenderIcon className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading} dir={direction}>
                      <FormControl>
                        <ValidatedSelectTrigger className="h-12 pl-10 rtl:pr-10">
                          <SelectValue placeholder={translate('genderPlaceholder')} />
                        </ValidatedSelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {genderOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{translate(opt.labelKey, opt.default)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translate('email')}</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <ValidatedInput type="email" placeholder={translate('authEmailPlaceholder', 'Email account')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translate('password')}</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <ValidatedInput type="password" placeholder={translate('authPasswordPlaceholder', 'Password')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translate('confirmPassword')}</FormLabel>
                 <div className="relative">
                  <Lock className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <ValidatedInput type="password" placeholder={translate('authConfirmPasswordPlaceholder', 'Confirm Password')} {...field} disabled={isLoading} className="h-12 pl-10 rtl:pr-10"/>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agreeTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 rtl:space-x-reverse space-y-0 rounded-md py-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    aria-labelledby="agree-terms-label"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel id="agree-terms-label" className="text-sm font-normal text-muted-foreground">
                    <Trans k="agreeToTerms"
                          components={{
                            C1: <Link href="/terms" className="underline hover:text-primary" />,
                            C2: <Link href="/privacy" className="underline hover:text-primary" />
                          }}
                    />
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscribeNewsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 rtl:space-x-reverse space-y-0 rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    aria-labelledby="subscribe-newsletter-label"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel id="subscribe-newsletter-label" className="text-sm font-normal text-muted-foreground">
                    {translate('subscribeToNewsletter')}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 text-base mt-6" disabled={isLoading}>
            {isLoading ? translate('creatingAccount') : <> <UserPlus className="mr-2 rtl:ml-2 rtl:mr-0 h-5 w-5" /> {translate('createAccountButton')} </>}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-sm">
        {translate('alreadyHaveAccount')}{" "}
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href="/login">{translate('logInLink')}</Link>
        </Button>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {translate('smartClinicPro', 'SmartClinic Pro')}. {translate('allRightsReserved', 'All rights reserved.')}
      </p>
    </div>
  );
}

    