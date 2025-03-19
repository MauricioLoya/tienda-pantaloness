import React from 'react'
import { CategoryRepository } from '../definitions'
import CategoryTable from './CategotyTable'

const CategoryList: React.FC = async () => {
  const categories = await new CategoryRepository().getAll()

  return (
    <>
      <CategoryTable values={categories} />
    </>
  )
}

export default CategoryList
