import React from 'react'
type Props = {
  categories: string[]
}
const CategoryList: React.FC<Props> = ({ categories }) => {
  return (
    <>
      <h1>Category List</h1>
      {categories.map((category, index) => (
        <div key={index}>{category}</div>
      ))}
    </>
  )
}

export default CategoryList
