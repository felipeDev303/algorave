# JAN.2 - 12 Principios de la Animación

## 🎯 Proyecto

Visualización interactiva de los **12 Principios de la Animación** en un grid 3x4, donde cada celda demuestra un principio de forma independiente con estética matrix (verde sobre negro).

**Canvas**: 900x1200px | **Framework**: p5.js

---

## 📌 Contexto

- Introducidos por **Ollie Johnston y Frank Thomas** en el libro _The Illusion of Life_ (1981).
- Buscan dar realismo y atractivo a la animación, respetando leyes físicas y emocionales.
- Aunque nacieron para animación tradicional, siguen siendo relevantes en la animación digital.

## 🎨 Los 12 principios de animación

1. **Squash and Stretch**

   - Da peso y flexibilidad a los objetos.
   - El volumen debe mantenerse constante.

2. **Anticipation**

   - Preparar al público para la acción (ej. un jugador que retrocede antes de lanzar).

3. **Staging**

   - Dirigir la atención del espectador hacia lo más importante de la escena.

4. **Straight Ahead Action & Pose to Pose**

   - Dos métodos de animación:
     - _Straight ahead_: fluido y dinámico, cuadro a cuadro.
     - _Pose to pose_: clave para escenas dramáticas y composición.

5. **Follow Through & Overlapping Action**

   - Partes del cuerpo u objetos continúan moviéndose después de la acción principal.

6. **Slow In & Slow Out**

   - Más cuadros al inicio y final de un movimiento para mayor realismo.

7. **Arcs**

   - Los movimientos naturales siguen trayectorias curvas.

8. **Secondary Action**

   - Acciones adicionales que complementan la principal (ej. gestos faciales al caminar).

9. **Timing**

   - Número de cuadros determina la velocidad y realismo de la acción.

10. **Exaggeration**

    - Exagerar movimientos o expresiones para dar vida y estilo.

11. **Solid Drawing**

    - Considerar volumen, peso y anatomía para evitar personajes planos.

12. **Appeal**

    - Carisma del personaje, que lo haga interesante y convincente (incluso villanos).

## ✨ Importancia

- Considerados la “**Biblia de la animación**”.
- Aplicables tanto a personajes simpáticos como a villanos.
- Siguen siendo base para animación 3D y digital.

---

## 🧠 Enfoque general en p5.js

En p5 no “animamos dibujos”, **animamos variables en el tiempo**:

```js
x += vx;
y += vy;
angle += speed;
scale += delta;
```

Los principios se aplican **controlando cómo cambian esas variables**.

---

## 1️⃣ Squash & Stretch

👉 **El principio más importante de la animación.**

Consiste en deformar el objeto durante el movimiento para transmitir **flexibilidad, peso y vida**. Sin S&S, los objetos parecen rígidos como rocas.

### Cómo funciona:

- **STRETCH** (estiramiento): Cuando el objeto se mueve rápido (cayendo o subiendo)
- **SQUASH** (aplastamiento): En el momento del impacto con una superficie

### Reglas fundamentales:

1. **Conservar el volumen**: Si se aplasta en Y, debe expandirse en X (y viceversa)

   ```js
   scaleY = 0.7;
   scaleX = 1 / scaleY; // ≈ 1.43
   ```

2. **"Siéntelo, no lo veas"**: El efecto debe ser sutil. Recuperación rápida a la forma neutral para que el público lo sienta sin notarlo conscientemente.

3. **Transmite el material**: Más S&S = material elástico (goma). Menos S&S = material rígido (boliche).

### En p5.js:

```js
// Squash al impactar
if (nearGround) {
  scaleY = 1 - squashAmount;
  scaleX = 1 + squashAmount;
  yOffset = radius * squashAmount; // Mantener base en el suelo
}

// Stretch al caer rápido
if (falling && highSpeed) {
  scaleY = 1 + stretchAmount;
  scaleX = 1 - stretchAmount;
}
```

📌 **Error común**: Exagerar el efecto. La deformación debe ser rápida y sutil.

📌 **Ideal para**: Rebotes, impactos, saltos, ritmos musicales.

---

## 2️⃣ Anticipation

👉 **Señalar al público que algo está a punto de suceder.**

La anticipación es el movimiento preparatorio antes de la acción principal. Almacena energía y hace que el movimiento sea más natural y atractivo.

### Cómo funciona:

- **Movimiento opuesto**: Antes de ir a la izquierda, inclinarse brevemente a la derecha
- **Compresión → Expansión**: Como un muelle que se comprime antes de rebotar
- **Señal sutil**: Un parpadeo antes de girar, tensión en la boca antes de hablar

### Ejemplos:

| Acción       | Anticipación                    |
| ------------ | ------------------------------- |
| Saltar       | Agacharse primero               |
| Caminar      | Talón presionado antes del paso |
| Girar cabeza | Guiño o parpadeo previo         |
| Lanzar       | Brazo hacia atrás               |

### Reglas fundamentales:

