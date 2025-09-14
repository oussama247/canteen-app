export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'volaille' | 'viande' | 'poisson';
  sourcing: {
    organic: boolean;
    local: boolean;
    origin: string;
  };
  nutritionalInfo: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    fiber: number;
    sugar: number;
    salt: number;
  };
  imageUrl: string;
  availableForDinner: boolean;
  constraints: string[];
} 
 


export interface DailyMenu {
  date: string;
  volaille: Dish[];
  viande: Dish[];
  poisson: Dish[];
}

export interface WeeklyMenu {
  week: string;
  menus: DailyMenu[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
  cardBalance: number;
  reservations: Reservation[];
  dietaryConstraints: string[]; // ✅ nouveau champ

}

export interface Reservation {
  id: string;
  userId: string;
  dishId: string;
  date: string;
  mealType: 'lunch' | 'dinner';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface MealCard {
  id: string;
  userId: string;
  balance: number;
  lastRecharge: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'recharge' | 'payment';
  amount: number;
  description: string;
  date: string;
}

export interface QueueInfo {
  volaille: {
  imageUrl?: string;
    current: number;
    estimated: number; // minutes
  };
  viande: {
    current: number;
    estimated: number;
  };
  poisson: {
    current: number;
    estimated: number;
    fiber: number;
    sugar: number;
    salt: number;
  };
  availableForDinner: boolean;
}