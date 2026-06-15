import { Plus, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import type { Goal } from "../types";

interface GoalCardProps {
  goal?: Goal;
  onClick: () => void;
  index: number;
}

export function GoalCard({ goal, onClick, index }: GoalCardProps) {
  if (!goal) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="aspect-square bg-card border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/60 hover:bg-card/80 transition-all flex flex-col items-center justify-center gap-2 md:gap-3 group min-h-[120px]"
      >
        <motion.div
          animate={{ rotate: [0, 90, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plus className="w-8 h-8 md:w-12 md:h-12 text-primary/50 group-hover:text-primary transition-colors" />
        </motion.div>
        <span className="text-xs md:text-base text-muted-foreground group-hover:text-foreground transition-colors">
          Add Goal
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="aspect-square bg-card border border-primary/20 rounded-lg overflow-hidden hover:border-primary/60 transition-all group relative shadow-lg hover:shadow-primary/20 min-h-[120px]"
    >
      {goal.imageUrl ? (
        <>
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            src={goal.imageUrl}
            alt={goal.title}
            className="w-full h-full object-cover"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary">
          <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground" />
        </div>
      )}
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black/90 to-transparent"
      >
        <h3 className="text-white truncate text-sm md:text-base">{goal.title}</h3>
        {goal.progress !== undefined && (
          <div className="mt-1 md:mt-2 bg-secondary/50 rounded-full h-1.5 md:h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="bg-primary h-full"
            />
          </div>
        )}
      </motion.div>
    </motion.button>
  );
}