1. **Proporcionalidad**: La anticipación debe ser proporcional a la acción. Movimiento grande = anticipación más notable.

2. **No rompe la sorpresa**: Aumenta la tensión y el interés, no arruina el momento.

3. **Test de rebobinado**: Si rebobinas la animación, la anticipación se convierte en "follow through". Si se ve antinatural, necesita ajuste.

### En p5.js:

```js
const cycleT = (frame % 120) / 120;

if (cycleT < 0.15) {
  // ANTICIPACIÓN - retroceso
  x = startX - easeInOut(cycleT / 0.15) * pullBack;
} else {
  // ACCIÓN PRINCIPAL - disparo hacia adelante
  x = startX - pullBack + easeOutElastic((cycleT - 0.15) / 0.85) * distance;
}
```

📌 **Error común**: Anticipación demasiado corta o inexistente. Sin ella, el movimiento parece robótico.

📌 **Combina con**: Squash & Stretch para mayor impacto (compresión durante anticipación, estiramiento durante acción).

---

## 3️⃣ Staging

👉 **Expresar una idea de manera clara, coherente y comprensible para el espectador.**

La puesta en escena (staging) es un principio cinematográfico que requiere transmitir emociones, actitudes y expresiones de forma que conecten con el público. Los animadores deben ponerse en la piel del espectador para entender el flujo de las escenas.

### Factores clave:

#### 1. Actuación (Pose y Acción)

- **Siluetas claras**: Las poses deben leerse incluso en negro sobre blanco
- **Mostrar de lado**: Interactuar con el encuadre, no de frente/espalda
- Ejemplo: Spider-Man: Into The Spider-Verse usa poses poderosas y legibles

#### 2. Timing (Sincronización)

- **Separar acciones**: Cada movimiento debe ser distinguible
- **Evitar paralelismo**: Dos acciones simultáneas distraen al público
- **Timing cómico**: El momento preciso determina si algo es gracioso

#### 3. Cámara (Ángulo y Composición)

- **Regla de los tercios**: La posición del personaje define su rol
- **Plano general vs primer plano**: Escala de acción vs expresión
- **Composición lógica**: Guiar la mirada del espectador

#### 4. Ambientación (Entorno)

- **Jerarquía visual**: El protagonista debe destacar sobre el fondo
- **Menos es más**: Demasiados detalles reducen la atención
- **Detalles con propósito**: El entorno puede reforzar emociones

### En p5.js:

```js
// Jerarquía: protagonista brillante, fondo tenue
background(10);

// Elementos secundarios (dimmed)
fill(50);
for (let i = 0; i < 5; i++) {
  ellipse(random(width), random(height), 20);
}

// Protagonista (contraste máximo + glow)
setGlow(color(0, 255, 0), 20);
fill(255);
ellipse(width / 2, height / 2, 80);
```

📌 **Error común**: Múltiples focos de atención compitiendo. Un solo protagonista por escena.

📌 **Combina con**: Anticipation (preparar la atención) y Timing (revelar en el momento justo).

---

## 4️⃣ Straight Ahead vs Pose to Pose

👉 **Dos métodos fundamentales para crear movimiento en animación.**

No son opuestos, son complementarios. Cada uno tiene ventajas específicas y los mejores animadores dominan cuándo usar cada uno.

### Definiciones:

| Método             | Descripción                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| **Straight Ahead** | Dibujar cuadro tras cuadro en orden, de principio a fin                   |
| **Pose to Pose**   | Definir poses clave primero, luego rellenar los intermedios (in-betweens) |

### Terminología clave:

- **Keyframes**: Los dibujos más importantes del movimiento
- **Breakdowns**: Dibujos entre keyframes que definen la trayectoria
- **Extremes**: Conjunto de keyframes + breakdowns
- **In-betweens**: Dibujos intermedios que suavizan la transición

---

### 🔵 Pose to Pose

El método **más usado** en animación profesional (2D, 3D) porque ofrece máximo control.

**Ventajas:**

- Control total sobre tamaño y posición del personaje
- Detectas problemas antes de dibujar todo
- Ideal para movimientos lentos y expresiones faciales
- Facilita ajustes sin rehacer todo

**Proceso:**

1. Definir keyframes (poses principales)
2. Ajustar y validar que funcionen
3. Añadir breakdowns (trayectoria)
4. Insertar in-betweens

**Ideal para:**

- Escenas dramáticas y narrativas
- Movimientos controlados
- Coreografías precisas
- Expresiones faciales

### En p5.js:

```js
// Pose to Pose: interpolación entre estados definidos
const keyframes = [0, 0.3, 0.7, 1]; // poses clave
const t = (frame % 120) / 120;
const eased = easeInOut(t);
x = lerp(startX, endX, eased);
```

---

### 🟢 Straight Ahead

Animación **fluida y orgánica**, cuadro a cuadro sin planificación rígida.

**Ventajas:**

