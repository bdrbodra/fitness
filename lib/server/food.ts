interface Macro {
  grams: number;
  food: { kcal100: number; protein100: number; carbs100: number; fat100: number };
}

export function itemMacros(item: Macro) {
  const f = item.grams / 100;
  return {
    kcal: Math.round(item.food.kcal100 * f),
    protein: Math.round(item.food.protein100 * f),
    carbs: Math.round(item.food.carbs100 * f),
    fat: Math.round(item.food.fat100 * f),
  };
}

export function mealMacros(items: Macro[]) {
  return items.reduce(
    (acc, it) => {
      const m = itemMacros(it);
      acc.kcal += m.kcal;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fat += m.fat;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}
