import React from 'react';
import { Leaf, MapPin, AlertTriangle, Info, Calendar, ShoppingCart } from 'lucide-react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  userConstraints: string[];   // 🔄 renommé
  showDetails?: boolean;
  onToggleDetails?: () => void;
  onReserveForDinner?: (dishId: string) => void;
  isReservedForDinner?: boolean;
}

export function DishCard({ 
  dish, 
  userConstraints, 
  showDetails = false, 
  onToggleDetails,
  onReserveForDinner,
  isReservedForDinner = false
}: DishCardProps) {
  const hasConstraintWarning = dish.allergens.some(allergen => 
    userConstraints.includes(allergen)
  );

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
      hasConstraintWarning ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-200'
    }`}>
      {dish.imageUrl && (
        <div className="relative">
          <img 
            src={dish.imageUrl} 
            alt={dish.name}
            className="w-full h-32 object-cover rounded-t-lg"
          />
          {hasConstraintWarning && (
            <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 text-lg">{dish.name}</h3>
          <span className="text-lg font-bold text-blue-600">{dish.price.toFixed(2)}€</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{dish.description}</p>
        
        {hasConstraintWarning && (
                <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}

              {/* warning dans le contenu */}
              {hasConstraintWarning && (
                <div className="flex items-center space-x-2 mb-3 p-2 bg-red-100 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-red-700 text-sm font-medium">
                    ⚠️ Ce plat contient un ingrédient qui fait partie de vos contraintes
                  </span>
                </div>
        )}
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {dish.sourcing.organic && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <Leaf className="w-3 h-3 mr-1" />
              Bio
            </span>
          )}
          
          {dish.sourcing.local && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              <MapPin className="w-3 h-3 mr-1" />
              Local
            </span>
          )}
          
          <span className="text-xs text-gray-500">{dish.sourcing.origin}</span>
        </div>
        
        {dish.allergens.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-1">Allergènes:</p>
            <div className="flex flex-wrap gap-1">
              {dish.allergens.map(allergen => (
                <span
                  key={allergen}
                  className={`px-2 py-1 rounded-full text-xs ${
                    userConstraints.includes(allergen)
                      ? 'bg-red-100 text-red-700 font-medium'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={onToggleDetails}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
        >
          <Info className="w-4 h-4" />
          <span>{showDetails ? 'Masquer' : 'Voir'} les détails nutritionnels</span>
        </button>
        
        {showDetails && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Informations nutritionnelles</h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Calories:</span>
                <span className="font-medium">{dish.nutritionalInfo.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Protéines:</span>
                <span className="font-medium">{dish.nutritionalInfo.proteins}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Glucides:</span>
                <span className="font-medium">{dish.nutritionalInfo.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lipides:</span>
                <span className="font-medium">{dish.nutritionalInfo.fats}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fibres:</span>
                <span className="font-medium">{dish.nutritionalInfo.fiber}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sucres:</span>
                <span className="font-medium">{dish.nutritionalInfo.sugar}g</span>
              </div>
              <div className="flex justify-between col-span-3">
                <span className="text-gray-600">Sel:</span>
                <span className="font-medium">{dish.nutritionalInfo.salt}g</span>
              </div>
            </div>
          </div>
        )}
        
        {dish.availableForDinner && onReserveForDinner && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={() => onReserveForDinner(dish.id)}
              disabled={isReservedForDinner}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isReservedForDinner
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : hasConstraintWarning
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isReservedForDinner ? (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Réservé pour ce soir</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {hasConstraintWarning ? 'Réserver malgré mes contraintes' : 'Réserver pour ce soir'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
