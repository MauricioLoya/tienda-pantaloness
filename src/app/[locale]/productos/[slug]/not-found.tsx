import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Product Not Found</h1>
        <p className="text-gray-600">
          {"Sorry, we couldn't find the product you're looking for."}
        </p>
        <p>404</p>
        <Link href="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  )
}
