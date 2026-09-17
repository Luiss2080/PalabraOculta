export const PALABRAS = {
  Frutas: ['SANDIA', 'MANZANA', 'PLATANO', 'DURAZNO', 'FRUTILLA', 'NARANJA', 'UVA', 'KIWI', 'MANGO'],
  Animales: ['ELEFANTE', 'JIRAFA', 'COCODRILO', 'DELFIN', 'AGUILA', 'TIGRE', 'LEON', 'PANTERA', 'CANGURO'],
  Países: ['BOLIVIA', 'ARGENTINA', 'COLOMBIA', 'ECUADOR', 'PARAGUAY', 'MEXICO', 'CHILE', 'PERU', 'ESPAÑA'],
  Profesiones: ['INGENIERO', 'DOCTOR', 'PROFESOR', 'ABOGADO', 'ARQUITECTO', 'PROGRAMADOR', 'DISENADOR'],
  // These two match the ShopModal purchasable unlocks ('cat_movies', 'cat_games').
  // They must stay in sync with ShopModal.ITEMS - without them, selecting a
  // purchased category crashed getRandomWord (PALABRAS[cat] was undefined).
  Películas: ['TITANIC', 'GLADIADOR', 'MATRIX', 'AVATAR', 'JOKER', 'INTERESTELAR', 'GRAVEDAD', 'COCO'],
  Videojuegos: ['MINECRAFT', 'FORTNITE', 'TETRIS', 'ZELDA', 'PACMAN', 'DOOM', 'PORTAL', 'MARIO'],
};

export const getRandomWord = (category = null) => {
  const categories = Object.keys(PALABRAS);
  // Guard against an unknown/empty category (e.g. stale data, a typo, or a
  // category removed in a future update) instead of crashing on `undefined`.
  const selectedCategory = category && PALABRAS[category]
    ? category
    : categories[Math.floor(Math.random() * categories.length)];
  const list = PALABRAS[selectedCategory];
  const word = list[Math.floor(Math.random() * list.length)];
  return { category: selectedCategory, word };
};
