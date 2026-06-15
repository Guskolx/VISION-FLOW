import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCw, Move, Check, X } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface ImageAdjusterProps {
  imageUrl: string;
  onSave: (adjustedImageUrl: string) => void;
  onCancel: () => void;
}

export function ImageAdjuster({ imageUrl, onSave, onCancel }: ImageAdjusterProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imgRef.current = img;
      drawImage();
    };
  }, [imageUrl]);

  useEffect(() => {
    drawImage();
  }, [zoom, rotation, position]);

  const drawImage = () => {
    if (!canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply zoom and position
    const scaledWidth = imgRef.current.width * zoom;
    const scaledHeight = imgRef.current.height * zoom;

    ctx.drawImage(
      imgRef.current,
      -scaledWidth / 2 + position.x,
      -scaledHeight / 2 + position.y,
      scaledWidth,
      scaledHeight
    );

    // Restore context state
    ctx.restore();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const adjustedImageUrl = canvasRef.current.toDataURL("image/png");
    onSave(adjustedImageUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-2 md:p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card border border-primary/30 rounded-xl max-w-4xl w-full shadow-2xl"
      >
        <div className="p-4 md:p-6 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl text-primary">Adjust Image</h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Canvas */}
          <div className="relative bg-secondary rounded-lg overflow-hidden border-2 border-primary/20">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  setIsDragging(true);
                  setDragStart({
                    x: touch.clientX - position.x,
                    y: touch.clientY - position.y,
                  });
                }
              }}
              onTouchMove={(e) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                setPosition({
                  x: touch.clientX - dragStart.x,
                  y: touch.clientY - dragStart.y,
                });
              }}
              onTouchEnd={() => setIsDragging(false)}
              className={`w-full h-auto ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ maxHeight: "60vh", touchAction: "none" }}
            />
            <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-black/60 backdrop-blur-sm text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm flex items-center gap-2">
              <Move className="w-3 h-3 md:w-4 md:h-4" />
              Drag to reposition
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleZoomIn}
                variant="outline"
                className="w-full border-primary/20 gap-2 h-10 md:h-9 text-sm"
              >
                <ZoomIn className="w-4 h-4" />
                <span className="hidden sm:inline">Zoom In</span>
                <span className="sm:hidden">+</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleZoomOut}
                variant="outline"
                className="w-full border-primary/20 gap-2 h-10 md:h-9 text-sm"
              >
                <ZoomOut className="w-4 h-4" />
                <span className="hidden sm:inline">Zoom Out</span>
                <span className="sm:hidden">-</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleRotate}
                variant="outline"
                className="w-full border-primary/20 gap-2 h-10 md:h-9 text-sm"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">Rotate 90°</span>
                <span className="sm:hidden">Rotate</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full border-primary/20 h-10 md:h-9 text-sm"
              >
                Reset
              </Button>
            </motion.div>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm text-muted-foreground flex items-center justify-between">
              <span>Zoom Level</span>
              <span className="text-primary">{Math.round(zoom * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 md:pt-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 md:h-10"
              >
                <Check className="w-4 h-4" />
                Apply Changes
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onCancel}
                variant="outline"
                className="border-primary/20 h-11 md:h-10 px-4 md:px-6"
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}