- Movimientos naturales e impredecibles
- Perfecto para formas sin estructura fija
- Sensación de vida y espontaneidad

**Desventajas:**

- Posible desviación de tamaño/posición al final
- Difícil de corregir errores
- Requiere mucho cuidado en stop-motion

**Ideal para:**

- Efectos naturales (fuego, agua, humo)
- Partículas y ruido
- Elementos sin forma fija
- Stop-motion (obligatorio)

### En p5.js:

```js
// Straight Ahead: movimiento orgánico frame a frame
x += (noise(frame * 0.02) - 0.5) * speed;
y += (noise(frame * 0.02 + 100) - 0.5) * speed;
```

---

### 🟣 Combinación de ambos

Los mejores resultados vienen de **combinar ambos métodos**:

```js
// Cuerpo: Pose to Pose (controlado)
bodyX = lerp(startX, endX, easeInOut(t));

// Cola/pelo: Straight Ahead (físico, fluido)
tailX = lerp(tailX, bodyX, 0.1); // follow through
tailWobble = noise(frame * 0.05) * 10;
```

**Ejemplo práctico:** Un conejo corriendo

- **Pose to Pose**: Movimiento del cuerpo
- **Straight Ahead**: Orejas flotantes, cola

📌 **Error común**: Usar solo un método. La magia está en combinarlos según el elemento.

📌 **En stop-motion**: Straight ahead es obligatorio (no puedes "insertar" frames físicos), por eso requiere planificación extrema.

---

## 5️⃣ Follow Through & Overlapping Action

👉 Variables con retraso.

```js
tailX = lerp(tailX, x, 0.1);
```

📌 Perfecto para:

- Colas
- Brazos
- Cámaras
- Trails

---

## 6️⃣ Slow In & Slow Out

👉 Usa easing, no velocidad constante.

```js
t += 0.02;
let eased = t * t * (3 - 2 * t);
x = lerp(startX, endX, eased);
```

📌 Esto cambia TODO visualmente.

---

## 7️⃣ Arcs

👉 Nunca moverse en línea recta.

```js
x = centerX + cos(angle) * r;
y = centerY + sin(angle) * r;
angle += 0.05;
```

📌 Incluso movimientos “rectos” deben tener micro-arcos.

---

## 8️⃣ Secondary Action

👉 Animaciones pequeñas independientes.

```js
headBob = sin(frameCount * 0.1) * 5;
```

📌 No deben competir con la acción principal.

---

## 9️⃣ Timing

👉 El timing es **frames**, no segundos.

```js
if (frameCount % 30 === 0) {
  jump();
}
```

📌 Cambiar solo el timing puede:

- Cambiar emoción
- Cambiar peso
- Cambiar estilo

---

## 🔟 Exaggeration

👉 Multiplica, no sumes.

```js
jumpHeight *= 1.5;
rotation *= 2;
```

📌 En digital, exagerar **siempre se ve mejor**.

---

## 1️⃣1️⃣ Solid Drawing (en p5)

👉 Volumen con:

- Sombra
- Perspectiva
- Relación de tamaños

```js
ellipse(x, y, size, size * 0.8);
```

📌 Evita formas planas sin intención.

---

## 1️⃣2️⃣ Appeal

👉 Diseño + movimiento.

En p5:

- Ritmo
- Simetría rota
- Personalidad en motion

```js
angle = sin(frameCount * 0.03) * 0.2;
```

📌 Un círculo puede tener appeal si se mueve bien.

---

## 🧪 Ejercicio recomendado (muy potente)

👉 **Un solo círculo, un solo color**, y aplica:

- Squash & Stretch
- Anticipation
- Slow in/out
- Arcs

Eso es animación pura.

---

## 🖥️ Implementación en este Sketch

### Grid Layout (3x4)

| Col 1              | Col 2              | Col 3         |
| ------------------ | ------------------ | ------------- |
| ① Squash & Stretch | ② Anticipation     | ③ Staging     |
| ④ Straight Ahead   | ⑤ Follow Through   | ⑥ Slow In/Out |
| ⑦ Arcs             | ⑧ Secondary Action | ⑨ Timing      |
| ⑩ Exaggeration     | ⑪ Solid Drawing    | ⑫ Appeal      |

### Técnicas usadas

- **Easing functions**: `easeInOut`, `easeOutBounce`, `easeOutElastic`, `easeInBack`
- **Glow effects**: `drawingContext.shadowColor` y `shadowBlur`
- **Follow Through**: Interpolación con `lerp` y diferentes velocidades
- **Clipping**: Cada celda tiene su propio área de renderizado

### Archivos

- `index.html` - Estructura HTML con p5.js
- `sketch.js` - Lógica de animación con los 12 principios

---

## 🎯 Conexión con tu perfil

Por lo que vienes explorando (p5, estética cyber 90s, forma + color):

- Estos principios **definen estilo**, no solo realismo
- Son claves para motion abstracto, generativo y audiovisual
- Funcionan increíble con audio-reactive visuals
