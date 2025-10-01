import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  emailOrMobile: z.string().min(1, "Email or mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = signupSchema.parse({ name, email, mobile, password });
      
      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            name: validatedData.name,
            mobile: validatedData.mobile,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success("Account created successfully! Please log in.");
      setIsLogin(true);
      // Clear form
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = loginSchema.parse({ emailOrMobile, password });
      
      // Check if input is email or mobile
      const isEmail = validatedData.emailOrMobile.includes("@");
      
      const { error } = await supabase.auth.signInWithPassword({
        email: isEmail ? validatedData.emailOrMobile : `${validatedData.emailOrMobile}@temp.com`,
        password: validatedData.password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error(error.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary px-4">
      <Card className="w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-nonveg bg-clip-text text-transparent">
            Surya Authentic Spices
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="emailOrMobile">Email or Mobile Number</Label>
              <Input
                id="emailOrMobile"
                type="text"
                value={emailOrMobile}
                onChange={(e) => setEmailOrMobile(e.target.value)}
                placeholder="Enter email or mobile"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                required
              />
            </div>
            <div>
              <Label htmlFor="signupPassword">Password</Label>
              <Input
                id="signupPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
