'use client'

import React, { useState } from 'react'
import { addImageAction } from '../actions/addImageAction'
import { removeImageAction } from '../actions/removeImageAction'
import { useRouter } from 'next/navigation'
import { ImageItem } from '../definitions'

interface ImagesFormProps {
  productId: number
  images: ImageItem[]
}

const ImagesForm: React.FC<ImagesFormProps> = ({ productId, images }) => {
  const [url, setUrl] = useState('')
  const router = useRouter()

  async function handleAdd() {
    if (!url.trim()) return
    await addImageAction(productId, url.trim())
    setUrl('')
    router.refresh()
  }

  async function handleRemove(imageId: number) {
    await removeImageAction(imageId)
    router.refresh()
  }

  return (
    <div className="card shadow p-4">
      <h2 className="text-xl font-bold mb-2">Imágenes</h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="URL de la imagen"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={handleAdd}>
          Agregar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map(img => (
          <div key={img.id} className="relative">
            <img src={img.url} alt="imagen" className="w-20 h-20 object-cover rounded" />
            <button
              className="btn btn-xs btn-circle btn-error absolute top-0 left-0"
              onClick={() => handleRemove(img.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImagesForm
