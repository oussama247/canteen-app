import React, { useState } from 'react';
import { DishCard } from './DishCard';
import { Dish } from '../types';

interface MenuSectionProps {
  title: string;
  dishes: Dish[];
  userAllergies: string[];
  icon: React.ReactNode;
  color: string;
  onReserveForDinner?: (dishId: string) => void;
  reservedDishes?: string[];
}

export function MenuSection({ 
  title, 
  dishes, 
  userAllergies, 
  icon, 
  color,
  onReserveForDinner,
  reservedDishes = []
}: MenuSectionProps) {
  const [expandedDish, setExpandedDish] = useState<string | null>(null);

  // ⚡ Vérifie si l'utilisateur a déjà réservé un plat
  const hasReservedAlready = reservedDishes.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className={`${color} p-4 rounded-t-xl`}>
        <div className="flex items-center space-x-3">
          <div className="text-white">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="bg-white/20 text-white px-2 py-1 rounded-full text-sm">
            {dishes.length} plat{dishes.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {dishes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Aucun plat disponible aujourd'hui
          </p>
        ) : (
          <>
            {dishes.map(dish => {
              // ⚡ Si un autre plat est déjà réservé, désactive ce bouton
              const anotherDishReserved = hasReservedAlready && !reservedDishes.includes(dish.id);

              return (
                <DishCard
                  key={dish.id}
                  dish={dish}
                  userConstraints={userAllergies}
                  showDetails={expandedDish === dish.id}
                  onToggleDetails={() =>
                    setExpandedDish(expandedDish === dish.id ? null : dish.id)
                  }
                  onReserveForDinner={anotherDishReserved ? undefined : onReserveForDinner}
                  isReservedForDinner={reservedDishes.includes(dish.id)}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
