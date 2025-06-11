'use client';
import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import mxTranslations from '../../../../messages/mx.json';
import usTranslations from '../../../../messages/us.json';
import { FaBroom } from 'react-icons/fa';

interface SearchBarProps {
  sizeList?: string[];
  categoryList?: { label: string; value: number }[];
  searchQuery?: string | string[];
  category?: string | string[];
  size?: string | string[];
  minPrice?: string | string[];
  maxPrice?: string | string[];
  sortBy?: string | string[];
  sortDirection?: string | string[];
  regionCode: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery = '',
  category = '',
  size = '',
  minPrice = '',
  maxPrice = '',
  sortBy = '',
  sortDirection = 'asc',
  sizeList = [],
  categoryList = [],
  regionCode,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener traducciones basadas en la región
  const translations = regionCode === 'us' ? usTranslations : mxTranslations;
  const t = translations.searchBar;

  const [formState, setFormState] = useState({
    searchQuery:
      searchParams?.get('searchQuery') || (typeof searchQuery === 'string' ? searchQuery : ''),
    category: searchParams?.get('category') || (typeof category === 'string' ? category : ''),
    size: searchParams?.get('size') || (typeof size === 'string' ? size : ''),
    minPrice: searchParams?.get('minPrice') || (typeof minPrice === 'string' ? minPrice : ''),
    maxPrice: searchParams?.get('maxPrice') || (typeof maxPrice === 'string' ? maxPrice : ''),
    sortBy: searchParams?.get('sortBy') || (typeof sortBy === 'string' ? sortBy : ''),
    sortDirection:
      searchParams?.get('sortDirection') ||
      (typeof sortDirection === 'string' ? sortDirection : 'asc'),
  });

  // Loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Debounce timer reference
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  // Function to apply filters/search with debounce
  const applyFilters = () => {
    setLoading(true);

    // Start with existing URL parameters instead of creating a new empty object
    const params = new URLSearchParams(window.location.search);

    // Only add or update parameters from the form state
    Object.entries(formState).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        // Remove the parameter if empty
        params.delete(key);
      }
    });

    // Mantener la región en la URL
    if (regionCode) {
      params.set('region', regionCode);
    }

    // Redirect to the same page with the merged query parameters
    router.push(`?${params.toString()}`);

    // Set loading to false after a short delay to show the loading indicator
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  // Debounced search effect
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout for form changes
    searchTimeoutRef.current = setTimeout(() => {
      applyFilters();
    }, 900); // 900ms debounce delay

    // Cleanup function to clear timeout when component unmounts or form state changes
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]); // React to all form state changes

  return (
    <div className='max-w-7xl mx-auto collapse collapse-arrow bg-base-200 rounded-lg shadow mb-6'>
      <input type='checkbox' className='collapse-checkbox' />
      <div className='collapse-title text-xl font-medium flex items-center'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2}
          stroke='currentColor'
          className='w-6 h-6 mr-2'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
          />
        </svg>
        {loading ? (
          <span className='flex items-center'>
            {t.title}
            <span className='loading loading-spinner loading-xs ml-2'></span>
          </span>
        ) : (
          t.title
        )}
      </div>

      <div className='collapse-content'>
        <form onSubmit={handleSubmit}>
          <div className='p-4'>
            {/* Search field and Category in a flex container */}
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.search}</span>
                </label>
                <input
                  type='text'
                  name='searchQuery'
                  value={formState.searchQuery}
                  onChange={handleInputChange}
                  placeholder={t.searchPlaceholder}
                  className='input input-bordered w-full'
                />
              </div>

              {/* Category Filter */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.category}</span>
                </label>
                <select
                  name='category'
                  value={formState.category}
                  onChange={handleInputChange}
                  className='select select-bordered w-full'
                >
                  <option value=''>{t.allCategories}</option>
                  {categoryList.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
              {/* Size Filter */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.size}</span>
                </label>
                <select
                  name='size'
                  value={formState.size}
                  onChange={handleInputChange}
                  className='select select-bordered w-full'
                >
                  <option value=''>{t.allSizes}</option>
                  {sizeList.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.minPrice}</span>
                </label>
                <input
                  type='number'
                  name='minPrice'
                  value={formState.minPrice}
                  onChange={handleInputChange}
                  placeholder={t.minPricePlaceholder}
                  className='input input-bordered w-full'
                />
              </div>

              {/* Max Price */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.maxPrice}</span>
                </label>
                <input
                  type='number'
                  name='maxPrice'
                  value={formState.maxPrice}
                  onChange={handleInputChange}
                  placeholder={t.maxPricePlaceholder}
                  className='input input-bordered w-full'
                />
              </div>

              {/* Sort By */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.sortBy}</span>
                </label>
                <select
                  name='sortBy'
                  value={formState.sortBy}
                  onChange={handleInputChange}
                  className='select select-bordered w-full'
                >
                  <option value=''>{t.noSort}</option>
                  <option value='name'>{t.sortName}</option>
                  <option value='price'>{t.sortPrice}</option>
                </select>
              </div>

              {/* Sort Direction */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>{t.direction}</span>
                </label>
                <select
                  name='sortDirection'
                  value={formState.sortDirection}
                  onChange={handleInputChange}
                  className='select select-bordered w-full'
                >
                  <option value='asc'>{t.ascending}</option>
                  <option value='desc'>{t.descending}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={() => {
                setFormState({
                  searchQuery: '',
                  category: '',
                  size: '',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: '',
                  sortDirection: 'asc',
                });
                const params = new URLSearchParams();
                if (regionCode) {
                  params.set('region', regionCode);
                }
                router.push(`?${params.toString()}`);
              }}
              className="btn btn-secondary"
            >
              <FaBroom className="mr-2" />
              {t.clean_filters}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;