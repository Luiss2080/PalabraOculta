export const PALABRAS = {
  Frutas: ['SANDIA', 'MANZANA', 'PLATANO', 'DURAZNO', 'FRUTILLA', 'NARANJA', 'UVA', 'KIWI', 'MANGO'],
  Animales: ['ELEFANTE', 'JIRAFA', 'COCODRILO', 'DELFIN', 'AGUILA', 'TIGRE', 'LEON', 'PANTERA', 'CANGURO'],
  Países: ['BOLIVIA', 'ARGENTINA', 'COLOMBIA', 'ECUADOR', 'PARAGUAY', 'MEXICO', 'CHILE', 'PERU', 'ESPAÑA'],
  Profesiones: ['INGENIERO', 'DOCTOR', 'PROFESOR', 'ABOGADO', 'ARQUITECTO', 'PROGRAMADOR', 'DISENADOR'],
};

export const getRandomWord = (category = null) => {
  const categories = Object.keys(PALABRAS);
  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
  const list = PALABRAS[selectedCategory];
  const word = list[Math.floor(Math.random() * list.length)];
  return { category: selectedCategory, word };
};
