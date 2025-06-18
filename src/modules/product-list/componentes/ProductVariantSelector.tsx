'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AddToCartButton from '@/modules/landing/cart/AddToCartButton';
import { formatPrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { VariantItem } from '../definitions';

// Función para determinar urgencia y mensaje del stock
const getStockUrgencyMessage = (stock: number, t: ReturnType<typeof useTranslations>) => {
  if (stock <= 0) return null;

  if (stock === 1) {
    return {
      emoji: '🚨',
      message: t('stock_last_item'),
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      intensity: 'high'
    };
  }

  if (stock <= 3) {
    return {
      emoji: '🔥',
      message: t('stock_very_low', { count: stock }),
      color: 'text-red-500',
      bgColor: 'bg-red-50 border-red-200',
      intensity: 'high'
    };
  }

  if (stock <= 5) {
    return {
      emoji: '⚡',
      message: t('stock_low', { count: stock }),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 border-orange-200',
      intensity: 'medium'
    };
  }

  if (stock <= 10) {
    return {
      emoji: '⏰',
      message: t('stock_limited', { count: stock }),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      intensity: 'low'
    };
  }

  return null; // No mostrar mensaje si hay mucho stock
};

// Componente de Stock Countdown
const StockCountdown = ({ stock, t }: { stock: number; t: ReturnType<typeof useTranslations> }) => {
  const urgency = getStockUrgencyMessage(stock, t);

  if (!urgency) return null;

  return (
    <div className={`
      flex items-center gap-2 p-3 rounded-lg border-2 ${urgency.bgColor}
      ${urgency.intensity === 'high' ? 'animate-pulse' : ''}
    `}>
      <span className="text-lg">{urgency.emoji}</span>
      <span className={`font-semibold ${urgency.color}`}>
        {urgency.message}
      </span>
      {urgency.intensity === 'high' && (
        <span className="text-xs text-gray-500 ml-auto">
          {t('hurry_up')}
        </span>
      )}
    </div>
  );
};


interface ProductVariantSelectorProps {
  variants: VariantItem[];
  selectedSize?: string;
  productId: number;
  productSlug: string;
  productName: string;
  productImage: string;
  productRegionId: string;
}

const ProductVariantSelector = ({
  variants,
  selectedSize,
  productId,
  productSlug,
  productName,
  productImage,
  productRegionId,
}: ProductVariantSelectorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quantity, setQuantity] = useState(1);
  const t = useTranslations('ProductVariantSelector');

  const [currentSize, setCurrentSize] = useState<string | undefined>(selectedSize);
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | undefined>();

  // Update size selection
  const handleSizeSelect = (size: string) => {
    setCurrentSize(size);

    // Find the corresponding variant
    const variant = variants.find(v => v.size === size);
    setSelectedVariant(variant);

    // Create new URLSearchParams
    const params = new URLSearchParams((searchParams?.toString() ?? ''));
    params.set('size', size);

    // Update URL with the selected size
    router.push(`/productos/${productSlug}?${params.toString()}`, {
      scroll: false,
    });
  };

  // Initialize size based on priority: URL params > selectedSize prop > first available variant
  useEffect(() => {
    if (variants.length === 0) return;

    // First check URL parameters
    const sizeFromUrl = searchParams?.get('size');
    if (sizeFromUrl) {
      const variant = variants.find(v => v.size === sizeFromUrl);
      if (variant) {
        setCurrentSize(sizeFromUrl);
        setSelectedVariant(variant);
        return;
      }
    }

    // Then check selectedSize prop
    if (selectedSize) {
      const variant = variants.find(v => v.size === selectedSize);
      if (variant) {
        setCurrentSize(selectedSize);
        setSelectedVariant(variant);
        return;
      }
    }

    // Default to first available variant with stock or just the first variant
    const defaultVariant = variants.find(v => v.stock > 0) || variants[0];
    setCurrentSize(defaultVariant.size);
    setSelectedVariant(defaultVariant);
  }, [variants, selectedSize, searchParams]);

  // Reset quantity if it exceeds the available stock when variant changes
  useEffect(() => {
    if (selectedVariant) {
      // Set quantity to the minimum between current quantity and available stock
      const maxAllowedQuantity = Math.min(quantity, selectedVariant.stock);
      if (quantity !== maxAllowedQuantity) {
        setQuantity(maxAllowedQuantity || 1); // Default to 1 if stock is 0
      }
    }
  }, [selectedVariant, quantity]);

  const hasDiscount = selectedVariant && selectedVariant.discount > 0;
  const discountPercentage = hasDiscount ? selectedVariant.discount : 0;

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>{t('select_size')}</h2>

      <div className='flex flex-wrap gap-2'>
        {variants.map(variant => (
          <button
            key={variant.id}
            onClick={() => handleSizeSelect(variant.size)}
            className={`
              btn btn-primary btn-outline px-4 py-2 border-2 rounded-md transition-all
              ${currentSize === variant.size
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-gray-300 hover:border-gray-400'
              }
              ${variant.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={variant.stock <= 0}
          >
            {variant.size}
            {variant.stock <= 0 && <span className='ml-1'>({t('sold_out')})</span>}
          </button>
        ))}
      </div>

      {currentSize && (
        <p className='text-sm text-green-600'>{t('size_selected', { size: currentSize })}</p>
      )}

      {/* Quantity */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>{t('quantity')}</h2>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => {
              if (quantity === 1) {
                return;
              }
              setQuantity(quantity - 1);
            }}
            className='btn btn-square btn-secondary btn-outline border-2 p-2'
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            -
          </button>
          <span className='text-gray-900 font-semibold'>{quantity}</span>
          <button
            onClick={() => {
              if (selectedVariant && quantity >= selectedVariant.stock) {
                return;
              }
              setQuantity(quantity + 1);
            }}
            className='btn btn-square btn-secondary btn-outline border-2 p-2'
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            +
          </button>
        </div>

        {/* Display available stock information */}
        {selectedVariant && (
          <p className='text-sm text-gray-600'>
            {selectedVariant.stock > 0
              ? t('available_items', { stock: selectedVariant.stock })
              : t('sold_out_status')}
          </p>
        )}
      </div>

      {/* Price */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>{t('final_price')}</h2>
        {selectedVariant && (
          <div className='flex items-center gap-4'>
            {hasDiscount && (
              <span className='text-gray-400 line-through'>
                {formatPrice(selectedVariant.price)}
              </span>
            )}
            <span className='text-3xl font-bold text-primary'>
              {formatPrice(hasDiscount ? (selectedVariant.discountPrice ?? 0) : (selectedVariant.price ?? 0))}
            </span>
            {hasDiscount && (
              <span className='bg-red-100 text-red-600 px-2 py-1 rounded'>
                {t('discount_percentage', { percentage: discountPercentage })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Stock Countdown Component */}
      {selectedVariant && (
        <StockCountdown stock={selectedVariant.stock} t={t} />
      )}

      {/* Add to Cart Button */}
      <AddToCartButton
        quantity={quantity}
        productId={productId}
        productName={productName}
        productImage={productImage}
        productRegionId={productRegionId}
        variant={selectedVariant}
        disabled={!selectedVariant || selectedVariant.stock <= 0}
      />
    </div>
  );
};

export default ProductVariantSelector;
