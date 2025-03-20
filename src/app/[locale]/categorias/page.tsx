import React from 'react'
import HeroSection from '@/modules/category-list/components/HeroSection'
import CategoryList from '@/modules/category-list/components/CategoryList'

export const revalidate = 3600 // Revalidate at most every hour

async function CategoriasPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryList />
    </div>
  )
}

export default CategoriasPage
