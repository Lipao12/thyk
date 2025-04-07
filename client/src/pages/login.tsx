import { Moon, SunDim } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaGoogle } from "react-icons/fa";
import { useLocation } from "wouter";
import { ThykLogo, ThykMascot } from "../components/thyk-logo";
import { Button } from "../components/ui/button";
import { ButtonLocale } from "../components/ui/button-locale";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useTheme } from "../context/theme-provider";
import { useToast } from "../hooks/use-toast";
import { handleRedirect } from "../lib/handleRedirect";
import { googleLogin } from "../lib/sign-in";

export default function Login() {
  //const [isLoginLoading, setIsLoginLoading] = useState(false);
  //const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { t, i18n } = useTranslation("login");
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };

  /*const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Store user info in localStorage
      localStorage.setItem(
        "thyk_user",
        JSON.stringify({
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
          isLoggedIn: true,
        })
      );

      setIsLoginLoading(false);
      setLocation("/");
    }, 1500);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      // Store user info in localStorage
      localStorage.setItem(
        "thyk_user",
        JSON.stringify({
          id: 1,
          name: "Demo User",
          email: "demo@example.com",
          isLoggedIn: true,
        })
      );

      setIsRegisterLoading(false);
      setLocation("/");
    }, 1500);
  };*/

  const { toast } = useToast();

  // Handle Firebase redirect result
  useEffect(() => {
    async function checkRedirectResult() {
      try {
        const user = await handleRedirect();
        if (user) {
          toast({
            title: "Login successful",
            description: `Welcome, ${user.displayName || "User"}!`,
          });
          setLocation("/");
        }
      } catch (error) {
        console.error("Error handling redirect:", error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "There was a problem logging in. Please try again.",
        });
      }
    }

    checkRedirectResult();
  }, [setLocation, toast]);

  const handleGoogleLogin = async () => {
    try {
      // Try to use Firebase login if configured
      await googleLogin();
      // If using mock authentication (localStorage fallback), we'll be redirected immediately
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "Authentication error",
        description:
          "There was a problem logging in with Google. Please try again.",
      });
    }
  };

  /*const handleGithubLogin = () => {
    // In a real app, this would redirect to GitHub OAuth
    // For demo, we'll just simulate a login
    localStorage.setItem(
      "thyk_user",
      JSON.stringify({
        id: 1,
        name: "GitHub User",
        email: "github@example.com",
        isLoggedIn: true,
        provider: "github",
      })
    );

    setLocation("/");
  };*/

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <ThykLogo size="large" withText={true} />
          </div>

          <div className="flex flex-row justify-center gap-6">
            <div className="relative">
              <ButtonLocale toggleLanguage={toggleLanguage} />
            </div>

            <div className="flex items-center ml-1">
              <div className="flex items-center space-x-1">
                <Switch
                  id="darkModeToggle"
                  checked={theme === "dark"}
                  onCheckedChange={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                />
                <Label
                  htmlFor="darkModeToggle"
                  className="hidden sm:inline text-sm"
                >
                  {theme === "dark" ? <SunDim /> : <Moon />}
                </Label>
              </div>
            </div>
          </div>

          {/*<Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab 
            <TabsContent value="login">
              <div className="space-y-6">
                <div className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="px-0 text-xs">
                          Forgot Password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-300 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogleLogin}
                    >
                      <FaGoogle className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGithubLogin}
                    >
                      <FaGithub className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Register Tab 
            <TabsContent value="register">
              <div className="space-y-6">
                <div className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        Confirm Password
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isRegisterLoading}
                    >
                      {isRegisterLoading
                        ? "Creating account..."
                        : "Create Account"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-300 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                        or register with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogleLogin}
                    >
                      <FaGoogle className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGithubLogin}
                    >
                      <FaGithub className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>*/}
          <div className="relative mb-5">
            <div className="relative flex justify-center text-xs">
              <h3 className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                {t("head")}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" type="button" onClick={handleGoogleLogin}>
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Marketing Copy with Mascot */}
      <div className="w-full lg:w-1/2 bg-primary/10 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-lg">
          <div className="flex justify-center mb-6">
            <ThykMascot className="w-48 h-48" />
          </div>

          <h1 className="text-4xl font-bold mb-4 text-primary">
            {t("welcome")}
          </h1>

          <p className="text-lg mb-6 text-slate-700 dark:text-slate-300">
            {t("copy")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-accent">{t("daily")}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("daily_copy")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-secondary">
                {t("weekly")}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("weekly_copy")}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2 text-primary">{t("monthy")}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("monthy_copy")}
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("copy_2")}
            <br />
            {t("call")}
          </p>
        </div>
      </div>
    </div>
  );
}
