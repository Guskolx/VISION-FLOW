import { useState } from "react";
import { Palette, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultTheme = {
  background: "#1a0f0a",
  foreground: "#f5e6d3",
  card: "#2d1810",
  primary: "#d4a574",
  secondary: "#3d2416",
  accent: "#c19a6b",
};

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const [colors, setColors] = useState(defaultTheme);

  const updateColor = (key: keyof typeof colors, value: string) => {
    setColors({ ...colors, [key]: value });
    document.documentElement.style.setProperty(`--${key}`, value);
  };

  const resetTheme = () => {
    setColors(defaultTheme);
    Object.entries(defaultTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-card border border-primary/30 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl pointer-events-auto"
            >
              <div className="sticky top-0 bg-card border-b border-primary/20 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-primary">Customize Theme</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-muted-foreground">
                  Personalize your vision board with your favorite colors
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker
                    label="Background"
                    color={colors.background}
                    onChange={(value) => updateColor("background", value)}
                  />
                  <ColorPicker
                    label="Text Color"
                    color={colors.foreground}
                    onChange={(value) => updateColor("foreground", value)}
                  />
                  <ColorPicker
                    label="Card Background"
                    color={colors.card}
                    onChange={(value) => updateColor("card", value)}
                  />
                  <ColorPicker
                    label="Primary Accent"
                    color={colors.primary}
                    onChange={(value) => updateColor("primary", value)}
                  />
                  <ColorPicker
                    label="Secondary Background"
                    color={colors.secondary}
                    onChange={(value) => updateColor("secondary", value)}
                  />
                  <ColorPicker
                    label="Accent Color"
                    color={colors.accent}
                    onChange={(value) => updateColor("accent", value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={resetTheme}
                      variant="outline"
                      className="border-primary/20 gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to Default
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={onClose}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Done
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="block text-sm text-muted-foreground">{label}</label>
      <div className="flex gap-3 items-center">
        <motion.input
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-16 rounded-lg cursor-pointer border-2 border-primary/30 bg-transparent"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-secondary border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary/60 transition-colors"
          placeholder="#000000"
        />
      </div>
    </motion.div>
  );
}
