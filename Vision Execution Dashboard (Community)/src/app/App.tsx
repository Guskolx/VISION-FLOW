import { useState, useEffect } from "react";
import { Sparkles, Plus, Palette, MessageSquare, LogIn, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { GoalCard } from "./components/GoalCard";
import { GoalModal } from "./components/GoalModal";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { SuggestionBox } from "./components/SuggestionBox";
import { AuthModal } from "./components/AuthModal";
import type { Goal } from "./types";
import { Button } from "./components/ui/button";

const STORAGE_KEY = "vision-board-goals";
const THEME_STORAGE_KEY = "vision-board-theme";

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const savedToken = localStorage.getItem("access_token");
      const savedUser = localStorage.getItem("user_data");

      if (savedToken && savedUser) {
        setAccessToken(savedToken);
        setUser(JSON.parse(savedUser));
        await loadUserData(savedToken);
      } else {
        // Load from localStorage if not authenticated
        loadLocalData();
      }
    };

    checkSession();
  }, []);

  // Load data from localStorage
  const loadLocalData = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load goals:", e);
      }
    }
  };

  // Load user data from server
  const loadUserData = async (token: string) => {
    setIsLoadingData(true);
    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-204c9f61/goals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);
      } else {
        console.error("Failed to load user goals");
        loadLocalData();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      loadLocalData();
    } finally {
      setIsLoadingData(false);
    }
  };

  // Save goals to server or localStorage
  const saveGoals = async (updatedGoals: Goal[]) => {
    if (accessToken) {
      try {
        const response = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-204c9f61/goals`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ goals: updatedGoals }),
          }
        );

        if (!response.ok) {
          console.error("Failed to save goals to server");
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
        }
      } catch (error) {
        console.error("Error saving goals:", error);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
    }
  };

  // Save goals whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      saveGoals(goals);
    }
  }, [goals]);

  const handleAuth = (token: string, userData: any) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_data", JSON.stringify(userData));
    loadUserData(token);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    setGoals([]);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_data");
    loadLocalData();
  };

  const handleOpenGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedGoal(null);
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };

  const handleSaveGoal = (goal: Goal) => {
    if (isCreatingNew) {
      setGoals([...goals, goal]);
    } else {
      setGoals(goals.map((g) => (g.id === goal.id ? goal : g)));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGoal(null);
    setIsCreatingNew(false);
  };

  // Create array with at least 9 slots, but allow for more goals
  const minSlots = 9;
  const totalSlots = Math.max(minSlots, goals.length + 1); // Always show one empty slot
  const gridSlots = Array.from({ length: totalSlots }, (_, i) => goals[i]);

  return (
    <div className="min-h-screen bg-background py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl text-primary">Vision Board</h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-base md:text-lg px-4"
          >
            Transform your dreams into achievable goals
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsThemeOpen(true)}
              variant="outline"
              className="border-primary/30 hover:border-primary/60 gap-2 text-sm md:text-base h-9 md:h-10 px-3 md:px-4"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Customize Theme</span>
              <span className="sm:hidden">Theme</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsSuggestionOpen(true)}
              variant="outline"
              className="border-primary/30 hover:border-primary/60 gap-2 text-sm md:text-base h-9 md:h-10 px-3 md:px-4"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Send Suggestion</span>
              <span className="sm:hidden">Feedback</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                if (accessToken) {
                  setIsAuthOpen(true);
                } else {
                  setIsAuthOpen(true);
                }
              }}
              variant="outline"
              className="border-primary/30 hover:border-primary/60 gap-2 text-sm md:text-base h-9 md:h-10 px-3 md:px-4"
            >
              {accessToken ? (
                <>
                  <User className="w-4 h-4" />
                  Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
          {gridSlots.map((goal, index) => (
            <GoalCard
              key={goal?.id || `empty-${index}`}
              goal={goal}
              index={index}
              onClick={() => (goal ? handleOpenGoal(goal) : handleCreateNew())}
            />
          ))}
        </div>

        {/* Stats */}
        {goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 md:mt-16 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-card border border-primary/20 rounded-lg p-4 md:p-6 text-center shadow-lg hover:shadow-primary/20"
              >
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                  className="text-2xl md:text-3xl text-primary mb-1 md:mb-2"
                >
                  {goals.length}
                </motion.p>
                <p className="text-muted-foreground text-sm md:text-base">Active Goals</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-card border border-primary/20 rounded-lg p-4 md:p-6 text-center shadow-lg hover:shadow-primary/20"
              >
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                  className="text-2xl md:text-3xl text-primary mb-1 md:mb-2"
                >
                  {Math.round(
                    goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
                  )}
                  %
                </motion.p>
                <p className="text-muted-foreground text-sm md:text-base">Average Progress</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-card border border-primary/20 rounded-lg p-4 md:p-6 text-center shadow-lg hover:shadow-primary/20"
              >
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
                  className="text-2xl md:text-3xl text-primary mb-1 md:mb-2"
                >
                  {goals.reduce(
                    (sum, g) => sum + g.milestones.filter((m) => m.completed).length,
                    0
                  )}
                </motion.p>
                <p className="text-muted-foreground text-sm md:text-base">Milestones Completed</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <GoalModal
        goal={selectedGoal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
      />
      <ThemeCustomizer isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      <SuggestionBox isOpen={isSuggestionOpen} onClose={() => setIsSuggestionOpen(false)} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuth={handleAuth}
        onLogout={handleLogout}
        user={user}
        isLoading={isLoadingData}
      />
    </div>
  );
}

export default App;