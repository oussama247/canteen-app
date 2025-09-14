// AdminDashboard.tsx
import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Settings, Calendar, Image } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations'>('menu');

  const mockMenu = {
    volaille: ['Poulet aux herbes', 'Escalope de dinde'],
    viande: ['Bœuf bourguignon'],
    poisson: ['Saumon grillé']
  };

  const mockReservations = [
    { id: '1', userName: 'Marie Dupont', dish: 'Poulet aux herbes', date: '2025-01-13', time: '18:00' },
    { id: '2', userName: 'Pierre Martin', dish: 'Saumon grillé', date: '2025-01-13', time: '18:15' },
    { id: '3', userName: 'Sophie Durand', dish: 'Bœuf bourguignon', date: '2025-01-13', time: '18:30' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Administration</h2>
              <p className="text-sm text-gray-600">Gestion des menus de la cantine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded ${activeTab === 'menu' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'reservations' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('reservations')}
            >
              Réservations
            </button>
          </div>

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {Object.entries(mockMenu).map(([stand, plats]) => (
                <div key={stand} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">{stand}</h4>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {plats.map((plat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                        <span className="text-sm">{plat}</span>
                        <div className="flex space-x-1">
                          <button className="text-blue-600 hover:text-blue-700">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                <Plus className="w-4 h-4" />
                <span>Ajouter un plat</span>
              </button>
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Client</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Plat</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Heure</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockReservations.map(res => (
                      <tr key={res.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{res.userName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.dish}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.time}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Confirmée
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Future Features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h4 className="font-medium text-blue-900 mb-2">Fonctionnalités à venir</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Upload et gestion des photos de plats</li>
              <li>• Édition complète des informations nutritionnelles</li>
              <li>• Filtrage et export des réservations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
