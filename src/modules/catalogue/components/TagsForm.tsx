'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/lib/components/ToastContext';
import { addTagsAction } from '../actions/addTagsAction';

type Props = {
  productId?: number;
  initialTags?: string;
};

const TagsForm: React.FC<Props> = ({ productId, initialTags }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialTags) {
      const parsed = initialTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      setTags(parsed.slice(0, 10));
    }
  }, [initialTags]);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags(prev => [...prev, trimmed]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key)) {
      e.preventDefault();
      addTag(input);
      setInput('');
    } else if (e.key === 'Backspace' && input === '') {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!productId) return;
    try {
      await addTagsAction(productId, tags);
      showToast('Tags guardadas exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al guardar las tags', 'error');
    }
  };

  return (
    <div className='card shadow p-4 mt-4'>
      <h2 className='text-xl font-bold mb-2'>Palabras Clave</h2>
      <input
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Escribe una palabra clave y presiona Enter o coma'
        className='input input-bordered w-full mb-2'
        disabled={tags.length >= 10}
      />

      <div className='flex flex-wrap gap-2 mb-2'>
        {tags.map((tag, idx) => (
          <span
            key={`${tag}-${idx}`}
            className='bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center'
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className='ml-2 text-red-500 hover:text-red-700'
              type='button'
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <button
        type='button'
        onClick={handleSubmit}
        className='btn btn-primary mt-2'
        disabled={!productId || tags.length === 0}
      >
        Guardar Tags
      </button>
    </div>
  );
};

export default TagsForm;
