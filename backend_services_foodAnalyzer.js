// AI Food Safety Analyzer
const foodAnimalMapping = {
  'carrot': ['rabbits', 'horses', 'deer', 'goats', 'guinea pigs'],
  'apple': ['horses', 'deer', 'pigs', 'goats', 'rabbits'],
  'banana': ['primates', 'birds', 'squirrels'],
  'fish': ['cats', 'birds', 'reptiles', 'otters'],
  'chicken': ['cats', 'dogs', 'birds of prey'],
  'rice': ['all animals'],
  'bread': ['all animals'],
  'lettuce': ['rabbits', 'guinea pigs', 'deer', 'goats'],
  'spinach': ['rabbits', 'guinea pigs', 'horses'],
  'pumpkin': ['pigs', 'horses', 'deer', 'squirrels'],
  'pea': ['horses', 'rabbits', 'primates', 'squirrels'],
  'corn': ['horses', 'pigs', 'deer', 'squirrels', 'birds'],
  'oat': ['horses', 'pigs', 'deer', 'rabbits'],
  'bean': ['horses', 'deer', 'primates'],
  'nut': ['squirrels', 'primates', 'birds'],
  'seed': ['birds', 'squirrels', 'rabbits'],
  'meat': ['cats', 'dogs', 'reptiles', 'birds of prey']
};

const unsafeFoods = [
  'chocolate',
  'avocado',
  'onion',
  'garlic',
  'grapes',
  'raisins',
  'xylitol',
  'caffeine',
  'raw potato',
  'raw bean',
  'mushroom',
  'salt',
  'sugar',
  'alcohol',
  'moldy food',
  'spoiled food'
];

const analyzeFoodItems = (foodItems) => {
  const analysis = [];

  foodItems.forEach(item => {
    const foodName = item.name.toLowerCase();
    const isUnsafe = unsafeFoods.some(unsafeFood => foodName.includes(unsafeFood));
    
    let suitableFor = [];
    
    if (!isUnsafe) {
      for (const [food, animals] of Object.entries(foodAnimalMapping)) {
        if (foodName.includes(food)) {
          suitableFor = [...new Set([...suitableFor, ...animals])];
        }
      }
    }

    analysis.push({
      ...item,
      isUnsafe,
      suitableFor: isUnsafe ? [] : suitableFor,
      aiAnalysis: isUnsafe 
        ? `⚠️ WARNING: ${item.name} contains potentially harmful ingredients for animals`
        : `✅ Safe: ${item.name} is suitable for ${suitableFor.length > 0 ? suitableFor.join(', ') : 'assessment pending'}`
    });
  });

  return analysis;
};

module.exports = { analyzeFoodItems, unsafeFoods, foodAnimalMapping };