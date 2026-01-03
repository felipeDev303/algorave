// ================================
// JAN.2 - 12 PRINCIPLES OF ANIMATION
// ================================

let frame = 0;

// Grid configuration
const COLS = 3;
const ROWS = 4;
let cellWidth, cellHeight;
let padding = 8;
const headerHeight = 50;

// Follow Through variables for principle 5
let followX = 0,
  followY = 0;
let followX2 = 0,
  followY2 = 0;
let followX3 = 0,
  followY3 = 0;

// Particles for secondary action
let particles = [];

// Principles data
const principles = [
  { num: "01", name: "SQUASH & STRETCH", short: "Deformación" },
  { num: "02", name: "ANTICIPATION", short: "Preparación" },
  { num: "03", name: "STAGING", short: "Puesta en escena" },
  { num: "04", name: "STRAIGHT AHEAD", short: "Cuadro a cuadro" },
  { num: "05", name: "FOLLOW THROUGH", short: "Inercia" },
  { num: "06", name: "SLOW IN/OUT", short: "Aceleración" },
  { num: "07", name: "ARCS", short: "Trayectorias" },
  { num: "08", name: "SECONDARY ACTION", short: "Acción secundaria" },
  { num: "09", name: "TIMING", short: "Ritmo" },
  { num: "10", name: "EXAGGERATION", short: "Exageración" },
  { num: "11", name: "SOLID DRAWING", short: "Volumen 3D" },
  { num: "12", name: "APPEAL", short: "Atractivo" },
];

function setup() {
  createCanvas(900, 1200);
  pixelDensity(1);

  cellWidth = width / COLS;
  cellHeight = (height - headerHeight) / ROWS;

  // Initialize follow through positions
  followX = cellWidth / 2;
  followY = cellHeight / 2;
  followX2 = cellWidth / 2;
  followY2 = cellHeight / 2;
  followX3 = cellWidth / 2;
  followY3 = cellHeight / 2;
}

// ═══════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════

function getColor(phase, intensity = 1) {
  const r = 0;
  const g = Math.floor((180 + Math.sin(phase) * 75) * intensity);
  const b = 0;
  return { r, g, b };
}

