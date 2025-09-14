import React from 'react';
import { Clock, Users } from 'lucide-react';
import { QueueInfo as QueueInfoType } from '../types';

interface QueueInfoProps {
  queueInfo: QueueInfoType;
}

export function QueueInfo({ queueInfo }: QueueInfoProps) {
  const getQueueColor = (count: number) => {
    if (count <= 5) return 'text-green-600 bg-green-50';
    if (count <= 10) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTimeColor = (time: number) => {
    if (time <= 3) return 'text-green-600';
    if (time <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          État des files d'attente
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(queueInfo).map(([stand, info]) => (
          <div key={stand} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 capitalize">{stand}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getQueueColor(info.current)}`}>
                {info.current} personnes
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Temps d'attente:</span>
              <span className={`font-medium ${getTimeColor(info.estimated)}`}>
                ~{info.estimated} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}