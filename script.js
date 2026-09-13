const PALABRAS = {
  Frutas: ['SANDIA', 'MANZANA', 'PLATANO', 'DURAZNO', 'FRUTILLA'],
  Animales: ['ELEFANTE', 'JIRAFA', 'COCODRILO', 'DELFIN', 'AGUILA'],
  Países: ['BOLIVIA', 'ARGENTINA', 'COLOMBIA', 'ECUADOR', 'PARAGUAY'],
  Profesiones: ['INGENIERO', 'DOCTOR', 'PROFESOR', 'ABOGADO', 'ARQUITECTO'],
};

const PARTES_CUERPO = [
  'parte-cabeza',
  'parte-cuerpo',
  'parte-brazo-izq',
  'parte-brazo-der',
  'parte-pierna-izq',
  'parte-pierna-der',
];

const ABECEDARIO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

let palabraSecreta = '';
let letrasAdivinadas = new Set();
let letrasIncorrectas = 0;
let juegoTerminado = false;

const categoriaEl = document.getElementById('categoria');
const palabraEl = document.getElementById('palabra');
const restantesEl = document.getElementById('restantes');
const tecladoEl = document.getElementById('teclado');
const resultadoEl = document.getElementById('resultado');

function elegirPalabra() {
  const categorias = Object.keys(PALABRAS);
  const categoria = categorias[Math.floor(Math.random() * categorias.length)];
  const lista = PALABRAS[categoria];
  const palabra = lista[Math.floor(Math.random() * lista.length)];
  return { categoria, palabra };
}

function iniciarJuego() {
  const { categoria, palabra } = elegirPalabra();
  palabraSecreta = palabra;
  categoriaEl.textContent = categoria;
  letrasAdivinadas = new Set();
  letrasIncorrectas = 0;
  juegoTerminado = false;

  PARTES_CUERPO.forEach((id) => { document.getElementById(id).hidden = true; });
  resultadoEl.hidden = true;
  resultadoEl.className = 'resultado';
  actualizarRestantes();
  dibujarPalabra();
  dibujarTeclado();
}

function dibujarPalabra() {
  palabraEl.textContent = palabraSecreta
    .split('')
    .map((letra) => (letrasAdivinadas.has(letra) ? letra : '_'))
    .join(' ');
}

function actualizarRestantes() {
  restantesEl.textContent = PARTES_CUERPO.length - letrasIncorrectas;
}

function dibujarTeclado() {
  tecladoEl.innerHTML = '';
  ABECEDARIO.forEach((letra) => {
    const btn = document.createElement('button');
    btn.textContent = letra;
    btn.addEventListener('click', () => intentarLetra(letra, btn));
    tecladoEl.appendChild(btn);
  });
}

function intentarLetra(letra, btn) {
  if (juegoTerminado) return;
  btn.disabled = true;

  if (palabraSecreta.includes(letra)) {
    letrasAdivinadas.add(letra);
    btn.classList.add('correcta');
    dibujarPalabra();
    if (!palabraEl.textContent.includes('_')) {
      terminarJuego(true);
    }
  } else {
    btn.classList.add('incorrecta');
    document.getElementById(PARTES_CUERPO[letrasIncorrectas]).hidden = false;
    letrasIncorrectas++;
    actualizarRestantes();
    if (letrasIncorrectas >= PARTES_CUERPO.length) {
      terminarJuego(false);
    }
  }
}

function terminarJuego(gano) {
  juegoTerminado = true;
  tecladoEl.querySelectorAll('button').forEach((b) => { b.disabled = true; });
  resultadoEl.hidden = false;
  if (gano) {
    resultadoEl.textContent = '🎉 ¡Ganaste!';
    resultadoEl.classList.add('ganado');
  } else {
    resultadoEl.textContent = `💀 Perdiste. La palabra era: ${palabraSecreta}`;
    resultadoEl.classList.add('perdido');
    palabraEl.textContent = palabraSecreta.split('').join(' ');
  }
}

document.getElementById('btn-reiniciar').addEventListener('click', iniciarJuego);

iniciarJuego();
