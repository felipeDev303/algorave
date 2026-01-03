// ================================
// JAN.2 - 12 PRINCIPLES OF ANIMATION
// ================================

let frame = 0;

// Grid configuration
const COLS = 3;
const ROWS = 4;
let cellWidth, cellHeight;
let padding = 8;

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
  { num: "①", name: "SQUASH & STRETCH", short: "Peso y flexibilidad" },
  { num: "②", name: "ANTICIPATION", short: "Preparar la acción" },
  { num: "③", name: "STAGING", short: "Dirigir atención" },
  { num: "④", name: "STRAIGHT AHEAD", short: "Animación libre" },
  { num: "⑤", name: "FOLLOW THROUGH", short: "Continuidad" },
  { num: "⑥", name: "SLOW IN/OUT", short: "Easing" },
  { num: "⑦", name: "ARCS", short: "Trayectorias curvas" },
  { num: "⑧", name: "SECONDARY ACTION", short: "Acciones secundarias" },
  { num: "⑨", name: "TIMING", short: "Velocidad y ritmo" },
  { num: "⑩", name: "EXAGGERATION", short: "Exageración" },
  { num: "⑪", name: "SOLID DRAWING", short: "Volumen y peso" },
  { num: "⑫", name: "APPEAL", short: "Carisma" },
];

function setup() {
  createCanvas(900, 1200);
  pixelDensity(1);

  cellWidth = width / COLS;
  cellHeight = height / ROWS;

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
  const y = row * cellHeight;
  const p = principles[principleIndex];
  const phase = frame * 0.01 + principleIndex * 0.5;
  const col_color = getColor(phase, 1.0);

  push();
  // Border
  stroke(col_color.r, col_color.g, col_color.b, 100);
  strokeWeight(1);
  noFill();
  rect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);

  // Title
  setGlow(col_color, 10);
  fill(col_color.r, col_color.g, col_color.b, 255);
  noStroke();
  textFont("monospace");
  textSize(11);
  textAlign(LEFT, TOP);
  text(p.num + " " + p.name, x + 10, y + 10);

  // Subtitle
  fill(col_color.r * 0.8, col_color.g * 0.8, col_color.b, 200);
  textSize(9);
  text(p.short, x + 10, y + 25);
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

  // Organic, unpredictable motion (like fire/smoke)
  push();
  setGlow(col, 10);
  stroke(col.r, col.g, col.b, 180);
  strokeWeight(1.5);
  noFill();

  beginShape();
  for (let i = 0; i < 20; i++) {
    const t = i / 20;
    const noiseVal = noise(i * 0.3, frame * 0.02);
    const x = cx - 60 + i * 6 + (noiseVal - 0.5) * 30;
    const y =
      cy +
      sin(t * PI * 2 + frame * 0.1) * 30 +
      (noise(i * 0.5, frame * 0.03) - 0.5) * 40;
    vertex(x, y);
  }
  endShape();

  // Random particles
  for (let i = 0; i < 5; i++) {
    const px = cx + (noise(i, frame * 0.02) - 0.5) * 100;
    const py = cy + (noise(i + 10, frame * 0.02) - 0.5) * 80;
    const size = 3 + noise(i, frame * 0.05) * 5;
    fill(col.r, col.g, col.b, 100);
    noStroke();
    circle(px, py, size);
  }
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

  // Compare linear vs eased motion
  const cycleT = (frame % 150) / 150;
  const linear = cycleT;
  const eased = easeInOut(cycleT);

  const startX = cx - 70;
  const endX = cx + 70;

  // Track
  push();
  stroke(col.r, col.g, col.b, 30);
  strokeWeight(1);
  line(startX, cy - 20, endX, cy - 20);
  line(startX, cy + 20, endX, cy + 20);

  // Labels
  fill(col.r, col.g, col.b, 100);
  textSize(7);
  textAlign(RIGHT, CENTER);
  text("LINEAR", startX - 5, cy - 20);
  text("EASED", startX - 5, cy + 20);
  pop();

  // Linear ball
  push();
  setGlow(col, 8);
  stroke(col.r, col.g * 0.6, col.b, 150);
  strokeWeight(1.5);
  noFill();
  const linearX = startX + linear * (endX - startX);
  circle(linearX, cy - 20, 16);
  pop();

  // Eased ball
  push();
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();
  const easedX = startX + eased * (endX - startX);
  circle(easedX, cy + 20, 20);
  pop();
}

