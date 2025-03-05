import React from 'react'
type Props = {
  name: string
  description: string
  basePrice: number
  discount?: number
  discountPercentage?: number
  thumbnail: string
  isAvailable: boolean
}
const ProductCard: React.FC<Props> = ({ thumbnail, name }) => {
  return (
    <div className="card card-compact bg-base-100 sm:w-72 shadow-xl">
      <figure>
        <img
          className="h-96 w-full object-cover"
          src="https://i5.walmartimages.com/asr/afb47936-56fb-4143-8ecb-f7987badd210.4fd411fedb4ad42fa50b63e12948f2fc.jpeg"
          alt="Shoes"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
