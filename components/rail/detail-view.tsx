"use client";

import React from "react";
import { Product, getPrice, formatINR } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BottleImage } from "@/components/bottle-image";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

interface ProductDetailViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailView({
  product,
  isOpen,
  onClose,
}: ProductDetailViewProps) {
  const { addItem, setIsDrawerOpen } = useCart();

  if (!product) return null;
  const price = getPrice(product.id, "100 ml");

  const handleAddToCart = () => {
    addItem(product.id, "100 ml", 1);
    onClose();
    setIsDrawerOpen(true);
    toast.success(`Added ${product.name} to your bag`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:rounded-3xl p-6 bg-background border border-border">
        <DialogHeader className="text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            100% Ayurvedic
          </span>
          <DialogTitle className="font-serif text-2xl text-foreground">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {product.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="w-32 h-64 mb-4">
            <BottleImage product={product} priority sizes="128px" />
          </div>
          <p className="text-sm text-center text-muted-foreground leading-relaxed px-4">
            {product.description}
          </p>
          <p className="font-serif text-xl font-bold text-forest dark:text-gold mt-4">
            {price ? formatINR(price) : "Coming soon"}
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            variant="gold"
            className="flex-1 rounded-full font-semibold"
            onClick={handleAddToCart}
          >
            Add to Bag
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
