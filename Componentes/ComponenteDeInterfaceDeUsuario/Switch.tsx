
import React from 'react';
import type { PropsSwitch } from '@/tipos/CompleteProfile.types';

export const Switch: React.FC<PropsSwitch> = ({ marcado, aoMudar, label }) => {
  const alternar = () => {
    aoMudar(!marcado);
  };

  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-400">{label}</label>
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
          marcado ? 'bg-blue-500' : 'bg-gray-700'
        }`}
        onClick={alternar}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
            marcado ? 'translate-x-6' : ''
          }`}
        ></div>
      </div>
    </div>
  );
};
