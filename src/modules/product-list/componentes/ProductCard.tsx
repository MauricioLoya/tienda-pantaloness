import React from 'react';

import { formatPrice } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

type Props = {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  discountedPrice?: number;
  discountPercentage?: number;
  thumbnail: string;
  isAvailable: boolean;
};

const ProductCard: React.FC<Props> = ({
  thumbnail,
  name,
  description,
  basePrice,
  discountedPrice,
  discountPercentage,
  isAvailable,
  slug,
}) => {
  return (
    <Link href={`/productos/${slug}`} className='block'>
      <div className='card card-compact bg-base-100 lg:w-72 shadow-xl h-[600px] flex flex-col group hover:shadow-2xl transition-shadow duration-300'>
        <figure className='h-80 overflow-hidden'>
          <img
            className='h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
            alt={name ?? 'not-found'}
            src={thumbnail ?? 'not-found'}
          />
        </figure>
        <div className='card-body flex flex-col flex-1'>
          <h2 className='card-title line-clamp-1'>{name}</h2>
          <p className='line-clamp-3 text-sm text-gray-600'>{description}</p>
          <div className='flex flex-col gap-2 mt-auto'>
            <div className='flex flex-col'>
              {discountedPrice && discountPercentage ? (
                <>
                  <div className='flex items-center gap-2'>
                    <span className='text-xl font-bold line-through text-gray-400'>
                      {formatPrice(basePrice)}
                    </span>
                    <span className='text-sm text-green-500'>-{discountPercentage}%</span>
                  </div>
                  <span className='text-2xl font-bold text-primary'>
                    {formatPrice(discountedPrice)}
                  </span>
                </>
              ) : (
                <span className='text-2xl font-bold'>{formatPrice(basePrice)}</span>
              )}
            </div>
            <div className='card-actions justify-end'>
              <button className='btn btn-primary' disabled={!isAvailable}>
                {isAvailable ? 'Ver detalles' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
