// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

/**
 * Creates a matrix-style animation background
 */
function createMatrixBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-bg';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.03;
    pointer-events: none;
  `;
  
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  const matrixArray = matrix.split("");
  
  const fontSize = 10;
  const columns = canvas.width / fontSize;
  const drops = [];
  
  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#6c757d';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  setInterval(draw, 35);
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/**
 * Creates and adds a map component to the bottom of the page
 */
function createMapComponent() {
  const mapSection = document.createElement('section');
  mapSection.className = 'map-section';
  mapSection.innerHTML = `
    <div class="map-container">
      <div class="map-content">
        <h2>Interactive Map</h2>
        <div class="map-wrapper">
          <div id="map" class="map"></div>
          <div class="map-overlay">
            <div class="map-info">
              <h3>Location Details</h3>
              <p>Click on the map to explore different locations</p>
              <div class="map-controls">
                <button class="map-btn" onclick="zoomIn()">Zoom In</button>
                <button class="map-btn" onclick="zoomOut()">Zoom Out</button>
                <button class="map-btn" onclick="resetMap()">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add the map section before the footer
  const footer = document.querySelector('footer');
  if (footer) {
    footer.parentNode.insertBefore(mapSection, footer);
  } else {
    document.body.appendChild(mapSection);
  }
  
  // Initialize the map
  initializeMap();
}

/**
 * Initializes the interactive map
 */
function initializeMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  // Create a simple interactive map using SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('viewBox', '0 0 800 400');
  svg.style.cssText = `
    background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    border-radius: 8px;
    cursor: crosshair;
  `;
  
  // Add map elements
  const mapContent = `
    <!-- Continents -->
    <g class="continents">
      <path d="M 100 150 Q 150 100 200 150 Q 250 200 300 150 Q 350 100 400 150 L 400 200 Q 350 250 300 200 Q 250 150 200 200 Q 150 250 100 200 Z" 
            fill="#4a7c59" stroke="#2d4a3e" stroke-width="2" class="continent" data-name="North America"/>
      <path d="M 450 200 Q 500 150 550 200 Q 600 250 650 200 Q 700 150 750 200 L 750 250 Q 700 300 650 250 Q 600 200 550 250 Q 500 300 450 250 Z" 
            fill="#4a7c59" stroke="#2d4a3e" stroke-width="2" class="continent" data-name="Europe"/>
      <path d="M 200 300 Q 250 250 300 300 Q 350 350 400 300 Q 450 250 500 300 L 500 350 Q 450 400 400 350 Q 350 300 300 350 Q 250 400 200 350 Z" 
            fill="#4a7c59" stroke="#2d4a3e" stroke-width="2" class="continent" data-name="Africa"/>
    </g>
    
    <!-- Oceans -->
    <rect x="0" y="0" width="800" height="400" fill="#1e3a8a" opacity="0.3"/>
    
    <!-- Grid lines -->
    <g class="grid" stroke="#ffffff" stroke-width="0.5" opacity="0.2">
      <line x1="0" y1="0" x2="800" y2="0"/>
      <line x1="0" y1="50" x2="800" y2="50"/>
      <line x1="0" y1="100" x2="800" y2="100"/>
      <line x1="0" y1="150" x2="800" y2="150"/>
      <line x1="0" y1="200" x2="800" y2="200"/>
      <line x1="0" y1="250" x2="800" y2="250"/>
      <line x1="0" y1="300" x2="800" y2="300"/>
      <line x1="0" y1="350" x2="800" y2="350"/>
      <line x1="0" y1="400" x2="800" y2="400"/>
      
      <line x1="0" y1="0" x2="0" y2="400"/>
      <line x1="100" y1="0" x2="100" y2="400"/>
      <line x1="200" y1="0" x2="200" y2="400"/>
      <line x1="300" y1="0" x2="300" y2="400"/>
      <line x1="400" y1="0" x2="400" y2="400"/>
      <line x1="500" y1="0" x2="500" y2="400"/>
      <line x1="600" y1="0" x2="600" y2="400"/>
      <line x1="700" y1="0" x2="700" y2="400"/>
      <line x1="800" y1="0" x2="800" y2="400"/>
    </g>
    
    <!-- Interactive points -->
    <circle cx="250" cy="175" r="8" fill="#ef4444" class="map-point" data-name="New York"/>
    <circle cx="600" cy="225" r="8" fill="#ef4444" class="map-point" data-name="London"/>
    <circle cx="350" cy="325" r="8" fill="#ef4444" class="map-point" data-name="Cairo"/>
    
    <!-- Labels -->
    <text x="250" y="195" text-anchor="middle" fill="#ffffff" font-size="12" class="map-label">New York</text>
    <text x="600" y="245" text-anchor="middle" fill="#ffffff" font-size="12" class="map-label">London</text>
    <text x="350" y="345" text-anchor="middle" fill="#ffffff" font-size="12" class="map-label">Cairo</text>
  `;
  
  svg.innerHTML = mapContent;
  mapElement.appendChild(svg);
  
  // Add interactivity
  addMapInteractivity(svg);
}

