"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import SectionBox from "@/modules/landing/SectionBox";
import {
  createCheckoutSessionAction,
  CheckoutInput,
} from "@/modules/checkout/actions/createCheckoutSessionAction";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const cartForCheckout: CheckoutInput = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        customerInfo: {
          email: '',
          name: '',
        },
        shipping: {
          address: "Test Address",
          city: "Test City",
          country: "Test Country",
          postalCode: "12345",
        },
        couponCode: "",
      };
      console.log(cartForCheckout);
      const session = await createCheckoutSessionAction(cartForCheckout);
      console.log(session);
      if (session && session.success && session.data?.checkoutUrl) {
        // router.push(session.data.checkoutUrl);
        console.log(session.data.checkoutUrl)
      } else {
        throw new Error("No se pudo generar la sesión de pago.");
      }
    } catch (err: any) {
      console.error("Error during checkout:", err);
      setError(
        err.message ||
          "Hubo un problema con el pago. Por favor, intenta de nuevo."
      );
    } finally {
      // clearCart();
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <SectionBox>
        <h1 className="text-3xl font-bold mb-6">Tu carrito está vacío</h1>
        <p className="mb-8">¿Por qué no agregas algunos productos?</p>
        <Link
          href="/productos"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Ver productos
        </Link>
      </SectionBox>
    );
  }

  return (
    <SectionBox>
      <h1 className="text-3xl font-bold mb-8">Tu carrito</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
          {items.map((item) => (
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
                <p className="text-sm text-gray-600">Talla: {item.size}</p>
                <p className="font-medium">{formatPrice(item.price)}</p>
                <div className="flex items-center mt-2">
                  <button
                    className={`btn btn-square ${
                      item.quantity === 1 ? "btn-error" : ""
                    }`}
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeItem(item.id);
                        return;
                      }
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                  >
                    {item.quantity === 1 ? "X" : "-"}
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
            Resumen del pedido
          </h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
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
              <span className="text-white">Total</span>
              <span className="text-white">{formatPrice(total)}</span>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="btn btn-block btn-white mt-6 py-3 disabled:bg-gray-400"
          >
            {isCheckingOut ? "Procesando..." : "Proceder al pago"}
          </button>
          <button
            onClick={() => router.push("/productos")}
            className="btn btn-block btn-secondary mt-4"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    </SectionBox>
  );
}
