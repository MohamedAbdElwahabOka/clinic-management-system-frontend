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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter, Link } from "@/i18n/navigation";
import {
  LogIn,
  HeartPulse,
  Apple,
  Facebook,
  Twitter as XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/types";
import { signIn, getSession } from "next-auth/react"; // ضفنا getSession

interface LoginPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function LoginPage({ params: paramsPromise }: LoginPageProps) {
  const params = React.use(paramsPromise);
  const locale = params?.locale || "en" || "de";

  const t = useTranslations("Auth");
  const tHeader = useTranslations("Header");
  const tLanding = useTranslations("Landing");
  const [isLoading, setIsLoading] = React.useState(false);
  const translate = React.useCallback(
    (key: string, defaultValue?: string) => {
      const translation = t(key);
      return translation === key && defaultValue ? defaultValue : translation;
    },
    [t],
  );

  const translateHeader = React.useCallback(
    (key: string, defaultValue?: string) => {
      const translation = tHeader(key);
      return translation === key && defaultValue ? defaultValue : translation;
    },
    [tHeader],
  );
  const translateLanding = React.useCallback(
    (key: string, defaultValue?: string) => {
      const translation = tLanding(key);
      return translation === key && defaultValue ? defaultValue : translation;
    },
    [tLanding],
  );

  const router = useRouter();
  const { toast } = useToast();

  const getLoginFormSchema = () =>
    z.object({
      identifier: z.string().min(1, translate("errorEmailRequired")), // Using generic error or new one
      password: z.string().min(1, translate("errorPasswordRequired")),
    });

  type LoginFormValues = z.infer<ReturnType<typeof getLoginFormSchema>>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginFormSchema()),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  React.useEffect(() => {
    form.reset(undefined, { keepValues: false });
  }, [locale, form, translate]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      // 1. محاولة تسجيل الدخول
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        setIsLoading(false);
        toast({
          title: translate("loginFailedToast"),
          description: translate("errorInvalidCredentials"),
          variant: "destructive",
        });
      } else {
        // 2. Login successful, fetch session to determine role
        const session = await getSession();

        toast({
          title: translate("loginSuccessToast"),
          description: translate("loginSuccessDesc"),
        });

        // Refresh router to ensure auth state is up to date
        router.refresh();

        // 3. Redirect based on role
        // Backend returns "DOCTOR" or "ASSISTANT"
        if (
          session?.user?.role === "ASSISTANT" ||
          session?.user?.role === "reception"
        ) {
          router.push("/reception/appointments");
        } else {
          // For doctors, admins, or other roles, redirect to dashboard
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
    // ملحوظة: شيلنا setIsLoading(false) من حالة النجاح عشان ميرجعش الزرار يظهر قبل ما الصفحة تقلب
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-6 text-center">
        <Link href="/" className="flex items-center gap-2 text-primary mb-4">
          <HeartPulse className="h-10 w-10" />
          <h1 className="text-3xl font-bold">
            {translateHeader("name", "Clinica")}
          </h1>
        </Link>
        <h2 className="text-2xl font-semibold text-foreground">
          {translate("authHelloWelcomeToClinica", "Hello! Welcome to Clinica")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {translate(
            "authSmartManagementCare",
            "Smart management, exceptional care.",
          )}
        </p>
        <p> use 01064425532@assistant.clinica (01064425532) or phone </p>
        <p> use moham88@clinic.com "password in postman" or phone </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={translate(
                      "authEmailPlaceholder",
                      "Email or Phone Number",
                    )}
                    {...field}
                    disabled={isLoading}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={translate(
                      "authPasswordPlaceholder",
                      "Password",
                    )}
                    {...field}
                    disabled={isLoading}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button variant="link" asChild className="p-0 h-auto text-sm">
              <Link href="#">
                {translate("authForgotPasswordLink", "Forgot Your Password?")}
              </Link>
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              translate("loggingIn")
            ) : (
              <>
                {" "}
                <LogIn className="mr-2 h-5 w-5" />{" "}
                {translate("loginButton")}{" "}
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        {/* {translate('authAgreementLogin', 'By continuing, you agree to our {terms} and {privacy}', {
          terms: <Link href="/terms" className="underline hover:text-primary" />,
          privacy: <Link href="/privacy" className="underline hover:text-primary" />
        })} */}
      </p>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-muted"></div>
        <span className="mx-4 text-xs text-muted-foreground uppercase">
          {translate("authOr", "OR")}
        </span>
        <div className="flex-grow border-t border-muted"></div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          className="w-full h-12 aspect-square p-0"
          title={translate("authLoginWithApple", "Log in with Apple")}
          disabled
        >
          <Apple className="h-5 w-5" />{" "}
          <span className="sr-only">{translate("authApple", "Apple")}</span>
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 aspect-square p-0"
          title={translate("authLoginWithX", "Log in with X")}
          disabled
        >
          <XIcon className="h-5 w-5" />{" "}
          <span className="sr-only">{translate("authX", "X")}</span>
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 aspect-square p-0"
          title={translate("authLoginWithFacebook", "Log in with Facebook")}
          disabled
        >
          <Facebook className="h-5 w-5" />{" "}
          <span className="sr-only">
            {translate("authFacebook", "Facebook")}
          </span>
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 aspect-square p-0"
          title={translate("authLoginWithGoogle", "Log in with Google")}
          disabled
        >
          <svg
            className="h-5 w-5"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Google</title>
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.34 2.08-4.36 2.08-5.17 0-9.42-4.22-9.42-9.42s4.25-9.42 9.42-9.42c2.61 0 4.88 1.01 6.4 2.52l2.58-2.58C19.16 1.18 16.14 0 12.48 0 5.81 0 0 5.81 0 12.48s5.81 12.48 12.48 12.48c3.58 0 6.27-1.21 8.31-3.43 2.19-2.38 2.93-5.75 2.93-9.13A12.86 12.86 0 0012.48 10.92z"
              fill="currentColor"
            />
          </svg>
          <span className="sr-only">{translate("authGoogle", "Google")}</span>
        </Button>
      </div>

      <p className="mt-8 text-center text-sm">
        {translate("dontHaveAccount")}{" "}
        <Button variant="link" asChild className="p-0 h-auto">
          <Link href="/signup">{translate("signUpLink")}</Link>
        </Button>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {translateHeader("name", "Clinica")}.{" "}
        {translateLanding("allRightsReserved", "All rights reserved.")}
      </p>
    </div>
  );
}
