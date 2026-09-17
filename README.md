<div align="center">
  <img src="public/favicon.svg" alt="Logo" width="120" />
  <h1>🎯 PalabraOculta</h1>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](#)
  [![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](#)
</div>

<br />

> El clásico juego del ahorcado, reconstruido como una experiencia web moderna:
> gamificación con monedas y logros, reto diario, desafíos asíncronos por
> enlace, y una interfaz con glassmorphism, partículas y parallax 3D.

---

## ✨ Características

### 🎮 Gamificación y economía
- **Monedas y Tienda (💰):** cada victoria otorga monedas según la dificultad
  elegida; gástalas para desbloquear categorías adicionales.
- **Pistas:** con suficientes monedas, revela una letra correcta al vuelo
  durante una partida en curso.
- **Logros:** se desbloquean automáticamente al ganar sin fallos, sobrevivir
  con un solo intento restante, ganar tu primera partida, o acumular una
  fortuna en monedas.
- **Rachas y ranking histórico:** la racha de victorias consecutivas se
  registra, y tus mejores 5 rachas quedan guardadas para consultarlas luego.

### 🌐 Interacción social
- **Reto a un amigo:** escribe una palabra secreta y genera un enlace (la
  palabra viaja codificada en Base64 en la URL) para que cualquier amigo la
  intente adivinar.
- **Reto Diario:** una palabra elegida con una semilla determinística por
  fecha, para que abrir la app varias veces el mismo día te presente
  siempre el mismo desafío — y paga el doble de monedas al ganarlo.

### 🎨 Interfaz
- **Parallax 3D** en el panel principal (`react-parallax-tilt`) y **fondo de
  partículas** interactivo (`@tsparticles/react`).
- **Tema claro/oscuro** y **color de acento** personalizables, con
  variables CSS para theming consistente.
- **Perfil de jugador:** avatar y nombre editables, guardados localmente.
- Animaciones de transición y modales con `framer-motion`, y confeti al
  ganar con `react-confetti`.

### 🔊 Sonido
- Efectos de sonido generados en tiempo real con la Web Audio API (sin
  archivos de audio que descargar), con control de volumen.

### ♿ Accesibilidad
- Se puede jugar por completo con el teclado físico (además del teclado en
  pantalla), con anuncios de estado para lectores de pantalla y navegación
  por foco en los modales.

---

## 🕹️ Cómo jugar

1. Al abrir la app se elige una palabra al azar de una categoría (o la que
   hayas seleccionado) y se dibuja el tablero.
2. Adivina letras usando el teclado en pantalla o tu teclado físico
   (A-Z, incluida la Ñ) antes de que se complete el dibujo del ahorcado.
3. Cada letra correcta revela todas sus apariciones en la palabra; cada
   letra incorrecta resta un intento. La cantidad de intentos disponibles
   depende de la dificultad (Fácil: 8, Normal: 6, Difícil: 4).
4. Gana monedas al acertar, gástalas en pistas o en la tienda, y compite
   contra tu propia racha o contra el Reto Diario.

---

## 🚀 Instalación y uso local

```bash
git clone https://github.com/Luiss2080/ahorcado-web.git
cd ahorcado-web
npm install
npm run dev
```

El servidor de desarrollo (Vite) queda disponible típicamente en
`http://localhost:5173`.

Otros comandos disponibles:

```bash
npm run build     # build de producción
npm run preview   # sirve el build de producción localmente
npm run lint      # linting con oxlint
```

---

## 🧪 Tests

El motor de juego y la lógica auxiliar tienen pruebas unitarias con
[Vitest](https://vitest.dev/) (y React Testing Library para componentes).
Para ejecutarlas:

```bash
npm test
```

---

## 🛠️ Tecnologías

- **[React 19](https://react.dev/)** + **[Vite](https://vitejs.dev/)** como
  base de la aplicación.
- **[framer-motion](https://www.framer.com/motion/)** para las animaciones
  y transiciones de los modales.
- **[@tsparticles/react](https://particles.js.org/)** para el fondo de
  partículas interactivo.
- **[react-parallax-tilt](https://www.npmjs.com/package/react-parallax-tilt)**
  para el efecto de parallax 3D del panel principal.
- **[react-confetti](https://www.npmjs.com/package/react-confetti)** para la
  celebración al ganar.
- **[lucide-react](https://lucide.dev/)** para los íconos.
- **Web Audio API** nativa para los efectos de sonido (sin librerías ni
  archivos de audio).
- **[Vitest](https://vitest.dev/)** + **React Testing Library** para las
  pruebas.
- **[oxlint](https://oxc.rs/docs/guide/usage/linter.html)** para linting.
- CSS puro con variables (theming claro/oscuro) — sin framework de estilos.

---

## 📁 Arquitectura

- `src/hooks/useGameEngine.js`: el motor lógico del juego — estado de la
  partida, economía (monedas/tienda/logros), temporizador y reto diario.
- `src/hooks/useSoundEffects.js`: efectos de sonido aislados vía Web Audio
  API.
- `src/data/dictionary.js`: categorías y palabras, y la selección aleatoria.
- `src/components/`: componentes de UI (teclado, figura del ahorcado,
  modales, notificaciones).
- `legacy/`: la versión original en HTML/CSS/JS puro (sin dependencias),
  conservada como referencia histórica del proyecto — no forma parte de la
  build de Vite ni se mantiene activamente.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT — ver [`LICENSE`](LICENSE) para el
texto completo.

---

<div align="center">
  <i>"El código debe decir la verdad, y la interfaz debe maravillar a la vista."</i>
</div>
