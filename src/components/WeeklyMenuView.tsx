import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuSection } from './MenuSection';
import { WeeklyMenu, User } from '../types';

interface WeeklyMenuViewProps {
  weeklyMenu: WeeklyMenu;
  user: User;
  onReserveForDinner?: (dishId: string) => void;
}

export function WeeklyMenuView({ weeklyMenu, user, onReserveForDinner }: WeeklyMenuViewProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  const currentMenu = weeklyMenu.menus[selectedDay];
  
  const reservedDishIds = user.reservations
    .filter(r => r.status === 'confirmed' && r.mealType === 'dinner')
    .map(r => r.dishId);
  
  const menuIcons = {
    volaille: <span className="text-2xl">🐔</span>,
    viande: <span className="text-2xl">🥩</span>,
    poisson: <span className="text-2xl">🐟</span>
  };
  
  const menuColors = {
    volaille: 'bg-orange-500',
    viande: 'bg-red-500',
    poisson: 'bg-blue-500'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{weeklyMenu.week}</h1>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
            disabled={selectedDay === 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex space-x-2">
            {days.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDay === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setSelectedDay(Math.min(4, selectedDay + 1))}
            disabled={selectedDay === 4}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {currentMenu && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MenuSection
            title="Stand Volaille"
            dishes={currentMenu.volaille}
            userAllergies={user.dietaryConstraints}
            icon={menuIcons.volaille}
            color={menuColors.volaille}
            onReserveForDinner={onReserveForDinner}
            reservedDishes={reservedDishIds}
          />
          
          <MenuSection
            title="Stand Viande"
            dishes={currentMenu.viande}
            userAllergies={user.dietaryConstraints}
            icon={menuIcons.viande}
            color={menuColors.viande}
            onReserveForDinner={onReserveForDinner}
            reservedDishes={reservedDishIds}
          />
          
          <MenuSection
            title="Stand Poisson"
            dishes={currentMenu.poisson}
            userAllergies={user.dietaryConstraints}
            icon={menuIcons.poisson}
            color={menuColors.poisson}
            onReserveForDinner={onReserveForDinner}
            reservedDishes={reservedDishIds}
          />
        </div>
      )}
    </div>
  );
}