import { DataBasicsDate } from '@/global.interface'

/**
 * @description
 * Nested object for nutritional information.
 * Can be expanded later with carbs, fat, etc.
 */
export interface IIngredients {
  protein: number
  // TODO: For now I only include protein
  // carbs: number
  // fat: number
}

export interface IMeal extends DataBasicsDate {
  id: string
  ownerId: string
  name: string // name of food, e.g., "Chicken Breast"
  amount: number // 1
  unit: string // e.g., 'g', 'ml', 'serving'
  labels: string[] // e.g., 'Breakfast', 'Post-Workout'
  kcal: number
  ingredients: IIngredients
}
