import React from 'react';
import { User, Settings, Bell, CreditCard, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onUserClick: () => void;
  onAdminClick: () => void;
  onCardClick: () => void;
  onLogout: () => void;
}

export function Header({ user, onUserClick, onAdminClick, onCardClick, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Cantine - École des Mines d'Albi
              </h1>
              <p className="text-sm text-gray-600">Restaurant Universitaire</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <button
              onClick={onCardClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">{user.cardBalance.toFixed(2)}€</span>
            </button>
            
            {user.isAdmin && (
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </button>
            )}
            
            <button
              onClick={onUserClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-600 flex items-center">
                  Étudiant
                  {user.emailVerified && (
                    <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
              </div>
            </button>
            
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}