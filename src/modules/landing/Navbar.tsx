'use client';
import CartButton from '@/modules/landing/cart/CartButton';
import React, { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navbar');

  return (
    <nav className='navbar bg-white shadow-lg fixed z-50'>
      <div className='navbar max-w-7xl mx-auto'>
        <div className='flex-1'>
          <Link href={'/'} className='btn btn-ghost text-xl text-primary'>
            <img className='h-12' src="./logo.png" alt="logo" />
          </Link>
        </div>

        {/* Mobile menu button */}

        <div className='flex-none lg:hidden'>
          <CartButton />
          <button className='btn btn-square btn-ghost' onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='inline-block w-5 h-5 stroke-current'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h16M4 18h16'
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className='flex-none hidden lg:flex gap-2'>
          <ul className='menu menu-horizontal px-1'>
            <li>
              <Link href={'/productos'}>{t('products')}</Link>
            </li>
            <li>
              <Link href={'/categorias'}>{t('categories')}</Link>
            </li>
            <li>
              <Link href={'/contacto'}>{t('contact')}</Link>
            </li>
          </ul>
          <LanguageSwitcher />
          <CartButton />
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className='lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50 p-4'>
          <ul className='menu menu-vertical w-full'>
            <li>
              <Link href={'/productos'}>{t('products')}</Link>
            </li>
            <li>
              <Link href={'/categorias'}>{t('categories')}</Link>
            </li>
            <li>
              <Link href={'/contacto'}>{t('contact')}</Link>
            </li>
          </ul>
          <div className='flex justify-center mt-4'>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