function setGlow(color, blur) {
  drawingContext.shadowColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  drawingContext.shadowBlur = blur;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutBounce(t) {
  const n1 = 7.5625,
    d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeInBack(t) {
  const c1 = 1.70158;
  return (c1 + 1) * t * t * t - c1 * t * t;
}

// ═══════════════════════════════════════════
// DRAW CELL FRAME
// ═══════════════════════════════════════════

function drawCellFrame(col, row, principleIndex) {
  const x = col * cellWidth;
  const y = row * cellHeight + headerHeight;
  const p = principles[principleIndex];
  const phase = frame * 0.01 + principleIndex * 0.5;
  const col_color = getColor(phase, 1.0);

  push();
  // Border
  stroke(col_color.r, col_color.g, col_color.b, 80);
  strokeWeight(1);
  noFill();
  rect(x + 3, y + 3, cellWidth - 6, cellHeight - 6);

  // Número grande arriba izquierda
  setGlow(col_color, 8);
  fill(col_color.r, col_color.g, col_color.b, 60);
  noStroke();
  textFont("monospace");
  textSize(28);
  textAlign(LEFT, TOP);
  text(p.num, x + 8, y + 6);

  // Nombre del principio
  setGlow(col_color, 12);
  fill(col_color.r, col_color.g, col_color.b, 255);
  textSize(10);
  textAlign(LEFT, BOTTOM);
  text(p.name, x + 10, y + cellHeight - 18);

  // Subtítulo
  fill(col_color.r, col_color.g * 0.7, col_color.b, 150);
  textSize(8);
  text(p.short, x + 10, y + cellHeight - 8);
  pop();
}

// ═══════════════════════════════════════════
// PRINCIPLE ANIMATIONS
// ═══════════════════════════════════════════

function drawSquashStretch(cx, cy) {
  const phase = frame * 0.01;
  const col = getColor(phase);

  // Bouncing ball with proper squash/stretch
  // Total cycle: 100 frames bounce + 40 frames rest = 140 frames
  const totalCycle = 140;
  const bounceFrames = 100;

  const cycleFrame = frame % totalCycle;

  const ballRadius = 19; // radius of the ball (38/2)
  const groundY = cy + 75; // where the ground/shadow is
  const groundLevel = groundY - ballRadius; // where ball center should be when touching ground
  const startY = cy - 65;

  let bounce, ballY;

  if (cycleFrame < bounceFrames) {
    // Active bounce phase
    const bounceT = cycleFrame / bounceFrames;
    bounce = easeOutBounce(bounceT);
    ballY = startY + bounce * (groundLevel - startY);
  } else {
    // Rest phase - ball stays on ground, circular
    bounce = 1;
    ballY = groundLevel;
  }

  // Squash & Stretch - smooth transitions using velocity
  let scaleX = 1,
    scaleY = 1;
  let yOffset = 0;

  // Calculate velocity from bounce curve derivative (approximation)
  const delta = 0.01;
  const bounceNext = easeOutBounce(
    Math.min(1, (cycleFrame + 1) / bounceFrames)
  );
  const bouncePrev = easeOutBounce(
    Math.max(0, (cycleFrame - 1) / bounceFrames)
  );
  const velocity = (bounceNext - bouncePrev) / (2 * delta);

  // Only apply effects in the active bounce phase
  if (cycleFrame < bounceFrames) {
    // SQUASH: when very close to ground and moving slowly (impact moment)
    // Use smooth falloff based on height and velocity
    const heightFromGround = 1 - bounce; // 0 at ground, 1 at top
    const impactIntensity =
      Math.max(0, 1 - heightFromGround * 15) *
      Math.max(0, 1 - Math.abs(velocity) * 3);

    if (impactIntensity > 0) {
      // Smooth squash with sine curve for natural feel
      const smoothSquash = Math.sin((impactIntensity * Math.PI) / 2) * 0.3;
      scaleY = 1 - smoothSquash;
      scaleX = 1 + smoothSquash;
      yOffset = ballRadius * smoothSquash;
    }

    // STRETCH: when falling fast (high velocity)
    const fallSpeed = Math.max(0, velocity);
    if (fallSpeed > 0.3 && heightFromGround > 0.1) {
      const stretchAmount = Math.min((fallSpeed - 0.3) * 0.5, 0.2);
      scaleY = 1 + stretchAmount;
      scaleX = 1 - stretchAmount * 0.6;
    }
  }

  // Shadow - based on distance from ball to ground
  const distanceToGround = groundLevel - ballY;
  const maxDistance = groundLevel - startY;
  const proximity = 1 - distanceToGround / maxDistance; // 0 = far, 1 = on ground

  push();
  fill(0, col.g * 0.3, 0, 20 + proximity * 50);
  noStroke();
  ellipse(cx, groundY, 30 + proximity * 25, 8 + proximity * 4);
  pop();

  // Ball
  push();
  translate(cx, ballY + yOffset);
  scale(scaleX, scaleY);
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(0, 0, 38);
  pop();
}

function drawAnticipation(cx, cy) {
  const phase = frame * 0.01 + 1;
  const col = getColor(phase);

  const cycleT = (frame % 120) / 120;
  let posX,
    scaleX = 1;

  // Rango centrado: -60 a +60 desde cx
  if (cycleT < 0.15) {
    // Anticipation - pull back
    const t = cycleT / 0.15;
    posX = cx - easeInOut(t) * 50;
    scaleX = 1 + t * 0.2;
  } else if (cycleT < 0.5) {
    // Action - shoot forward
    const t = (cycleT - 0.15) / 0.35;
    posX = cx - 50 + easeOutElastic(t) * 110;
    scaleX = 1 - (1 - t) * 0.3;
  } else {
    // Return
    const t = (cycleT - 0.5) / 0.5;
    posX = cx + 60 - easeInOut(t) * 60;
    scaleX = 1;
  }

  // Track
  push();
  stroke(col.r, col.g, col.b, 40);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(cx - 60, cy, cx + 70, cy);
  drawingContext.setLineDash([]);
  pop();

  // Ball
  push();
  translate(posX, cy);
  scale(1 / scaleX, scaleX);
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(0, 0, 30);
  pop();
}

function drawStaging(cx, cy) {
  const phase = frame * 0.01 + 2;
  const col = getColor(phase);

  // Background elements (dimmed) - orbitan alrededor del protagonista
  push();
  stroke(col.r, col.g * 0.4, col.b, 80);
  strokeWeight(1);
  noFill();
  for (let i = 0; i < 5; i++) {
    const angle = frame * 0.008 + i * 1.2;
    const x = cx + cos(angle) * 55;
    const y = cy + sin(angle) * 40;
    circle(x, y, 12);
  }
  pop();

  // Main subject (highlighted)
  const pulse = 1 + sin(frame * 0.05) * 0.1;
  push();
  setGlow(col, 20);
  stroke(col.r, col.g, col.b);
  strokeWeight(2.5);
  noFill();
  circle(cx, cy, 45 * pulse);

  // Inner detail
  strokeWeight(1.5);
  circle(cx, cy, 25 * pulse);
  pop();
}

function drawStraightAhead(cx, cy) {
  const phase = frame * 0.01 + 3;
  const col = getColor(phase);

  // Labels
  push();
  fill(col.r, col.g, col.b, 100);
  textSize(7);
  textAlign(CENTER, TOP);
  text("POSE TO POSE", cx - 50, cy + 60);
  text("STRAIGHT AHEAD", cx + 50, cy + 60);
  pop();

  // === LEFT: POSE TO POSE (CUADRADO) ===
  // Rotación controlada entre poses clave definidas
  const cycleT = (frame % 180) / 180;
  let rotation;

  // 3 poses clave: 0° -> 45° -> 90° -> 45° -> 0°
  if (cycleT < 0.25) {
    const t = easeInOut(cycleT / 0.25);
    rotation = t * (PI / 4); // 0° a 45°
  } else if (cycleT < 0.5) {
    const t = easeInOut((cycleT - 0.25) / 0.25);
    rotation = PI / 4 + t * (PI / 4); // 45° a 90°
  } else if (cycleT < 0.75) {
    const t = easeInOut((cycleT - 0.5) / 0.25);
    rotation = PI / 2 - t * (PI / 4); // 90° a 45°
  } else {
    const t = easeInOut((cycleT - 0.75) / 0.25);
    rotation = PI / 4 - t * (PI / 4); // 45° a 0°
  }

  // Marcadores de keyframes (poses clave)
  push();
  stroke(col.r, col.g * 0.3, col.b, 50);
  strokeWeight(1);
  noFill();
  // Pose 1: 0°
  push();
  translate(cx - 50, cy);
  rectMode(CENTER);
  rect(0, 0, 18, 18);
  pop();
  // Pose 2: 45°
  push();
  translate(cx - 50, cy);
  rotate(PI / 4);
  rect(0, 0, 18, 18);
  pop();
  // Pose 3: 90°
  push();
  translate(cx - 50, cy);
  rotate(PI / 2);
  rect(0, 0, 18, 18);
  pop();
  pop();

  // Cuadrado pose to pose (controlado, poses definidas)
  push();
  translate(cx - 50, cy);
  rotate(rotation);
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  rect(0, 0, 30, 30);
  pop();

  // === RIGHT: STRAIGHT AHEAD (LLAMA/FUEGO) ===
  // Movimiento orgánico frame a frame, sin poses predefinidas
  push();
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();

  // Llama ondulante - se construye frame a frame
  beginShape();
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    // Base más ancha, punta más estrecha (forma de llama)
    const width = 25 * (1 - t * 0.8);
    const waveX = cx + 50 + sin(t * PI * 3 + frame * 0.12) * width;
    const waveY = cy + 50 - t * 100;
    // Noise para movimiento impredecible frame a frame
    const noiseX = (noise(i * 0.4, frame * 0.04) - 0.5) * 20 * (1 - t * 0.5);
    const noiseY = (noise(i * 0.4 + 100, frame * 0.05) - 0.5) * 12;

    curveVertex(waveX + noiseX, waveY + noiseY);
  }
  endShape();

  pop();
}

function drawFollowThrough(cx, cy) {
  const phase = frame * 0.01 + 4;
  const col = getColor(phase);

  // Main object oscillating
  const mainX = cx + sin(frame * 0.05) * 50;
  const mainY = cy;

  // Followers with delay
  followX += (mainX - followX) * 0.15;
  followX2 += (mainX - followX2) * 0.08;
  followX3 += (mainX - followX3) * 0.04;

  // Connection lines
  push();
  stroke(col.r, col.g * 0.5, col.b, 60);
  strokeWeight(1);
  drawingContext.setLineDash([2, 2]);
  line(mainX, mainY, followX, mainY + 30);
  line(followX, mainY + 30, followX2, mainY + 55);
  line(followX2, mainY + 55, followX3, mainY + 75);
  drawingContext.setLineDash([]);
  pop();

  // Main circle
  push();
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(mainX, mainY, 25);

  // Followers
  stroke(col.r, col.g, col.b, 200);
  strokeWeight(1.5);
  circle(followX, mainY + 30, 18);

  stroke(col.r, col.g, col.b, 150);
  strokeWeight(1);
  circle(followX2, mainY + 55, 14);

  stroke(col.r, col.g, col.b, 100);
  circle(followX3, mainY + 75, 10);
  pop();
}

function drawSlowInOut(cx, cy) {
  const phase = frame * 0.01 + 5;
  const col = getColor(phase);

  // Ciclo de ida y vuelta con easing
  const cycleT = (frame % 180) / 180;
  // Ida (0-0.5) y vuelta (0.5-1)
  let t;
  if (cycleT < 0.5) {
    t = easeInOut(cycleT * 2); // 0 -> 1
  } else {
    t = easeInOut((1 - cycleT) * 2); // 1 -> 0
  }

  const startX = cx - 80;
  const endX = cx + 80;

  // Track principal
  push();
  stroke(col.r, col.g, col.b, 40);
  strokeWeight(1);
  line(startX, cy, endX, cy);

  // Marcadores de inicio y fin
  stroke(col.r, col.g * 0.5, col.b, 80);
  line(startX, cy - 15, startX, cy + 15);
  line(endX, cy - 15, endX, cy + 15);
  pop();

  // Visualización de espaciado (dots mostrando distribución de frames)
  push();
  fill(col.r, col.g * 0.4, col.b, 60);
  noStroke();
  for (let i = 0; i <= 10; i++) {
    const dotT = easeInOut(i / 10);
    const dotX = startX + dotT * (endX - startX);
    circle(dotX, cy + 25, 4);
  }
  // Label
  fill(col.r, col.g, col.b, 80);
  textSize(6);
  textAlign(CENTER, TOP);
  text("FRAME SPACING", cx, cy + 35);
  pop();

  // Círculo principal con easing
  const ballX = startX + t * (endX - startX);

  push();
  setGlow(col, 18);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(ballX, cy, 28);
  pop();

  // Trail que muestra la velocidad (más juntos = más lento)
  push();
  for (let i = 1; i <= 5; i++) {
    const trailCycleT = ((frame - i * 3) % 180) / 180;
    let trailT;
    if (trailCycleT < 0.5) {
      trailT = easeInOut(trailCycleT * 2);
    } else {
      trailT = easeInOut((1 - trailCycleT) * 2);
    }
    const trailX = startX + trailT * (endX - startX);
    stroke(col.r, col.g, col.b, 80 - i * 15);
    strokeWeight(1);
    noFill();
    circle(trailX, cy, 20 - i * 2);
  }
  pop();
}

function drawArcs(cx, cy) {
  const phase = frame * 0.01 + 6;
  const col = getColor(phase);

  // Péndulo - demuestra arcos naturales por rotación
  const pivotY = cy - 60;
  const armLength = 90;
  const maxSwing = PI / 3; // 60 grados

  // Oscilación con easing natural (simula física)
  const swingT = (frame % 180) / 180;
  const pendulumAngle = sin(swingT * PI * 2) * maxSwing;

  // Posición de la bola
  const ballX = cx + sin(pendulumAngle) * armLength;
  const ballY = pivotY + cos(pendulumAngle) * armLength;

  push();

  // Arco de trayectoria (guía visual)
  stroke(col.r, col.g, col.b, 30);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  noFill();
  arc(
    cx,
    pivotY,
    armLength * 2,
    armLength * 2,
    PI / 2 - maxSwing,
    PI / 2 + maxSwing
  );
  drawingContext.setLineDash([]);

  // Punto de pivote
  fill(col.r, col.g, col.b, 150);
  noStroke();
  circle(cx, pivotY, 8);

  // Brazo del péndulo
  stroke(col.r, col.g, col.b, 120);
  strokeWeight(1.5);
  line(cx, pivotY, ballX, ballY);

  // Trail de posiciones anteriores
  for (let i = 5; i > 0; i--) {
    const trailT = ((frame - i * 4) % 180) / 180;
    const trailAngle = sin(trailT * PI * 2) * maxSwing;
    const tx = cx + sin(trailAngle) * armLength;
    const ty = pivotY + cos(trailAngle) * armLength;
    stroke(col.r, col.g, col.b, 40 - i * 7);
    strokeWeight(1);
    noFill();
    circle(tx, ty, 14 - i * 2);
  }

  // Bola principal
  setGlow(col, 18);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(ballX, ballY, 22);
  pop();
}

function drawSecondaryAction(cx, cy) {
  const phase = frame * 0.01 + 7;
  const col = getColor(phase);

  // Main action - walking figure (simplified)
  const walkCycle = (frame % 60) / 60;
  const bobY = sin(walkCycle * PI * 2) * 8;
  const bodyX = cx;
  const bodyY = cy - 10 + bobY;

  // Main body
  push();
  setGlow(col, 12);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(bodyX, bodyY, 30);

  // Secondary action - head bob (different timing)
  const headBob = sin(walkCycle * PI * 4 + 0.5) * 5;
  strokeWeight(1.5);
  circle(bodyX, bodyY - 25 + headBob, 15);

  // Secondary action - arm swing
  const armAngle = sin(walkCycle * PI * 2) * 0.4;
  push();
  translate(bodyX - 15, bodyY);
  rotate(armAngle);
  line(0, 0, 0, 25);
  pop();
  push();
  translate(bodyX + 15, bodyY);
  rotate(-armAngle);
  line(0, 0, 0, 25);
  pop();

  // Legs
  const legAngle = sin(walkCycle * PI * 2) * 0.3;
  push();
  translate(bodyX - 8, bodyY + 15);
  rotate(legAngle);
  line(0, 0, 0, 30);
  pop();
  push();
  translate(bodyX + 8, bodyY + 15);
  rotate(-legAngle);
  line(0, 0, 0, 30);
  pop();
  pop();
}

function drawTiming(cx, cy) {
  const phase = frame * 0.01 + 8;
  const col = getColor(phase);

  const startX = cx - 70;
  const endX = cx + 70;
  const trackLength = endX - startX;

  // === FAST: Pocos cuadros (5), espaciado amplio ===
  const fastY = cy - 35;
  const fastFrames = 5;
  const fastCycle = 60; // ciclo rápido
  const fastT = (frame % fastCycle) / fastCycle;
  const fastStep = Math.floor(fastT * fastFrames) / (fastFrames - 1);
  const fastX = startX + fastStep * trackLength;

  // === SLOW: Muchos cuadros (12), espaciado estrecho ===
  const slowY = cy + 35;
  const slowFrames = 12;
  const slowCycle = 180; // ciclo lento
  const slowT = (frame % slowCycle) / slowCycle;
  const slowStep = Math.floor(slowT * slowFrames) / (slowFrames - 1);
  const slowX = startX + slowStep * trackLength;

  push();

  // Labels
  fill(col.r, col.g, col.b, 100);
  textSize(7);
  textAlign(RIGHT, CENTER);
  text("FAST (5)", startX - 5, fastY);
  text("SLOW (12)", startX - 5, slowY);

  // === FAST track con espaciado visible ===
  stroke(col.r, col.g, col.b, 30);
  strokeWeight(1);
  line(startX, fastY, endX, fastY);

  // Mostrar posiciones de cuadros (espaciado amplio)
  fill(col.r, col.g * 0.4, col.b, 50);
  noStroke();
  for (let i = 0; i < fastFrames; i++) {
    const dotX = startX + (i / (fastFrames - 1)) * trackLength;
    circle(dotX, fastY, 6);
  }

  // Círculo rápido
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  circle(fastX, fastY, 20);

  // === SLOW track con espaciado visible ===
  stroke(col.r, col.g, col.b, 30);
  strokeWeight(1);
  line(startX, slowY, endX, slowY);

  // Mostrar posiciones de cuadros (espaciado estrecho)
  fill(col.r, col.g * 0.4, col.b, 50);
  noStroke();
  for (let i = 0; i < slowFrames; i++) {
    const dotX = startX + (i / (slowFrames - 1)) * trackLength;
    circle(dotX, slowY, 4);
  }

  // Círculo lento
  setGlow(col, 12);
  stroke(col.r, col.g * 0.7, col.b);
  strokeWeight(2);
  noFill();
  circle(slowX, slowY, 20);

  pop();
}

function drawExaggeration(cx, cy) {
  const phase = frame * 0.01 + 9;
  const col = getColor(phase);

  // Normal vs exaggerated
  const pulseT = (frame % 90) / 90;
  const normalPulse = 1 + sin(pulseT * PI * 2) * 0.1;
  const exaggeratedPulse = 1 + sin(pulseT * PI * 2) * 0.4;

  // Labels
  push();
  fill(col.r, col.g, col.b, 80);
  textSize(7);
  textAlign(CENTER, TOP);
  text("NORMAL", cx - 45, cy + 50);
  text("EXAGGERATED", cx + 45, cy + 50);
  pop();

  // Normal
  push();
  setGlow(col, 8);
  stroke(col.r, col.g * 0.6, col.b, 150);
  strokeWeight(1.5);
  noFill();
  circle(cx - 45, cy, 30 * normalPulse);
  pop();

  // Exaggerated
  push();
  setGlow(col, 20);
  stroke(col.r, col.g, col.b);
  strokeWeight(2.5);
  noFill();

  // Non-uniform scale for more drama
  const scaleX = exaggeratedPulse;
  const scaleY = 2 - exaggeratedPulse;

  push();
  translate(cx + 45, cy);
  scale(scaleX, scaleY);
  circle(0, 0, 30);
  pop();
  pop();
}

function drawSolidDrawing(cx, cy) {
  const phase = frame * 0.01 + 10;
  const col = getColor(phase);

  // Rotación suave para mostrar volumen
  const rotY = frame * 0.02;

  push();

  // === SOMBRA PROYECTADA (ancla al suelo) ===
  const shadowY = cy + 55;
  fill(0, col.g * 0.2, 0, 50);
  noStroke();
  ellipse(cx, shadowY, 70, 15);

  // === ESFERA 3D CON VOLUMEN ===
  const sphereR = 45;

  setGlow(col, 15);
  noFill();

  // Contorno principal (más grueso = superficie frontal)
  stroke(col.r, col.g, col.b, 255);
  strokeWeight(2.5);
  circle(cx, cy, sphereR * 2);

  // Líneas de latitud CURVAS (demuestran que no son rectas en esfera)
  for (let i = 1; i < 6; i++) {
    const lat = (i / 6) * PI - PI / 2;
    const y = cy + sin(lat) * sphereR;
    const radiusAtLat = cos(lat) * sphereR;

    // Profundidad: centro más visible, extremos más tenues
    const depth = abs(sin(lat));
    const alpha = map(depth, 0, 1, 180, 50);
    const weight = map(depth, 0, 1, 1.8, 0.5);

    stroke(col.r, col.g, col.b, alpha);
    strokeWeight(weight);

    // Elipse curva (NO línea recta)
    ellipse(cx, y, radiusAtLat * 2, radiusAtLat * 0.4);
  }

  // Líneas de longitud rotando (curvas sobre la superficie)
  for (let i = 0; i < 6; i++) {
    const lon = (i / 6) * PI + rotY;
    const visibility = cos(lon);
    if (visibility < 0.1) continue;

    stroke(col.r, col.g, col.b, visibility * 150);
    strokeWeight(visibility * 1.5 + 0.3);

    beginShape();
    for (let j = 0; j <= 30; j++) {
      const lat = (j / 30) * PI - PI / 2;
      const x = cx + cos(lat) * sin(lon) * sphereR;
      const y = cy + sin(lat) * sphereR;
      vertex(x, y);
    }
    endShape();
  }

  pop();
}

function drawAppeal(cx, cy) {
  const phase = frame * 0.01 + 11;
  const col = getColor(phase);

  // Charming, appealing motion (estilo Ed)
  const wobble = sin(frame * 0.04) * 0.1;
  const breathe = 1 + sin(frame * 0.03) * 0.08;
  const bounce = abs(sin(frame * 0.05)) * 5;

  // Pupilas creciendo irregular (estilo dibujo malo)
  const leftPupilGrow = 1 + noise(frame * 0.08) * 0.6 + sin(frame * 0.07) * 0.2;
  const rightPupilGrow =
    1 + noise(frame * 0.08 + 100) * 0.5 + sin(frame * 0.09) * 0.25;

  push();
  translate(cx, cy - bounce);
  rotate(wobble);
  scale(breathe);

  setGlow(col, 18);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();

  // Cabeza estilo Ed - forma redonda/ovalada (más grande)
  ellipse(0, 5, 75, 68);

  // === 14 PELOS CORTOS INDIVIDUALES ===
  stroke(col.r, col.g, col.b);
  strokeWeight(1.5);
  // Pelos distribuidos en arco sobre la cabeza
  line(-30, -18, -32, -26);
  line(-26, -22, -28, -30);
  line(-22, -26, -23, -34);
  line(-16, -28, -17, -36);
  line(-10, -30, -10, -38);
  line(-4, -31, -3, -39);
  line(2, -32, 3, -40);
  line(8, -31, 9, -39);
  line(14, -30, 15, -38);
  line(20, -28, 22, -36);
  line(25, -25, 27, -33);
  line(29, -21, 32, -28);
  line(32, -16, 36, -22);
  line(-33, -13, -37, -18);

  // === OJOS ESTILO ED (grandes, ovalados, estrabismo divergente) ===
  // Esclerótica (tamaño fijo)
  const leftEyeW = 22;
  const leftEyeH = 26;
  const rightEyeW = 26; // Más grande
  const rightEyeH = 32;

  // Ojo izquierdo (más pequeño)
  fill(col.r, col.g, col.b, 200);
  noStroke();
  ellipse(-16, 0, leftEyeW, leftEyeH);

  // Pupila izquierda - crece irregular
  fill(5, 8, 15);
  circle(-20, 0, 6 * leftPupilGrow);

  // Ojo derecho (más grande)
  fill(col.r, col.g, col.b, 200);
  ellipse(16, 2, rightEyeW, rightEyeH);

  // Pupila derecha - crece irregular (distinto timing)
  fill(5, 8, 15);
  circle(22, 2, 7 * rightPupilGrow);

  // === BOCA (línea curva) ===
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  arc(0, 18, 24, 12, 0.2, PI - 0.2);

  pop();

  // Sparkles alrededor
  push();
  for (let i = 0; i < 3; i++) {
    const sparkleAngle = frame * 0.03 + i * 2;
    const sparkleR = 50 + sin(sparkleAngle * 2) * 10;
    const sx = cx + cos(sparkleAngle + i) * sparkleR;
    const sy = cy + sin(sparkleAngle + i) * sparkleR;

    fill(col.r, col.g, col.b, 100 + sin(frame * 0.1 + i) * 50);
    noStroke();
    circle(sx, sy, 4);
  }
  pop();
}

// ═══════════════════════════════════════════
// MAIN DRAW
// ═══════════════════════════════════════════

function draw() {
  background(5, 8, 15);

  // === HEADER (título del proyecto) ===
  push();
  const headerCol = getColor(frame * 0.01);
  setGlow(headerCol, 15);
  fill(headerCol.r, headerCol.g, headerCol.b, 255);
  noStroke();
  textFont("monospace");
  textSize(14);
  textAlign(LEFT, CENTER);
  text("GENUARY 2026 / JAN.2", 12, 20);

  textSize(11);
  fill(headerCol.r, headerCol.g * 0.7, headerCol.b, 180);
  text("12 PRINCIPLES OF ANIMATION", 12, 38);

  // Frame counter en header
  fill(headerCol.r, headerCol.g, headerCol.b, 120);
  textSize(9);
  textAlign(RIGHT, CENTER);
  text("FRAME " + String(frame).padStart(5, "0"), width - 12, 28);
  pop();

  // Draw each cell
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;
      if (index >= 12) break;

      const x = col * cellWidth;
      const y = row * cellHeight + headerHeight;
      const cx = x + cellWidth / 2;
      const cy = y + cellHeight / 2 + 10;

      // Draw cell frame and title
      drawCellFrame(col, row, index);

      // Clip to cell
      push();
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(
        x + padding,
        y + 35,
        cellWidth - padding * 2,
        cellHeight - 45
      );
      drawingContext.clip();

      // Draw principle animation
      switch (index) {
        case 0:
          drawSquashStretch(cx, cy);
          break;
        case 1:
          drawAnticipation(cx, cy);
          break;
        case 2:
          drawStaging(cx, cy);
          break;
        case 3:
          drawStraightAhead(cx, cy);
          break;
        case 4:
          drawFollowThrough(cx, cy);
          break;
        case 5:
          drawSlowInOut(cx, cy);
          break;
        case 6:
          drawArcs(cx, cy);
          break;
        case 7:
          drawSecondaryAction(cx, cy);
          break;
        case 8:
          drawTiming(cx, cy);
          break;
        case 9:
          drawExaggeration(cx, cy);
          break;
        case 10:
          drawSolidDrawing(cx, cy);
          break;
        case 11:
          drawAppeal(cx, cy);
          break;
      }

      drawingContext.restore();
      pop();
    }
  }

  frame++;
}
