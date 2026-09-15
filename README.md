<div align="center">
  <img src="public/favicon.svg" alt="Logo" width="120" />
  <h1>🎯 Ahorcado Web Premium</h1>
  <p><strong>El clásico juego del Ahorcado, rediseñado para el futuro de la web.</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](#)
  [![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](#)
</div>

<br />

> **Ahorcado Web Premium** no es solo un juego, es una experiencia interactiva completa. Desarrollado con los más altos estándares de diseño (Glassmorphism), animaciones fluidas, y un motor robusto impulsado por React y Vite.

---

## ✨ Características Principales

### 🎮 Gamificación y Economía
- **Tienda y Monedas (💰):** Gana monedas por cada victoria. Gástalas en la Tienda para desbloquear nuevas categorías secretas (*Películas*, *Videojuegos*).
- **Sistema de Logros (🏆):** Un motor de trofeos en tiempo real que recompensa tu estilo de juego. Gana de forma impecable o conviértete en millonario para desbloquear medallas.
- **Power-Ups (💡):** ¿A punto de perder? Gasta tus monedas usando "Pistas" para que el juego revele letras correctas en el tablero.

### 🌐 Interacción Social
- **Multijugador Asíncrono (Desafíos):** Escribe tu propia palabra secreta. La aplicación generará un "Enlace Mágico" encriptado (Base64). ¡Envíalo a tus amigos para retarlos!
- **Reto Diario (📅):** Un modo especial donde todos los jugadores del mundo compiten adivinando la *misma palabra exacta*, sincronizada por semilla diaria. ¡Otorga el doble de recompensas!

### 🎨 The Ultimate UI (Diseño Gráfico)
- **Físicas y Parallax 3D:** El contenedor principal reacciona dinámicamente a los movimientos de tu ratón usando `react-parallax-tilt`.
- **Fondo de Partículas Dinámico:** Un lienzo estelar impulsado por `tsparticles` que interactúa con tu cursor.
- **Personalización Extrema:** Elige tu Avatar, Nombre, Tema (Claro/Oscuro) y **Color de Acento** (Neón, Púrpura, Azul, Naranja) usando variables CSS dinámicas.

### 🔊 Inmersión Sensorial
- **Audio Generativo Nativo:** Adiós a los MP3 pesados. Los sonidos de tecleo, victorias y derrotas se generan en tiempo real utilizando sintetizadores nativos (*Web Audio API*).
- **Mixer de Audio:** Controla el volumen exacto de los efectos con un deslizador analógico integrado.

---

## 🚀 Instalación y Uso Local

Para levantar este proyecto en tu máquina y disfrutarlo en desarrollo:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/ahorcado-web.git
   cd ahorcado-web
   ```

2. **Instalar Dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en Entorno de Desarrollo:**
   ```bash
   npm run dev
   ```
   *El servidor iniciará típicamente en `http://localhost:5173`*

4. **Compilar para Producción:**
   ```bash
   npm run build
   ```

---

## 🧪 Testing

Este proyecto está construido para ser robusto (Production-Ready). Utilizamos **Vitest** y **React Testing Library** para asegurar que el motor lógico jamás falle.

Para ejecutar la suite de pruebas unitarias:
```bash
npm run test
```

---

## 📁 Arquitectura (SDD)

El código sigue un paradigma de **Separación de Responsabilidades** (SoC):
- `src/hooks/useGameEngine.js`: El corazón lógico. Maneja el estado global, la economía, el temporizador y los logros.
- `src/hooks/useSoundEffects.js`: Controlador aislado de la API Web de Audio.
- `src/components/`: Componentes modulares y reutilizables de UI. Los modales se basan en `framer-motion` para animaciones ricas.

---

<div align="center">
  <i>"El código debe decir la verdad, y la interfaz debe maravillar a la vista."</i>
</div>
