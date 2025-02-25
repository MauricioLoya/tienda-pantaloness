'use server'

export async function deleteCategoryAction(id: number) {
  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('deleteCategoryAction', id)
}
