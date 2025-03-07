import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="flex justify-center mb-6"></div>
      <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
      <p className="text-lg max-w-md mx-auto mb-8">
        Tu pedido ha sido procesado con éxito. Te hemos enviado un correo con
        los detalles de tu compra.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
      >
        Volver a la tienda
      </Link>
    </div>
  )
}
