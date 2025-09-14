import { WeeklyMenu, User, QueueInfo, Reservation } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Marie Dupont',
  email: 'marie.dupont@mines-albi.fr',
  emailVerified: true,
  dietaryConstraints: ['gluten','poisson'],
  isAdmin: false,
  cardBalance: 45.80,
  reservations: []
};

export const mockAdmin: User = {
  id: '2',
  name: 'Chef Cuisine',
  email: 'chef@mines-albi.fr',
  emailVerified: true,
  dietaryConstraints: [],
  isAdmin: true,
  cardBalance: 0,
  reservations: []
};

export const mockReservations: Reservation[] = [
  {
    id: '1',
    userId: '1',
    dishId: '1',
    date: '2025-01-13',
    mealType: 'dinner',
    status: 'confirmed',
    createdAt: '2025-01-12T14:30:00Z'
  }
];

export const mockWeeklyMenu: WeeklyMenu = {
  week: 'Semaine du 13-17 Janvier 2025',
  menus: [
    {
      date: '2025-01-13',
      volaille: [
        {
          id: '1',
          name: 'Poulet aux herbes de Provence',
          description: 'Suprême de poulet fermier mariné aux herbes fraîches',
          price: 3.40,
          category: 'volaille',
          allergens: ['lactose'],
          imageUrl: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
          sourcing: {
            organic: true,
            local: true,
            origin: 'Ferme du Tarn (15km)'
          },
          nutritionalInfo: {
            calories: 285,
            proteins: 32,
            carbs: 2,
            fats: 15,
            fiber: 0,
            sugar: 1,
            salt: 0.8
          },
          availableForDinner: true
        },
        {
          id: '2',
          name: 'Escalope de dinde panée',
          description: 'Escalope de dinde française, panure maison',
          price: 3.10,
          category: 'volaille',
          allergens: ['gluten'],
          imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
          sourcing: {
            organic: false,
            local: true,
            origin: 'Élevage Occitanie'
          },
          nutritionalInfo: {
            calories: 320,
            proteins: 28,
            carbs: 12,
            fats: 18,
            fiber: 1,
            sugar: 2,
            salt: 1.2
          },
          availableForDinner: false
        }
      ],
      viande: [
        {
          id: '3',
          name: 'Bœuf bourguignon',
          description: 'Mijoté de bœuf aux légumes et vin rouge',
          price: 3.50,
          category: 'viande',
          allergens: ['sulfites'],
          imageUrl: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400',
          sourcing: {
            organic: false,
            local: true,
            origin: 'Boucherie locale Albi'
          },
          nutritionalInfo: {
            calories: 380,
            proteins: 35,
            carbs: 8,
            fats: 22,
            fiber: 3,
            sugar: 4,
            salt: 1.5
          },
          availableForDinner: true
        }
      ],
      poisson: [
        {
          id: '4',
          name: 'Saumon grillé au citron',
          description: 'Filet de saumon atlantique grillé, sauce citron',
          price: 4.20,
          category: 'poisson',
          allergens: ['poisson'],
          imageUrl: 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400',
          sourcing: {
            organic: true,
            local: false,
            origin: 'Élevage responsable Norvège'
          },
          nutritionalInfo: {
            calories: 340,
            proteins: 38,
            carbs: 0,
            fats: 20,
            fiber: 0,
            sugar: 0,
            salt: 0.9
          },
          availableForDinner: true
        }
      ]
    }
  ]
};

export const mockQueueInfo: QueueInfo = {
  volaille: { current: 8, estimated: 5 },
  viande: { current: 12, estimated: 8 },
  poisson: { current: 4, estimated: 3 }
};