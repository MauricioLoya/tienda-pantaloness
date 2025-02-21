import React from 'react'

const Loader: React.FC = () => {
  return (
    <div className="animate-pulse w-full h-56 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
      <div className="h-8 w-8 bg-white rounded-full animate-ping duration-75"></div>
    </div>
  )
}

export default Loader
