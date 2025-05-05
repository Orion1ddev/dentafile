
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, X } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageViewer = ({ isOpen, onClose, imageUrl }: ImageViewerProps) => {
  const { t } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `dental-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <DialogClose className="rounded-full p-1.5 hover:bg-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </DialogClose>
          </div>
          <div className="overflow-auto flex-1 p-4 flex items-center justify-center bg-black/5">
            <div className="overflow-auto max-h-[70vh] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={t('dental_image')}
                className="object-contain transition-all duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
