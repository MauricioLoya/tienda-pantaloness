import React from 'react';
import ProductCard from './ProductCard';
import { ProductListRepository } from '../definitions';

interface RelatedProductsProps {
    slug: string;
}

const RelatedProducts = async ({ slug }: RelatedProductsProps) => {
    // Usar el repositorio para obtener productos relacionados basados en el slug
    const productRepository = new ProductListRepository();
    const relatedProducts = await productRepository.getRelatedProducts(slug);

    const title = 'Productos Relacionados';

    return (
        <div className="w-full py-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>

                {relatedProducts.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No hay productos relacionados disponibles.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                        {relatedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                slug={product.slug}
                                name={product.name}
                                description={product.description}
                                basePrice={product.price}
                                discountedPrice={product.discountedPrice || undefined}
                                discountPercentage={product.discountPercentage || undefined}
                                thumbnail={product.thumbnail}
                                isAvailable={product.isAvailable}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RelatedProducts;