import React from 'react'
import { CategoryRepository } from '../definitions'
import CategoryTable from './CategotyTable'

const CategoryList: React.FC = async () => {
  const categoryRepo = new CategoryRepository()
  const categories = await categoryRepo.getAll()

  return (
    <>
      <CategoryTable values={categories} />
    </>
  )
}

export default CategoryList
