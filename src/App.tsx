import React, { useState } from 'react';
import { Header } from './components/Header';
import { QueueInfo } from './components/QueueInfo';
import { WeeklyMenuView } from './components/WeeklyMenuView';
import { UserProfile } from './components/UserProfile';
import { AdminDashboard } from './components/AdminDashboard';
import { MealCardModal } from './components/MealCardModal';
import { AuthModal } from './components/AuthModal';
import { mockUser, mockWeeklyMenu, mockQueueInfo } from './data/mockData';
import { Reservation } from './types';

function App() {
  const [user, setUser] = useState(mockUser || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showMealCard, setShowMealCard] = useState(false);
  const [showAuth, setShowAuth] = useState(true);

  const handleUpdateDietaryConstraints = (newConstraints: string[]) => {
    setUser(prev => ({
      ...prev,
      dietaryConstraints: newConstraints
    }));
  };

  const handleRecharge = (amount: number) => {
    setUser(prev => ({
      ...prev,
      cardBalance: prev.cardBalance + amount
    }));
  };

  const handleReserveForDinner = (dishId: string) => {
    const newReservation: Reservation = {
      id: Date.now().toString(),
      userId: user.id,
      dishId,
      date: new Date().toISOString().split('T')[0],
      mealType: 'dinner',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    setUser(prev => ({
      ...prev,
      reservations: [...prev.reservations, newReservation]
    }));
  };

  const handleLogin = (email: string, password: string) => {
    // Vérification admin
    if (email === 'chef@mines-albi.fr' && password === '123') {
      setIsAuthenticated(true);
      setShowAdminDashboard(true);
      setShowAuth(false);
      setUser(null); // pas besoin de mockUser pour l'admin
      return;
    }

    // Utilisateur normal
    setUser(mockUser);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleRegister = (name: string, email: string, password: string) => {
    console.log('Registration:', { name, email, password });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setShowAuth(true);
    setShowAdminDashboard(false);
  };

  if (!isAuthenticated || (!user && !showAdminDashboard)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cantine - École des Mines d'Albi
          </h1>
          <p className="text-gray-600 mb-6">Connectez-vous pour accéder au menu</p>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
        
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showAdminDashboard ? (
        <AdminDashboard onClose={handleLogout} />
      ) : (
        <>
          <Header
            user={user}
            onUserClick={() => setShowUserProfile(true)}
            onAdminClick={() => setShowAdminDashboard(true)}
            onCardClick={() => setShowMealCard(true)}
            onLogout={handleLogout}
          />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <QueueInfo queueInfo={mockQueueInfo} />
            <WeeklyMenuView 
              weeklyMenu={mockWeeklyMenu} 
              user={user} 
              onReserveForDinner={handleReserveForDinner}
            />
          </main>

          {showUserProfile && (
            <UserProfile
              user={user}
              onClose={() => setShowUserProfile(false)}
              onUpdateDietaryConstraints={handleUpdateDietaryConstraints}
            />
          )}

          {showMealCard && (
            <MealCardModal
              user={user}
              onClose={() => setShowMealCard(false)}
              onRecharge={handleRecharge}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