function drawArcs(cx, cy) {
  const phase = frame * 0.01 + 6;
  const col = getColor(phase);

  // Arc path
  const arcT = (frame % 180) / 180;
  const angle = arcT * PI * 2;

  // Elliptical orbit
  const orbitW = 80;
  const orbitH = 40;

  push();
  // Orbit path
  stroke(col.r, col.g, col.b, 40);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  noFill();
  ellipse(cx, cy, orbitW * 2, orbitH * 2);
  drawingContext.setLineDash([]);

  // Moving object on arc
  const ballX = cx + cos(angle) * orbitW;
  const ballY = cy + sin(angle) * orbitH;

  // Trail
  for (let i = 5; i > 0; i--) {
    const trailAngle = angle - i * 0.2;
    const tx = cx + cos(trailAngle) * orbitW;
    const ty = cy + sin(trailAngle) * orbitH;
    stroke(col.r, col.g, col.b, 30 - i * 5);
    strokeWeight(1);
    noFill();
    circle(tx, ty, 12 - i * 1.5);
  }

  // Main ball
  setGlow(col, 15);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  circle(ballX, ballY, 18);
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

  // Three balls with different timing
  const speeds = [0.02, 0.05, 0.12];
  const labels = ["SLOW", "MED", "FAST"];
  const yOffsets = [-35, 0, 35];

  push();
  for (let i = 0; i < 3; i++) {
    const t = (frame * speeds[i]) % 1;
    const eased = easeInOut(t);
    const x = cx - 60 + eased * 120;

    // Track
    stroke(col.r, col.g, col.b, 30);
    strokeWeight(1);
    line(cx - 60, cy + yOffsets[i], cx + 60, cy + yOffsets[i]);

    // Label
    fill(col.r, col.g, col.b, 80);
    textSize(7);
    textAlign(RIGHT, CENTER);
    text(labels[i], cx - 65, cy + yOffsets[i]);

    // Ball
    const intensity = 0.5 + i * 0.25;
    setGlow(col, 10 + i * 5);
    stroke(col.r, col.g * intensity, col.b);
    strokeWeight(1.5 + i * 0.3);
    noFill();
    circle(x, cy + yOffsets[i], 14 + i * 2);
  }
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

  // 3D sphere illusion with depth
  const rotY = frame * 0.02;

  push();
  setGlow(col, 10);
  noFill();

  // Draw latitude lines with depth
  for (let i = 1; i < 6; i++) {
    const lat = (i / 6) * PI - PI / 2;
    const y = cy + sin(lat) * 40;
    const radiusAtLat = cos(lat) * 40;

    // Depth-based opacity
    const depth = sin(lat);
    const alpha = map(depth, -1, 1, 50, 200);

    stroke(col.r, col.g, col.b, alpha);
    strokeWeight(map(depth, -1, 1, 0.5, 2));

    // Perspective ellipse
    ellipse(cx, y, radiusAtLat * 2, radiusAtLat * 0.4);
  }

  // Draw longitude lines
  for (let i = 0; i < 8; i++) {
    const lon = (i / 8) * PI + rotY;
    const visibility = cos(lon);
    if (visibility < 0) continue;

    stroke(col.r, col.g, col.b, visibility * 150);
    strokeWeight(visibility * 1.5);

    beginShape();
    for (let j = 0; j <= 20; j++) {
      const lat = (j / 20) * PI - PI / 2;
      const x = cx + cos(lat) * sin(lon) * 40;
      const y = cy + sin(lat) * 40;
      vertex(x, y);
    }
    endShape();
  }
  pop();
}

function drawAppeal(cx, cy) {
  const phase = frame * 0.01 + 11;
  const col = getColor(phase);

  // Charming, appealing motion
  const wobble = sin(frame * 0.04) * 0.1;
  const breathe = 1 + sin(frame * 0.03) * 0.08;
  const bounce = abs(sin(frame * 0.05)) * 5;

  push();
  translate(cx, cy - bounce);
  rotate(wobble);
  scale(breathe);

  setGlow(col, 18);
  stroke(col.r, col.g, col.b);
  strokeWeight(2);
  noFill();

  // Main body - slightly asymmetric for appeal
  ellipse(0, 0, 45, 50);

  // Eyes - offset for personality
  fill(col.r, col.g, col.b, 200);
  noStroke();
  circle(-10, -8, 8);
  circle(10, -5, 10);

  // Smile
  stroke(col.r, col.g, col.b);
  strokeWeight(1.5);
  noFill();
  arc(0, 8, 20, 15, 0.2, PI - 0.2);

  pop();

  // Sparkles
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

  // Draw each cell
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const index = row * COLS + col;
      if (index >= 12) break;

      const x = col * cellWidth;
      const y = row * cellHeight;
      const cx = x + cellWidth / 2;
      const cy = y + cellHeight / 2 + 15;

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

  // Footer
  push();
  const titleCol = getColor(frame * 0.01);
  setGlow(titleCol, 12);
  fill(titleCol.r, titleCol.g, titleCol.b, 255);
  textFont("monospace");
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text("GENUARY 2026 / JAN.2 - 12 PRINCIPLES OF ANIMATION", 10, height - 8);

  textAlign(RIGHT, BOTTOM);
  text("FRAME " + String(frame).padStart(5, "0"), width - 10, height - 8);
  pop();

  frame++;
}
