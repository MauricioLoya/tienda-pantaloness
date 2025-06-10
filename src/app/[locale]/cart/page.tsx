'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import SectionBox from '@/modules/landing/SectionBox';
import {
  createCheckoutSessionAction,
  SupportedRegion,
} from '@/modules/checkout/actions/createCheckoutSessionAction';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Loader from '@/lib/components/Loader';

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations('CartPage');
  const { items, removeItem, updateQuantity, total } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [promotionCode, setPromotionCode] = useState<string>('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponValid, setCouponValid] = useState<boolean | null>(null);

  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const cartForCheckout = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        couponCode: couponValid ? promotionCode : undefined,
      };
      const result = await createCheckoutSessionAction(
        locale as SupportedRegion,
        cartForCheckout
      );
      if (result.success && result.data) {
        router.push(result.data.checkoutUrl);
        return;
      }
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error during checkout:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleApplyPromotion = async () => {
    setCouponMessage(null);
    setCouponValid(null);
    setIsApplyingCoupon(true);

    try {
      if (!promotionCode.trim()) {
        setCouponMessage(t('enter_coupon'));
        setCouponValid(false);
        return;
      }

      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponCode: promotionCode.trim(),
          region: locale, // asumimos que locale coincide con SupportedRegion
        }),
      });

      if (!res.ok) {
        throw new Error('Error en validación de cupón');
      }

      const data: {
        isValidPromo: boolean;
        promotionId?: number;
        errors: string[];
      } = await res.json();

      if (data.isValidPromo) {
        setCouponValid(true);
        setCouponMessage(t('coupon_valid'));
      } else {
        setCouponValid(false);
        const firstErrorCode = data.errors[0];
        if (firstErrorCode === 'INVALID_COUPON') {
          setCouponMessage(t('coupon_invalid', { code: promotionCode.trim() }));
        } else {
          setCouponMessage(t('coupon_error'));
        }
      }
    } catch (err) {
      console.error('Error validando cupón:', err);
      setCouponValid(false);
      setCouponMessage(t('coupon_error'));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <SectionBox>
        <h1 className="text-3xl font-bold mb-6">{t('your_cart_is_empty')}</h1>
        <p className="mb-8">{t('why_not_add_products')}</p>
        <Link
          href="/productos"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          {t('view_products')}
        </Link>
      </SectionBox>
    );
  }

  return (
    <SectionBox>
      <h1 className="text-3xl font-bold mb-8">{t('your_cart')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
          {items.map(item => (
            <div key={item.id} className="flex border-b py-4">
              <div className="w-24 h-24 relative flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
              <div className="ml-5 flex-grow">
                <div className='flex row-auto items-center'>
                  <h3 className="font-medium">{item.name}</h3>
                  <small className="text-gray-500 ml-3"> ({item.region})</small>
                </div>
                <p className="text-sm text-gray-600">
                  {t('size')}: {item.size}
                </p>
                <div>
                  <p
                    className={`${item.discountPrice && item.discountPrice < item.price
                      ? 'line-through text-sm text-gray-500'
                      : ''
                      } font-medium`}
                  >
                    {formatPrice(item.price)}
                  </p>
                  {item.discountPrice && item.discountPrice < item.price && (
                    <p className="font-medium">
                      {formatPrice(item.discountPrice)}
                    </p>
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <button
                    className={`btn btn-square ${item.quantity === 1 ? 'btn-error' : ''
                      }`}
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeItem(item.id);
                        return;
                      }
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                  >
                    {item.quantity === 1 ? 'X' : '-'}
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    className="btn btn-square"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <p className="font-medium">
                  {formatPrice(
                    (item.discountPrice ?? item.price) * item.quantity
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary p-6 rounded-lg h-fit">
          <h2 className="text-xl text-white font-bold mb-4">
            {t('order_summary')}
          </h2>
          <div className="space-y-2 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-white">
                <span>
                  {item.quantity} x {item.name} ({item.size})
                </span>
                <span>
                  {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-bold">
              <span className="text-white">{t('total')}</span>
              <span className="text-white">{formatPrice(total)}</span>
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Sección de cupón */}
          <div className="mt-6">
            <input
              type="text"
              placeholder={t('coupon_code')}
              className="bg-white border-2 border-white rounded py-2 px-3 w-full"
              value={promotionCode}
              onChange={e => setPromotionCode(e.target.value)}
              disabled={isApplyingCoupon || couponValid === true}
            />
            <button
              className="btn btn-white mt-4 py-3 w-full flex items-center justify-center"
              onClick={handleApplyPromotion}
              disabled={isApplyingCoupon || couponValid === true}
            >
              {isApplyingCoupon ? (
                <Loader size="sm" color="primary" />
              ) : (
                t('apply')
              )}
            </button>
            {couponMessage && (
              <p
                className={`mt-2 text-sm ${couponValid ? 'text-green-400' : 'text-red-400'
                  }`}
              >
                {couponMessage}
              </p>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="btn btn-block btn-white mt-6 py-3 disabled:bg-gray-400"
          >
            {isCheckingOut ? (
              <Loader size="sm" color="primary" />
            ) : (
              t('proceed_to_payment')
            )}
          </button>

          <button
            onClick={() => router.push('/productos')}
            className="btn btn-block btn-secondary mt-4"
          >
            {t('continue_shopping')}
          </button>
        </div>
      </div>
    </SectionBox>
  );
}