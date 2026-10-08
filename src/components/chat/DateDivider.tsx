import React from 'react';

export function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex items-center justify-center relative mt-6 mb-2 mx-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-discord-gray-500/50"></div>
      </div>
      <div className="relative bg-discord-gray-600 px-2 text-xs font-bold text-discord-gray-400">
        {date}
      </div>
    </div>
  );
}
