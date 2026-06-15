import { useState, useRef } from "react";
import { X, Upload, Calendar, TrendingUp, CheckSquare, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Goal } from "../types";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageAdjuster } from "./ImageAdjuster";

interface GoalModalProps {
  goal: Goal | null;
  onClose: () => void;
  onSave: (goal: Goal) => void;
  isOpen: boolean;
}

export function GoalModal({ goal, onClose, onSave, isOpen }: GoalModalProps) {
  const [editedGoal, setEditedGoal] = useState<Goal>(
    goal || {
      id: Date.now().toString(),
      title: "",
      description: "",
      imageUrl: "",
      progress: 0,
      targetDate: "",
      milestones: [],
      progressHistory: [],
    }
  );
  const [isAdjustingImage, setIsAdjustingImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setIsAdjustingImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageAdjusted = (adjustedImageUrl: string) => {
    setEditedGoal({ ...editedGoal, imageUrl: adjustedImageUrl });
    setIsAdjustingImage(false);
    setTempImageUrl("");
  };

  const handleImageAdjustCancel = () => {
    setIsAdjustingImage(false);
    setTempImageUrl("");
  };

  const handleSave = () => {
    if (editedGoal.title) {
      onSave(editedGoal);
      onClose();
    }
  };

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      title: "New milestone",
      completed: false,
    };
    setEditedGoal({
      ...editedGoal,
      milestones: [...editedGoal.milestones, newMilestone],
    });
  };

  const toggleMilestone = (id: string) => {
    setEditedGoal({
      ...editedGoal,
      milestones: editedGoal.milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    });
  };

  const updateMilestoneTitle = (id: string, title: string) => {
    setEditedGoal({
      ...editedGoal,
      milestones: editedGoal.milestones.map((m) =>
        m.id === id ? { ...m, title } : m
      ),
    });
  };

  const deleteMilestone = (id: string) => {
    setEditedGoal({
      ...editedGoal,
      milestones: editedGoal.milestones.filter((m) => m.id !== id),
    });
  };

  const logProgress = () => {
    const newEntry = {
      date: new Date().toLocaleDateString(),
      value: editedGoal.progress,
    };
    setEditedGoal({
      ...editedGoal,
      progressHistory: [...editedGoal.progressHistory, newEntry],
    });
  };

  const daysRemaining = editedGoal.targetDate
    ? Math.ceil(
        (new Date(editedGoal.targetDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 md:p-4 overflow-y-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-card border border-primary/30 rounded-xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl pointer-events-auto my-2 md:my-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-primary/20 p-4 md:p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl text-primary flex items-center gap-2">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                    {goal ? "Edit Goal" : "Create New Goal"}
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
              </div>

              <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Image Upload Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <label className="block text-sm text-muted-foreground">Goal Image</label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video bg-secondary border-2 border-dashed border-primary/30 rounded-lg overflow-hidden cursor-pointer hover:border-primary/60 transition-all group relative"
                  >
                    <AnimatePresence mode="wait">
                      {editedGoal.imageUrl ? (
                        <motion.img
                          key="image"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          src={editedGoal.imageUrl}
                          alt="Goal"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-full"
                        >
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Upload className="w-12 h-12 text-primary/50 group-hover:text-primary transition-colors" />
                          </motion.div>
                          <p className="mt-2 text-muted-foreground group-hover:text-foreground transition-colors">
                            Click to upload image
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.div>

                {/* Basic Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Goal Title
                    </label>
                    <Input
                      value={editedGoal.title}
                      onChange={(e) =>
                        setEditedGoal({ ...editedGoal, title: e.target.value })
                      }
                      placeholder="e.g., Buy My Dream Home"
                      className="bg-secondary border-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Description
                    </label>
                    <Textarea
                      value={editedGoal.description}
                      onChange={(e) =>
                        setEditedGoal({ ...editedGoal, description: e.target.value })
                      }
                      placeholder="Describe your goal in detail..."
                      className="bg-secondary border-primary/20 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Target Date
                    </label>
                    <Input
                      type="date"
                      value={editedGoal.targetDate}
                      onChange={(e) =>
                        setEditedGoal({ ...editedGoal, targetDate: e.target.value })
                      }
                      className="bg-secondary border-primary/20"
                    />
                  </div>
                </motion.div>

                {/* Analytics Tabs */}
                {goal && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                      <TabsList className="bg-secondary border border-primary/20">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <Target className="w-4 h-4 mr-2" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger value="milestones" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <CheckSquare className="w-4 h-4 mr-2" />
                          Milestones
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Analytics
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6 mt-6">
                        <div className="bg-secondary p-6 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-primary" />
                            <h3 className="text-lg">Progress Tracking</h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-muted-foreground">
                                  Current Progress
                                </span>
                                <span className="text-primary">{editedGoal.progress}%</span>
                              </div>
                              <Progress value={editedGoal.progress} className="h-3" />
                            </div>
                            <div className="flex gap-4">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={editedGoal.progress}
                                onChange={(e) =>
                                  setEditedGoal({
                                    ...editedGoal,
                                    progress: Number(e.target.value),
                                  })
                                }
                                className="bg-card border-primary/20"
                              />
                              <Button onClick={logProgress} variant="outline" className="border-primary/20">
                                Log Progress
                              </Button>
                            </div>
                          </div>
                        </div>

                        {daysRemaining !== null && (
                          <div className="bg-secondary p-6 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-5 h-5 text-primary" />
                              <h3 className="text-lg">Time Remaining</h3>
                            </div>
                            <p className="text-3xl text-primary">
                              {daysRemaining > 0
                                ? `${daysRemaining} days`
                                : daysRemaining === 0
                                ? "Today!"
                                : `${Math.abs(daysRemaining)} days overdue`}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Until {new Date(editedGoal.targetDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="milestones" className="mt-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-secondary p-6 rounded-lg border border-primary/20"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg">Action Steps</h3>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button onClick={addMilestone} size="sm" className="bg-primary hover:bg-primary/90">
                                Add Milestone
                              </Button>
                            </motion.div>
                          </div>
                          <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                              {editedGoal.milestones.length === 0 ? (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="text-muted-foreground text-center py-8"
                                >
                                  No milestones yet. Add your first one!
                                </motion.p>
                              ) : (
                                editedGoal.milestones.map((milestone, idx) => (
                                  <motion.div
                                    key={milestone.id}
                                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-3 bg-card p-3 rounded-lg border border-primary/20"
                                  >
                                    <motion.input
                                      whileTap={{ scale: 0.9 }}
                                      type="checkbox"
                                      checked={milestone.completed}
                                      onChange={() => toggleMilestone(milestone.id)}
                                      className="w-5 h-5 rounded border-primary/30 text-primary focus:ring-primary cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={milestone.title}
                                      onChange={(e) =>
                                        updateMilestoneTitle(milestone.id, e.target.value)
                                      }
                                      className={`flex-1 bg-transparent border-none focus:outline-none transition-all duration-300 ${
                                        milestone.completed
                                          ? "line-through text-muted-foreground"
                                          : ""
                                      }`}
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.2, rotate: 90 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => deleteMilestone(milestone.id)}
                                      className="text-destructive hover:text-destructive/80 p-1"
                                    >
                                      <X className="w-4 h-4" />
                                    </motion.button>
                                  </motion.div>
                                ))
                              )}
                            </AnimatePresence>
                          </div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 pt-4 border-t border-primary/20"
                          >
                            <p className="text-sm text-muted-foreground">
                              Completed: {editedGoal.milestones.filter((m) => m.completed).length} /{" "}
                              {editedGoal.milestones.length}
                            </p>
                          </motion.div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="analytics" className="mt-6">
                        <div className="bg-secondary p-6 rounded-lg border border-primary/20">
                          <h3 className="text-lg mb-4">Progress Over Time</h3>
                          {editedGoal.progressHistory.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={editedGoal.progressHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3d2416" />
                                <XAxis dataKey="date" stroke="#a68968" />
                                <YAxis stroke="#a68968" />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#2d1810",
                                    border: "1px solid #d4a574",
                                    borderRadius: "8px",
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#d4a574"
                                  strokeWidth={2}
                                  dot={{ fill: "#d4a574", r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-center py-12 text-muted-foreground">
                              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No progress history yet.</p>
                              <p className="text-sm mt-1">
                                Update your progress and click "Log Progress" to track changes over
                                time.
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 pt-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={handleSave}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={!editedGoal.title}
                    >
                      {goal ? "Save Changes" : "Create Goal"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={onClose} variant="outline" className="border-primary/20">
                      Cancel
                    </Button>
                  </motion.div>
                </motion.div>
              </div>

              {/* Footer - Sticky on mobile */}
              <div className="sticky bottom-0 bg-card border-t border-primary/20 p-4 md:p-6 space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 md:h-10 text-base md:text-sm"
                  >
                    {goal ? "Update Goal" : "Create Goal"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Image Adjuster Overlay */}
          {isAdjustingImage && tempImageUrl && (
            <ImageAdjuster
              imageUrl={tempImageUrl}
              onSave={handleImageAdjusted}
              onCancel={handleImageAdjustCancel}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}