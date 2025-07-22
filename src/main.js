import './style.css';
import { GameEngine } from './js/GameEngine.js';
import { BootSequence } from './js/BootSequence.js';

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const bootSequence = new BootSequence();
  const gameEngine = new GameEngine();
  
  // Start boot sequence
  bootSequence.start().then(() => {
    // After boot, initialize the main game
    gameEngine.initialize();
  });
});
