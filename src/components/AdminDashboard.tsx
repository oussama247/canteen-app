import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Settings, Calendar, Image, Upload, Download, Filter, Save, Camera } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

interface Dish {
  id: string;
  name: string;
  image?: string;
  nutritions: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

interface Reservation {
  id: string;
  userName: string;
  dish: string;
  date: string;
  time: string;
  status: 'confirmée' | 'en attente' | 'annulée';
  email: string;
  phone: string;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'reservations'>('menu');
  const [editingDish, setEditingDish] = useState<string | null>(null);
  const [showAddDish, setShowAddDish] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [mockMenu, setMockMenu] = useState<Record<string, Dish[]>>({
    volaille: [
      { 
        id: '1', 
        name: 'Poulet aux herbes', 
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=150&fit=crop',
        nutritions: { calories: 250, proteins: 30, carbs: 5, fats: 12, fiber: 1 }
      },
      { 
        id: '2', 
        name: 'Escalope de dinde', 
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200&h=150&fit=crop',
        nutritions: { calories: 180, proteins: 35, carbs: 2, fats: 4, fiber: 0 }
      }
    ],
    viande: [
      { 
        id: '3', 
        name: 'Bœuf bourguignon', 
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=200&h=150&fit=crop',
        nutritions: { calories: 320, proteins: 25, carbs: 8, fats: 20, fiber: 2 }
      }
    ],
    poisson: [
      { 
        id: '4', 
        name: 'Saumon grillé', 
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=150&fit=crop',
        nutritions: { calories: 280, proteins: 40, carbs: 0, fats: 12, fiber: 0 }
      }
    ]
  });

  const [mockReservations, setMockReservations] = useState<Reservation[]>([
    { id: '1', userName: 'Marie Dupont', dish: 'Poulet aux herbes', date: '2025-01-13', time: '18:00', status: 'confirmée', email: 'marie.dupont@email.com', phone: '06 12 34 56 78' },
    { id: '2', userName: 'Pierre Martin', dish: 'Saumon grillé', date: '2025-01-13', time: '18:15', status: 'en attente', email: 'pierre.martin@email.com', phone: '06 98 76 54 32' },
    { id: '3', userName: 'Sophie Durand', dish: 'Bœuf bourguignon', date: '2025-01-13', time: '18:30', status: 'confirmée', email: 'sophie.durand@email.com', phone: '06 11 22 33 44' }
  ]);

  const [newDish, setNewDish] = useState<Partial<Dish>>({
    name: '',
    nutritions: { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 }
  });

