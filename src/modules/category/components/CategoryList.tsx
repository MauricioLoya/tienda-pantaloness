import React from 'react'
import { CategoryRepository } from '../definitions'

const CategoryList: React.FC = async () => {
  const categoryRepo = new CategoryRepository()
  const categories = await (
    await categoryRepo.getAll()
  ).map(category => category.name)
  return (
    <>
      {categories.map((category, index) => (
        <div key={index}>{category}</div>
      ))}
    </>
  )
}

export default CategoryList
