import React, { useState } from 'react'
import { PromotionRepository } from '@/modules/promotion/definitions'
import { Promotion } from '@prisma/client'

const promotionRepo = new PromotionRepository()

const PromotionTest: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGetAll = async () => {
    try {
      const data = await promotionRepo.getAll()
      setPromotions(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch promotions')
    }
  }

  const handleGetById = async (id: number) => {
    try {
      const data = await promotionRepo.getById(id)
      setPromotion(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch promotion')
    }
  }

  const handleCreate = async () => {
    try {
      const newPromotion = {
        code: 'NEWCODE',
        name: 'New Promotion',
        description: 'Description of the new promotion',
        discount: 10,
        startDate: new Date(),
        endDate: new Date(),
        active: true,
      }
      const data = await promotionRepo.create(newPromotion)
      setPromotion(data)
      setError(null)
    } catch (err) {
      setError('Failed to create promotion')
    }
  }

  const handleUpdate = async (id: number) => {
    try {
      const updatedPromotion = {
        name: 'Updated Promotion',
      }
      const data = await promotionRepo.update(id, updatedPromotion)
      setPromotion(data)
      setError(null)
    } catch (err) {
      setError('Failed to update promotion')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await promotionRepo.delete(id)
      setPromotion(null)
      setError(null)
    } catch (err) {
      setError('Failed to delete promotion')
    }
  }

  return (
    <div>
      <h1>Promotion Test</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleGetAll}>Get All Promotions</button>
      <button onClick={() => handleGetById(1)}>Get Promotion By ID</button>
      <button onClick={handleCreate}>Create Promotion</button>
      <button onClick={() => handleUpdate(1)}>Update Promotion</button>
      <button onClick={() => handleDelete(1)}>Delete Promotion</button>
      <div>
        <h2>All Promotions</h2>
        {promotions.map((promo) => (
          <div key={promo.id}>{promo.name}</div>
        ))}
      </div>
      {promotion && (
        <div>
          <h2>Promotion Details</h2>
          <p>ID: {promotion.id}</p>
          <p>Code: {promotion.code}</p>
          <p>Name: {promotion.name}</p>
          <p>Description: {promotion.description}</p>
          <p>Discount: {promotion.discount}</p>
          <p>Start Date: {promotion.startDate.toString()}</p>
          <p>End Date: {promotion.endDate.toString()}</p>
          <p>Active: {promotion.active ? 'Yes' : 'No'}</p>
          <p>Created At: {promotion.createdAt.toString()}</p>
        </div>
      )}
    </div>
  )
}

export default PromotionTest