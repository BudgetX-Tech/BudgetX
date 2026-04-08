

export type CategoryType = 'EXPENSE' | 'INCOME';

export interface Category {
  name: string;
  icon: string; // Storing the name of the lucide icon
  color: string;
  type: CategoryType;
}

export const PREDEFINED_CATEGORIES: Category[] = [
  { name: 'Food', icon: 'Utensils', color: 'hsl(25, 95%, 53%)', type: 'EXPENSE' },
  { name: 'Transport', icon: 'Car', color: 'hsl(217, 91%, 60%)', type: 'EXPENSE' },
  { name: 'Shopping', icon: 'ShoppingBag', color: 'hsl(280, 68%, 60%)', type: 'EXPENSE' },
  { name: 'Bills', icon: 'Receipt', color: 'hsl(0, 84%, 60%)', type: 'EXPENSE' },
  { name: 'Entertainment', icon: 'Film', color: 'hsl(330, 81%, 60%)', type: 'EXPENSE' },
  { name: 'Health', icon: 'Heart', color: 'hsl(142, 70%, 45%)', type: 'EXPENSE' },
  { name: 'Education', icon: 'GraduationCap', color: 'hsl(199, 89%, 48%)', type: 'EXPENSE' },
  { name: 'Travel', icon: 'Plane', color: 'hsl(262, 83%, 58%)', type: 'EXPENSE' },
  { name: 'Groceries', icon: 'Apple', color: 'hsl(142, 55%, 42%)', type: 'EXPENSE' },
  { name: 'Rent', icon: 'Home', color: 'hsl(38, 92%, 50%)', type: 'EXPENSE' },
  { name: 'Salary', icon: 'Briefcase', color: 'hsl(142, 70%, 45%)', type: 'INCOME' },
  { name: 'Other', icon: 'MoreHorizontal', color: 'hsl(222, 10%, 55%)', type: 'EXPENSE' },
] as const;
