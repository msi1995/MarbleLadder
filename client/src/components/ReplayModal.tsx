import React from 'react';

export const ReplayModal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="relative border-2 border-blue-500 border-solid p-4 rounded shadow-xl bg-white/90">
        <button onClick={onClose} className="absolute font-bold top-2 right-4 text-gray-500 hover:text-gray-700">
          X
        </button>
        {children}
      </div>
    </div>
  );
};