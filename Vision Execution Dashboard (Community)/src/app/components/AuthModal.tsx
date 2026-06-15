import { useState } from "react";
import { X, Mail, Lock, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (accessToken: string, user: any) => void;
  onLogout?: () => void;
  user?: any;
  isLoading?: boolean;
}

export function AuthModal({ isOpen, onClose, onAuth, onLogout, user, isLoading }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user is already logged in, show logout option
  if (user && isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card border border-primary/30 rounded-xl max-w-md w-full shadow-2xl pointer-events-auto"
          >
            <div className="p-4 md:p-6 border-b border-primary/20 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl text-primary flex items-center gap-2">
                <User className="w-5 h-5 md:w-6 md:h-6" />
                Account
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div className="bg-secondary p-4 rounded-lg border border-primary/20">
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Signed in as</p>
                <p className="text-base md:text-lg text-primary break-all">{user.email}</p>
                {user.user_metadata?.name && (
                  <p className="text-sm text-muted-foreground mt-1">{user.user_metadata.name}</p>
                )}
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  className="w-full bg-destructive hover:bg-destructive/90 text-white gap-2 h-11 md:h-10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        const signupResponse = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-204c9f61/auth/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ email, password, name }),
          }
        );

        const signupData = await signupResponse.json();

        if (!signupResponse.ok) {
          throw new Error(signupData.error || "Failed to sign up");
        }

        // After successful signup, automatically sign in
        const signinResponse = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/auth/v1/token?grant_type=password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const signinData = await signinResponse.json();

        if (!signinResponse.ok) {
          throw new Error(signinData.error_description || "Failed to sign in after signup");
        }

        onAuth(signinData.access_token, signinData.user);
        onClose();
      } else {
        // Sign in flow
        const response = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/auth/v1/token?grant_type=password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error_description || "Failed to sign in");
        }

        onAuth(data.access_token, data.user);
        onClose();
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-primary/30 rounded-xl max-w-md w-full shadow-2xl pointer-events-auto max-h-[95vh] overflow-y-auto"
            >
              <div className="p-4 md:p-6 border-b border-primary/20 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl text-primary flex items-center gap-2">
                  {isSignUp ? (
                    <>
                      <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 md:w-6 md:h-6" />
                      Welcome Back
                    </>
                  )}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <label className="block text-sm text-muted-foreground">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="pl-10 bg-secondary border-primary/20 h-11 md:h-10"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm text-muted-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10 bg-secondary border-primary/20 h-11 md:h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-muted-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 bg-secondary border-primary/20 h-11 md:h-10"
                      required
                      minLength={6}
                    />
                  </div>
                  {isSignUp && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 md:h-10"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {isSignUp ? "Creating Account..." : "Signing In..."}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {isSignUp ? (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Create Account
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            Sign In
                          </>
                        )}
                      </span>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center pt-4 border-t border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMode}
                      className="ml-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      {isSignUp ? "Sign In" : "Sign Up"}
                    </motion.button>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}