  const handleImageUpload = (dishId: string, standKey: string) => {
    // Simulation d'upload d'image
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setMockMenu(prev => ({
            ...prev,
            [standKey]: prev[standKey].map(dish => 
              dish.id === dishId ? { ...dish, image: imageUrl } : dish
            )
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateDishNutrition = (dishId: string, standKey: string, field: keyof Dish['nutritions'], value: number) => {
    setMockMenu(prev => ({
      ...prev,
      [standKey]: prev[standKey].map(dish => 
        dish.id === dishId 
          ? { ...dish, nutritions: { ...dish.nutritions, [field]: value } }
          : dish
      )
    }));
  };

  const deleteDish = (dishId: string, standKey: string) => {
    setMockMenu(prev => ({
      ...prev,
      [standKey]: prev[standKey].filter(dish => dish.id !== dishId)
    }));
  };

  const addNewDish = (standKey: string) => {
    if (newDish.name) {
      const dish: Dish = {
        id: Date.now().toString(),
        name: newDish.name,
        image: newDish.image,
        nutritions: newDish.nutritions || { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 }
      };
      
      setMockMenu(prev => ({
        ...prev,
        [standKey]: [...prev[standKey], dish]
      }));
      
      setNewDish({ name: '', nutritions: { calories: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0 } });
      setShowAddDish(false);
    }
  };

  const filteredReservations = mockReservations.filter(res => {
    const matchesStatus = filterStatus === 'all' || res.status === filterStatus;
    const matchesSearch = res.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         res.dish.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const exportReservations = () => {
    const csvContent = [
      ['Client', 'Email', 'Téléphone', 'Plat', 'Date', 'Heure', 'Statut'],
      ...filteredReservations.map(res => [
        res.userName, res.email, res.phone, res.dish, res.date, res.time, res.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateReservationStatus = (id: string, status: Reservation['status']) => {
    setMockReservations(prev => 
      prev.map(res => res.id === id ? { ...res, status } : res)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Administration</h2>
              <p className="text-sm text-gray-600">Gestion complète des menus et réservations</p>
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
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'menu' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              <span className="flex items-center space-x-2">
                <Image className="w-4 h-4" />
                <span>Gestion Menu</span>
              </span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'reservations' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('reservations')}
            >
              <span className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Réservations</span>
              </span>
            </button>
          </div>

          {/* Menu Tab */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              {Object.entries(mockMenu).map(([stand, plats]) => (
                <div key={stand} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg text-gray-900 capitalize">{stand}</h4>
                    <button 
                      onClick={() => setShowAddDish(true)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {plats.map((plat) => (
                      <div key={plat.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="relative mb-3">
                          {plat.image ? (
                            <img 
                              src={plat.image} 
                              alt={plat.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <button
                            onClick={() => handleImageUpload(plat.id, stand)}
                            className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all shadow-md"
                          >
                            <Upload className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <h5 className="font-medium text-gray-900 mb-3">{plat.name}</h5>
                        
                        {editingDish === plat.id ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-gray-600">Calories</label>
                                <input
                                  type="number"
                                  value={plat.nutritions.calories}
                                  onChange={(e) => updateDishNutrition(plat.id, stand, 'calories', Number(e.target.value))}
                                  className="w-full px-2 py-1 border rounded text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600">Protéines (g)</label>
                                <input
                                  type="number"
                                  value={plat.nutritions.proteins}
                                  onChange={(e) => updateDishNutrition(plat.id, stand, 'proteins', Number(e.target.value))}
                                  className="w-full px-2 py-1 border rounded text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600">Glucides (g)</label>
                                <input
                                  type="number"
                                  value={plat.nutritions.carbs}
                                  onChange={(e) => updateDishNutrition(plat.id, stand, 'carbs', Number(e.target.value))}
                                  className="w-full px-2 py-1 border rounded text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-600">Lipides (g)</label>
                                <input
                                  type="number"
                                  value={plat.nutritions.fats}
                                  onChange={(e) => updateDishNutrition(plat.id, stand, 'fats', Number(e.target.value))}
                                  className="w-full px-2 py-1 border rounded text-center"
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => setEditingDish(null)}
                              className="w-full bg-green-600 text-white py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              <Save className="w-3 h-3 inline mr-1" />
                              Sauvegarder
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs text-gray-600 space-y-1 mb-3">
                              <div className="flex justify-between">
                                <span>Calories:</span>
                                <span className="font-medium">{plat.nutritions.calories}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Protéines:</span>
                                <span className="font-medium">{plat.nutritions.proteins}g</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Glucides:</span>
                                <span className="font-medium">{plat.nutritions.carbs}g</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Lipides:</span>
                                <span className="font-medium">{plat.nutritions.fats}g</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingDish(plat.id)}
                                className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                <Edit className="w-3 h-3 inline mr-1" />
                                Éditer
                              </button>
                              <button
                                onClick={() => deleteDish(plat.id, stand)}
                                className="bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Modal pour ajouter un plat */}
              {showAddDish && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau plat</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nom du plat</label>
                        <input
                          type="text"
                          value={newDish.name || ''}
                          onChange={(e) => setNewDish(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="Nom du plat..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Calories</label>
                          <input
                            type="number"
                            value={newDish.nutritions?.calories || 0}
                            onChange={(e) => setNewDish(prev => ({ 
                              ...prev, 
                              nutritions: { ...prev.nutritions!, calories: Number(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Protéines (g)</label>
                          <input
                            type="number"
                            value={newDish.nutritions?.proteins || 0}
                            onChange={(e) => setNewDish(prev => ({ 
                              ...prev, 
                              nutritions: { ...prev.nutritions!, proteins: Number(e.target.value) }
                            }))}
                            className="w-full px-3 py-2 border rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowAddDish(false)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => addNewDish('volaille')}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher client ou plat..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-3 pr-10 py-2 border rounded-lg w-full sm:w-64"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="confirmée">Confirmées</option>
                    <option value="en attente">En attente</option>
                    <option value="annulée">Annulées</option>
                  </select>
                </div>
                
                <button
                  onClick={exportReservations}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter CSV</span>
                </button>
              </div>

              {/* Tableau des réservations */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Client</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Contact</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Plat</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Heure</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Statut</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredReservations.map(res => (
                        <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{res.userName}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-gray-600">
                              <div>{res.email}</div>
                              <div>{res.phone}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{res.dish}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{res.time}</td>
                          <td className="px-4 py-3">
                            <select
                              value={res.status}
                              onChange={(e) => updateReservationStatus(res.id, e.target.value as Reservation['status'])}
                              className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${
                                res.status === 'confirmée' ? 'bg-green-100 text-green-800' :
                                res.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="confirmée">Confirmée</option>
                              <option value="en attente">En attente</option>
                              <option value="annulée">Annulée</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-700 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-700 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Total réservations</h4>
                  <p className="text-2xl font-bold text-blue-600">{filteredReservations.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Confirmées</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredReservations.filter(r => r.status === 'confirmée').length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900">En attente</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredReservations.filter(r => r.status === 'en attente').length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}