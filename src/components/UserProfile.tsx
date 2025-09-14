import React, { useState } from 'react';
import { X, User, AlertCircle, Save } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onClose: () => void;
  onUpdateDietaryConstraints: (constraints: string[]) => void;
}

const dietaryOptions = [
  'gluten', 'lactose', 'œufs', 'arachides', 'fruits à coque',
  'soja', 'poisson', 'crustacés', 'céleri', 'moutarde',
  'sésame', 'sulfites', 'lupin', 'mollusques',
  'végétarien', 'vegan', 'halal', 'casher', 'sans sucre ajouté'
];

export function UserProfile({ user, onClose, onUpdateDietaryConstraints }: UserProfileProps) {
  const [selectedConstraints, setSelectedConstraints] = useState<string[]>(user.dietaryConstraints || []);

  const toggleConstraint = (constraint: string) => {
    setSelectedConstraints(prev =>
      prev.includes(constraint)
        ? prev.filter(c => c !== constraint)
        : [...prev, constraint]
    );
  };

  const handleSave = () => {
    onUpdateDietaryConstraints(selectedConstraints);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mon Profil</h2>
              <p className="text-sm text-gray-600">Contraintes alimentaires</p>
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
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Mes contraintes alimentaires</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez vos allergies ou régimes alimentaires pour recevoir des alertes dans les menus.
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map(option => (
                <label
                  key={option}
                  className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedConstraints.includes(option)}
                    onChange={() => toggleConstraint(option)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-900 capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          {selectedConstraints.length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Contraintes sélectionnées :</h4>
              <div className="flex flex-wrap gap-2">
                {selectedConstraints.map(constraint => (
                  <span
                    key={constraint}
                    className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                  >
                    {constraint}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
