import { useState } from "react";
import { Send, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface SuggestionBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuggestionBox({ isOpen, onClose }: SuggestionBoxProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (suggestion.trim()) {
      // Create mailto link with the suggestion
      const subject = encodeURIComponent("Vision Board Suggestion");
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nSuggestion:\n${suggestion}`
      );
      window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setSuggestion("");
        onClose();
      }, 2000);
    }
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
              className="bg-card border border-primary/30 rounded-xl max-w-2xl w-full shadow-2xl pointer-events-auto"
            >
              <div className="sticky top-0 bg-card border-b border-primary/20 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl text-primary">Send Suggestion</h2>
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
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <Send className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h3 className="text-2xl text-primary mb-2">Thank You!</h3>
                      <p className="text-muted-foreground">
                        Your suggestion has been sent.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-muted-foreground">
                        We'd love to hear your ideas and feedback!
                      </p>

                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">
                          Your Name (Optional)
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-secondary border-primary/20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">
                          Email (Optional)
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="bg-secondary border-primary/20"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">
                          Your Suggestion *
                        </label>
                        <Textarea
                          value={suggestion}
                          onChange={(e) => setSuggestion(e.target.value)}
                          placeholder="I would love to see..."
                          className="bg-secondary border-primary/20 min-h-[150px]"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={handleSubmit}
                            disabled={!suggestion.trim()}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Send Suggestion
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={onClose}
                            variant="outline"
                            className="border-primary/20"
                          >
                            Cancel
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
