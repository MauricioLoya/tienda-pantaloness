'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import SectionBox from '@/modules/landing/SectionBox'
import { createCheckoutSessionAction } from '@/modules/checkout/actions/createCheckoutSessionAction'
import { CheckoutInput } from '@/modules/checkout/validations'
import { useTranslations } from 'next-intl'

export default function CartPage() {
  const t = useTranslations('CartPage')
  const { items, removeItem, updateQuantity, total } = useCart()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsCheckingOut(true)
    setError(null)

    try {
      const cartForCheckout: CheckoutInput = {
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        customerInfo: {
          email: '',
          name: ''
        },
        shipping: {
          address: 'Test Address',
          city: 'Test City',
          country: 'Test Country',
          postalCode: '12345'
        },
        couponCode: ''
      }
      console.log(cartForCheckout)
      const session = await createCheckoutSessionAction(cartForCheckout)
      if (session.success && session.data) {
        router.push(session.data.checkoutUrl)
        return
      }
    } catch (err) {
      console.error('Error during checkout:', err)
    } finally {
      setIsCheckingOut(false)
    }
  }

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
    )
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
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {t('size')}: {item.size}
                </p>
                <p className="font-medium">{formatPrice(item.price)}</p>
                <div className="flex items-center mt-2">
                  <button
                    className={`btn btn-square ${
                      item.quantity === 1 ? 'btn-error' : ''
                    }`}
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeItem(item.id)
                        return
                      }
                      updateQuantity(item.id, item.quantity - 1)
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
                  {formatPrice(item.price * item.quantity)}
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
                <span>{formatPrice(item.price * item.quantity)}</span>
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
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="btn btn-block btn-white mt-6 py-3 disabled:bg-gray-400"
          >
            {isCheckingOut ? t('processing') : t('proceed_to_payment')}
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
  )
}
