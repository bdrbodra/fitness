import "dotenv/config";
import { prisma } from "../lib/prisma";

// Macros per 100g, standard reference values (raw/cooked as noted in the name).
const FOODS: [string, string, number, number, number, number][] = [
  // name_it, name_en, kcal, protein, carbs, fat (per 100g)
  ["Petto di pollo, alla griglia", "Chicken breast, grilled", 165, 31, 0, 3.6],
  ["Petto di pollo, crudo", "Chicken breast, raw", 120, 22.5, 0, 2.6],
  ["Manzo magro, ai ferri", "Lean beef, grilled", 217, 26, 0, 12],
  ["Salmone, al forno", "Salmon, baked", 208, 20, 0, 13],
  ["Tonno al naturale", "Tuna, canned in water", 116, 26, 0, 1],
  ["Uova intere", "Whole eggs", 155, 13, 1.1, 11],
  ["Albume d'uovo", "Egg whites", 52, 11, 0.7, 0.2],
  ["Yogurt greco 0%", "Greek yoghurt, 0%", 59, 10, 3.6, 0.4],
  ["Fiocchi di latte magro", "Low-fat cottage cheese", 72, 12, 3, 1],
  ["Riso basmati, cotto", "Basmati rice, cooked", 130, 2.7, 28, 0.3],
  ["Riso bianco, cotto", "White rice, cooked", 130, 2.4, 28, 0.3],
  ["Pasta di semola, cotta", "Durum pasta, cooked", 158, 5.8, 31, 0.9],
  ["Patate, bollite", "Potatoes, boiled", 87, 1.9, 20, 0.1],
  ["Patate dolci, al forno", "Sweet potato, baked", 90, 2, 21, 0.1],
  ["Pane integrale", "Wholemeal bread", 247, 13, 41, 3.4],
  ["Avena, a crudo", "Rolled oats, dry", 389, 17, 66, 7],
  ["Quinoa, cotta", "Quinoa, cooked", 120, 4.4, 21, 1.9],
  ["Fagioli neri, cotti", "Black beans, cooked", 132, 8.9, 24, 0.5],
  ["Lenticchie, cotte", "Lentils, cooked", 116, 9, 20, 0.4],
  ["Ceci, cotti", "Chickpeas, cooked", 164, 8.9, 27, 2.6],
  ["Broccoli, al vapore", "Broccoli, steamed", 35, 2.4, 7.2, 0.4],
  ["Spinaci, cotti", "Spinach, cooked", 23, 2.9, 3.8, 0.3],
  ["Zucchine, cotte", "Zucchini, cooked", 17, 1.2, 3.1, 0.3],
  ["Carote, crude", "Carrots, raw", 41, 0.9, 10, 0.2],
  ["Insalata mista", "Mixed salad greens", 15, 1.4, 2.9, 0.2],
  ["Pomodori", "Tomatoes", 18, 0.9, 3.9, 0.2],
  ["Banana", "Banana", 89, 1.1, 23, 0.3],
  ["Mela", "Apple", 52, 0.3, 14, 0.2],
  ["Mirtilli", "Blueberries", 57, 0.7, 14, 0.3],
  ["Arancia", "Orange", 47, 0.9, 12, 0.1],
  ["Mandorle", "Almonds", 579, 21, 22, 50],
  ["Noci", "Walnuts", 654, 15, 14, 65],
  ["Burro di arachidi", "Peanut butter", 588, 25, 20, 50],
  ["Avocado", "Avocado", 160, 2, 8.5, 15,],
  ["Olio extravergine d'oliva", "Extra virgin olive oil", 884, 0, 0, 100],
  ["Latte parzialmente scremato", "Semi-skimmed milk", 46, 3.4, 5, 1.6],
  ["Latte di mandorla, non zuccherato", "Almond milk, unsweetened", 15, 0.6, 0.6, 1.2],
  ["Formaggio grana, grattugiato", "Grana-type hard cheese, grated", 392, 33, 0, 29],
  ["Mozzarella light", "Light mozzarella", 253, 25, 3, 16],
  ["Whey protein, in polvere", "Whey protein powder", 380, 75, 8, 6],
  ["Pane di segale", "Rye bread", 259, 8.5, 48, 3.3],
  ["Tofu", "Tofu", 76, 8, 1.9, 4.8],
  ["Gamberi, cotti", "Shrimp, cooked", 99, 24, 0.2, 0.3],
  ["Tacchino, petto alla griglia", "Turkey breast, grilled", 135, 30, 0, 1,],
  ["Miele", "Honey", 304, 0.3, 82, 0],
];

async function main() {
  for (const [nameIt, nameEn, kcal100, protein100, carbs100, fat100] of FOODS) {
    await prisma.food.upsert({
      where: { id: nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: { nameIt, nameEn, kcal100, protein100, carbs100, fat100 },
      create: {
        id: nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        nameIt,
        nameEn,
        kcal100,
        protein100,
        carbs100,
        fat100,
      },
    });
  }
  console.log(`Seeded ${FOODS.length} foods.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