/**
 * Adds interactivity to the map
 */
function addMapInteractivity(svg) {
  const continents = svg.querySelectorAll('.continent');
  const points = svg.querySelectorAll('.map-point');
  
  // Continent hover effects
  continents.forEach(continent => {
    continent.addEventListener('mouseenter', (e) => {
      e.target.style.fill = '#6b7280';
      showTooltip(e.target.dataset.name, e.clientX, e.clientY);
    });
    
    continent.addEventListener('mouseleave', (e) => {
      e.target.style.fill = '#4a7c59';
      hideTooltip();
    });
  });
  
  // Point click effects
  points.forEach(point => {
    point.addEventListener('click', (e) => {
      e.target.style.fill = '#fbbf24';
      showLocationInfo(e.target.dataset.name);
    });
    
    point.addEventListener('mouseenter', (e) => {
      e.target.style.r = '12';
      showTooltip(e.target.dataset.name, e.clientX, e.clientY);
    });
    
    point.addEventListener('mouseleave', (e) => {
      e.target.style.r = '8';
      hideTooltip();
    });
  });
}

/**
 * Shows a tooltip for map elements
 */
function showTooltip(text, x, y) {
  let tooltip = document.getElementById('map-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'map-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      z-index: 1000;
      transform: translate(-50%, -100%);
      margin-top: -10px;
    `;
    document.body.appendChild(tooltip);
  }
  
  tooltip.textContent = text;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
  tooltip.style.display = 'block';
}

/**
 * Hides the tooltip
 */
function hideTooltip() {
  const tooltip = document.getElementById('map-tooltip');
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

/**
 * Shows location information
 */
function showLocationInfo(locationName) {
  const info = {
    'New York': 'The Big Apple - A global center for finance, culture, and innovation.',
    'London': 'The capital of England - A historic city with modern influence.',
    'Cairo': 'The capital of Egypt - Home to ancient wonders and modern life.'
  };
  
  const infoDiv = document.querySelector('.map-info p');
  if (infoDiv && info[locationName]) {
    infoDiv.textContent = info[locationName];
  }
}

// Global map functions for buttons
window.zoomIn = function() {
  const svg = document.querySelector('#map svg');
  if (svg) {
    const currentViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const newViewBox = currentViewBox.map((val, i) => i < 2 ? val * 0.8 : val * 1.2);
    svg.setAttribute('viewBox', newViewBox.join(' '));
  }
};

window.zoomOut = function() {
  const svg = document.querySelector('#map svg');
  if (svg) {
    const currentViewBox = svg.getAttribute('viewBox').split(' ').map(Number);
    const newViewBox = currentViewBox.map((val, i) => i < 2 ? val * 1.2 : val * 0.8);
    svg.setAttribute('viewBox', newViewBox.join(' '));
  }
};

window.resetMap = function() {
  const svg = document.querySelector('#map svg');
  if (svg) {
    svg.setAttribute('viewBox', '0 0 800 400');
  }
};

// Initialize the map and matrix background when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    createMatrixBackground();
    createMapComponent();
  }, 1000);
});
