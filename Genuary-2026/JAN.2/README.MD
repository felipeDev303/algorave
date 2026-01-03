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

👉 **"Las cosas no se detienen de golpe; primero una parte y luego otra"** — Walt Disney

Estos dos principios trabajan juntos para crear movimiento realista y con vida. Sin ellos, las animaciones parecen rígidas y robóticas.

### Definiciones:

| Principio              | Descripción                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Follow Through**     | Partes del cuerpo continúan moviéndose después de que la acción principal termine |
| **Overlapping Action** | Diferentes partes del cuerpo se mueven a velocidades distintas                    |

### Técnica clave: DRAG

Consiste en **ralentizar el movimiento de las partes secundarias** que intentan seguir al cuerpo principal. Los apéndices (pelo, cola, capa) siempre van "por detrás" del movimiento principal.

### Casos de aplicación:

#### Caso 1: Apéndices que siguen

- Una capa larga o orejas continúan moviéndose después de que el personaje se detenga
- Ejemplo: Maceta moviéndose → la flor es lo último en llegar y oscila por inercia antes de estabilizarse

#### Caso 2: Partes del cuerpo a diferente velocidad

- Cuando el cuerpo se detiene, la mano sigue un frame más antes de parar
- Al frenar de un salto, el cuerpo se dobla por inercia más allá del punto de freno, luego vuelve a erguirse

#### Caso 3: Materiales blandos (Drag)

- Mejillas, piel flácida, grasa se mueven más lento que las partes sólidas
- Aplican drag respecto a la actividad principal

#### Caso 4: Jerarquía de movimiento

- **El codo lidera** → luego el brazo → finalmente la mano
- Incluso al caminar: el brazo va detrás del codo, la mano sigue al brazo

#### Caso 5: "Keep moving" (seguir moviéndose)

- Aunque el personaje se detenga, partes "flotantes" siguen oscilando
- Transmite peso y autenticidad del material (pelo, tela, etc.)

### En p5.js:

```js
// Follow Through con diferentes velocidades de lerp
mainX = targetX; // El cuerpo llega instantáneo

// Apéndices con retraso (drag)
armX = lerp(armX, mainX, 0.15); // Brazos: rápido
capeX = lerp(capeX, mainX, 0.08); // Capa: medio
hairX = lerp(hairX, mainX, 0.04); // Pelo: lento

// Oscilación por inercia al detenerse
if (stopped) {
  overshoot = sin(frameCount * 0.2) * damping;
  damping *= 0.95; // Se reduce con el tiempo
}
```

### Jerarquía de movimiento:

```js
// El codo lidera, el brazo sigue, la mano va última
elbowX = lerp(elbowX, shoulderX + offset, 0.2);
wristX = lerp(wristX, elbowX + offset, 0.15);
handX = lerp(handX, wristX + offset, 0.1);
```

📌 **Error común**: Todo se mueve al mismo tiempo. Cada parte debe tener su propia velocidad.

📌 **Transmite material**: Más drag = más blando/pesado. Menos drag = más rígido/ligero.

📌 **Combina con**: Squash & Stretch para materiales elásticos, Arcs para trayectorias naturales.

---

## 6️⃣ Slow In & Slow Out

👉 **Todo movimiento en el universo sigue el principio de aceleración y desaceleración.**

También conocido como "Ease In & Ease Out". Sin este principio, todo se sentiría rígido y mecánico —solo un robot se movería a velocidad constante.

### Definiciones:

| Término      | Descripción                                                    |
| ------------ | -------------------------------------------------------------- |
| **Slow In**  | La velocidad aumenta gradualmente (de estático a movimiento)   |
| **Slow Out** | La velocidad disminuye gradualmente (de movimiento a estático) |

### Analogía del coche:

- **Arrancar**: El coche acelera lento → gana inercia → alcanza velocidad máxima
- **Frenar**: El coche desacelera gradualmente → se detiene suavemente

### Cómo funciona en animación:

Se logra **añadiendo más frames** al inicio y al final del movimiento:

```
Inicio ●●●●●○○○○○○○○●●●●● Final
       ↑                 ↑
    Más frames       Más frames
    (slow in)        (slow out)
```

- **Cerca de keyframes**: Los intermedios están muy juntos (lento)
- **En el centro**: Los frames están más separados (rápido)

### Funciones de easing comunes:

```js
// Ease In (acelera)
function easeIn(t) {
  return t * t;
}

// Ease Out (desacelera)
function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}

// Ease In-Out (acelera y desacelera)
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Smooth step (suave)
function smoothStep(t) {
  return t * t * (3 - 2 * t);
}
```

### En p5.js:

```js
const t = (frame % 120) / 120;

// Sin easing (robótico)
const linear = t;

// Con easing (natural)
const eased = easeInOut(t);

// Aplicar al movimiento
x = lerp(startX, endX, eased);
```

### Casos especiales:

| Situación           | Aplicación                                    |
| ------------------- | --------------------------------------------- |
| Pelota rebotando    | NO slow in al aterrizar, SÍ slow out al subir |
| Personaje corriendo | Necesita frames de transición al arrancar     |
| Objeto cayendo      | Acelera (slow in), impacto abrupto            |
| Puerta cerrándose   | Slow out antes de cerrar completamente        |

### Error común de principiantes:

**Problema**: Distancia entre frames demasiado grande en poco tiempo → el personaje "salta" de quieto a correr.

**Solución**: Añadir frames intermedios o redistribuir el espaciado:

```js
// MAL: salto abrupto
if (running) x += 10;

// BIEN: transición suave
const targetSpeed = running ? 10 : 0;
currentSpeed = lerp(currentSpeed, targetSpeed, 0.1);
x += currentSpeed;
```

📌 **Error común**: Velocidad constante. En la vida real, nada se mueve así excepto máquinas.

📌 **Analiza el espaciado**: Si el movimiento se ve "raro", revisa la distancia entre frames.

📌 **Combina con**: Follow Through (las partes secundarias también necesitan easing propio).

---

## 7️⃣ Arcs

👉 **Casi todo en el universo se mueve en curvas o arcos, gracias a las leyes de la física.**

Las líneas rectas perfectas son raras en la naturaleza. Incluso movimientos que parecen rectos tienen micro-arcos debido a la gravedad y la inercia.

### Por qué existen los arcos:

- **Gravedad**: Tira los objetos hacia abajo constantemente
- **Articulaciones**: Los huesos rotan alrededor de pivotes (codos, hombros, caderas)
- **Inercia**: Los objetos tienden a seguir trayectorias curvas al cambiar de dirección

### Caso 1: Pelota rebotando

```
MAL (línea recta):          BIEN (arco):
    ●                           ●
    |                          / \
    |                         /   \
    ●───────●                ●     ●
```

Colocar los in-betweens en una **curva** hace el movimiento realista. Además, aplicar slow in/out según la gravedad.

### Caso 2: Péndulo

Si dibujas el péndulo con interpolación lineal entre extremos, **el brazo se acorta** en el centro.

**Solución**: Usar el fulcro como eje de rotación → el arco se forma naturalmente y la longitud se mantiene.

```js
// MAL: interpolación lineal (acorta el brazo)
x = lerp(leftX, rightX, t);
y = centerY;

// BIEN: rotación alrededor del pivote
angle = lerp(-maxAngle, maxAngle, t);
x = pivotX + sin(angle) * armLength;
y = pivotY + cos(angle) * armLength;
```

### Caso 3: Brazo balanceándose al caminar

Un simple balanceo de brazo contiene **3 arcos anidados**:

1. **Hombro** → arco principal
2. **Codo** → arco secundario
3. **Muñeca/dedos** → arco terciario

```js
// Jerarquía de arcos
shoulderAngle = sin(walkT) * 0.5;
elbowAngle = sin(walkT + 0.2) * 0.3; // Desfasado
wristAngle = sin(walkT + 0.4) * 0.2; // Más desfasado
```

### Caso 4: Aterrizaje y levantarse

Cuando un personaje aterriza de un salto:

1. Se agacha (arco hacia abajo)
2. Estabiliza postura (micro-arco de ajuste)
3. Levanta la cabeza (arco hacia arriba)
4. Se incorpora completamente

Cada transición tiene su propio arco, no son movimientos rectos.

### Arcos en 3D:

Mantener movimiento constante en X pero ajustar Y con easing:

```js
// Movimiento parabólico (arco natural)
x += velocityX;
y = startY - 4 * h * t * (1 - t); // Parábola donde h = altura máxima

// O con física simple
y += velocityY;
velocityY += gravity;
```

### Excepciones (aparentes):

| Objeto     | Parece recto pero...                                      |
| ---------- | --------------------------------------------------------- |
| **Bala**   | Muy rápida, pero la gravedad la curva eventualmente       |
| **Flecha** | Describe un arco notable, especialmente a larga distancia |
| **Láser**  | Único caso de línea recta real (luz)                      |
| **Robot**  | Puede moverse recto intencionalmente (efecto mecánico)    |

### En p5.js:

```js
// Órbita elíptica
x = centerX + cos(angle) * radiusX;
y = centerY + sin(angle) * radiusY;
angle += speed;

// Arco de salto (parábola)
const jumpProgress = (frame % 60) / 60;
const arcHeight = sin(jumpProgress * PI) * maxHeight;
y = groundY - arcHeight;

// Péndulo
const pendulumAngle = sin(frame * 0.05) * maxSwing;
x = pivotX + sin(pendulumAngle) * length;
y = pivotY + cos(pendulumAngle) * length;
```

📌 **Error común**: Interpolar posiciones en línea recta. Siempre usa rotación o curvas.

📌 **Observación clave**: Dedica tiempo a observar movimientos reales. Hasta las acciones más simples tienen arcos sutiles.

📌 **Combina con**: Follow Through (los apéndices siguen sus propios arcos), Slow In/Out (velocidad variable en el arco).

---

## 8️⃣ Secondary Action

👉 **Acciones que apoyan o enfatizan la acción principal, añadiendo capas de información.**

A menudo se confunde con Overlapping Action (principio 5), pero son completamente diferentes:

| Principio              | Función                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **Overlapping Action** | Partes del cuerpo moviéndose a diferentes velocidades (físico)   |
| **Secondary Action**   | Acciones adicionales que revelan estado emocional o personalidad |

### Definición:

Las acciones secundarias **añaden dimensiones de información** sobre el personaje sin necesidad de una escena separada. Son gestos, expresiones o movimientos que complementan la acción principal.

**Ejemplo clásico**: Persona enfadada caminando

- **Acción principal**: Las piernas caminando
- **Acciones secundarias**: Manos apretadas, ceño fruncido, hombros tensos

### Casos de aplicación:

#### Caso 1: Revelar estado emocional

Un personaje llama a la puerta. La acción principal es tocar, pero el otro brazo revela su estado:

| Estado         | Acción secundaria                               |
| -------------- | ----------------------------------------------- |
| **Ira**        | Puño cerrado, cuerpo tenso                      |
| **Buen humor** | Mano relajada con gesto suave                   |
| **Nervioso**   | Manos cerca del pecho, cabeza girando vigilante |

#### Caso 2: Añadir personalidad

Para un acto simple como levantar algo, puedes hacer que el personaje se frote las manos antes de levantar → muestra anticipación y personalidad.

#### Caso 3: Expresividad al comer

Acción principal: Comer un pastel

Acciones secundarias en secuencia:

1. Humedecerse los labios → indica hambre
2. Cerrar los ojos y alzar cejas → muestra que le gusta
3. Negar con la cabeza → incredulidad de lo bueno que está

### Regla clave: Balance con Staging

La acción secundaria **no debe dominar** sobre la principal, pero tampoco ser invisible.

**Problema**: Si la acción secundaria cubre la principal, se pierde el mensaje.

**Solución**: Aplicar Staging para organizar la secuencia:

```
MAL:  Secarse lágrimas cubriendo la cara triste
BIEN: Secarse lágrimas primero → luego mostrar cara triste como foco
```

### Cuándo es necesaria:

- Cuando la acción principal es **demasiado simple o vaga**
- Cuando el espectador podría **confundirse** sobre la intención
- Para dar **profundidad y vida** al personaje

### En p5.js:

```js
// Acción principal: cuerpo caminando
bodyY = baseY + sin(walkCycle * PI * 2) * 5;

// Acciones secundarias (independientes pero relacionadas)
headBob = sin(walkCycle * PI * 4 + 0.5) * 3; // Cabeza con timing diferente
armSwing = sin(walkCycle * PI * 2) * 0.4; // Brazos balanceándose
// Estado emocional en la expresión
if (mood === "angry") {
  eyebrowAngle = -0.3; // Ceño fruncido
  fistClenched = true;
}
```

### Diferencia práctica con Overlapping:

```js
// OVERLAPPING: Física del pelo siguiendo la cabeza
hairX = lerp(hairX, headX, 0.1); // Mismo movimiento, diferente timing

// SECONDARY ACTION: Gesto independiente que añade información
if (walking) {
  whistling = sin(frame * 0.1); // Silbar mientras camina (revela buen humor)
}
```

📌 **Error común**: Confundir con Overlapping. Secondary Action añade **información emocional**, no solo física.

📌 **No compitas**: La acción secundaria apoya, nunca debe robar protagonismo a la principal.

📌 **Combina con**: Staging (organizar la jerarquía visual), Timing (separar acciones en el tiempo).

---

## 9️⃣ Timing

👉 **El timing determina el éxito o fracaso de una animación. Un poco más lento o más rápido cambia completamente el significado.**

Timing se refiere a la correlación entre el **número de fotogramas** (duración del movimiento) y el **espaciado entre ellos** (distancia en la trayectoria).

### Fórmula básica:

| Configuración                   | Resultado         |
| ------------------------------- | ----------------- |
| Pocos frames + espaciado amplio | Movimiento rápido |
| Muchos frames + espaciado corto | Movimiento lento  |

### El poder del timing:

Una acción simple puede tener **hasta 10 significados diferentes** dependiendo del número de frames:

**Ejemplo**: Personaje girando la cabeza de un hombro al otro

| Intermedios | Significado percibido                       |
| ----------- | ------------------------------------------- |
| **0**       | Golpe violento, casi le rompe el cuello     |
| **1**       | Impacto fuerte, como un golpe con objeto    |
| **2**       | Espasmo muscular involuntario               |
| **5**       | Gesto amigable: "Por aquí, ven, date prisa" |
| **10**      | Estirando músculos doloridos, relajación    |

### Animación "On 1s", "On 2s", "On 3s":

La tasa estándar en cine es **24 fps**. Pero no siempre se dibuja cada frame:

#### On 1s (1 dibujo = 1 frame)

- **24 dibujos por segundo**
- Movimiento ultra-fluido, coincide con la percepción del ojo humano
- Ideal para: movimientos rápidos, potentes, alta energía
- Usado en: Disney clásico, Fleischer, animación 3D, stop-motion

#### On 2s (1 dibujo = 2 frames)

- **12 dibujos por segundo**
- Balance entre fluidez y eficiencia
- Ideal para: movimientos suaves, gentiles, más lentos
- Usado en: TV animation, cartoons occidentales
- La mayoría de espectadores no notan diferencia con On 1s

#### On 3s (1 dibujo = 3 frames)

- **8 dibujos por segundo**
- Reduce carga de trabajo sin perder calidad
- Ideal para: anime con muchos detalles y capas de sombras
- Usado en: Anime japonés, algunos estudios europeos

#### On 4s (no recomendado)

- Movimientos poco suaves, demasiado separado para el ojo humano

### Combinación inteligente:

Las películas profesionales **combinan On 1s y On 2s** fluidamente según la escena:

```js
// Acción rápida: On 1s (más frames, más suave)
if (actionType === "fast") {
  frameSkip = 1;
}

// Movimiento tranquilo: On 2s (menos frames, eficiente)
if (actionType === "slow") {
  frameSkip = 2;
}
```

### En p5.js:

```js
// Simular On 2s (ejecutar lógica cada 2 frames)
if (frameCount % 2 === 0) {
  updateAnimation();
}

// Timing basado en frames, no en tiempo real
const actionFrame = frameCount % 60; // Ciclo de 60 frames

// Diferentes duraciones = diferentes emociones
const quickTurn = (frame % 10) / 10; // Giro rápido (10 frames)
const slowTurn = (frame % 60) / 60; // Giro lento (60 frames)
```

### Qué cambia el timing:

| Aspecto     | Timing rápido          | Timing lento          |
| ----------- | ---------------------- | --------------------- |
| **Emoción** | Sorpresa, ira, energía | Tristeza, calma, peso |
| **Peso**    | Ligero, ágil           | Pesado, masivo        |
| **Estilo**  | Cartoon, cómico        | Realista, dramático   |

### Observación de la vida real:

El timing requiere **observación cuidadosa** de movimientos cotidianos:

- ¿Cuánto tarda alguien en girar la cabeza normalmente?
- ¿Cómo cambia si está sorprendido vs relajado?
- ¿Cómo afecta el peso del objeto a la velocidad?

📌 **Error común**: Usar el mismo timing para todo. Cada acción necesita su propio cálculo.

📌 **Física aplicada**: Los objetos pesados se mueven más lento, los ligeros más rápido.

📌 **Combina con**: Slow In/Out (espaciado variable dentro del timing), Exaggeration (exagerar duraciones para efecto).

---

## 🔟 Exaggeration

👉 **Hacer que la naturaleza de la idea y la acción resulten más atractivas y vívidas, no aplicar realismo literal.**

La famosa paradoja de Walt Disney: pedía "más realismo" a sus animadores, pero cuando lo aplicaban literalmente, criticaba el resultado por no estar "suficientemente exagerado". Lo que Walt quería era **realismo emocional**, no realismo fotográfico.

### Definición:

Exagerar significa hacer que algo parezca **más grande, mejor, peor o más importante** de lo que es en la realidad. En animación, esto se traduce en amplificar la esencia de una acción o emoción para hacerla más clara y convincente.

### Regla de oro:

> La exageración no hace que la acción sea menos creíble, sino que la hace **más convincente**.

### Aplicación en expresiones:

| Emoción original | Exageración aplicada                  |
| ---------------- | ------------------------------------- |
| Triste           | Más hundido, lágrimas visibles        |
| Feliz            | Más luminoso, sonrisa más amplia      |
| Nervioso         | Más tembloroso, sudor visible         |
| Sorprendido      | Ojos más grandes, boca más abierta    |
| Enfadado         | Cejas más fruncidas, cuerpo más tenso |

### Por qué funciona en movimiento rápido:

Cuando el encuadre está quieto, un dibujo exagerado puede parecer "demasiado". Pero **en movimiento**, se ve perfectamente realista.

**Razón**: En una secuencia, los frames "normales" son mayoría. Los frames exagerados pasan tan rápido que el ojo apenas los registra conscientemente, pero **sí los siente**.

**Solución para acciones rápidas**:

- Hacer que el frame exagerado dure más tiempo en pantalla
- O exagerar aún más el dibujo para compensar la brevedad

### Método práctico:

```
1. Empuja la exageración hasta que sea "demasiado"
2. Retrocede gradualmente hasta el nivel satisfactorio
3. Observa todo el proceso para tener control
```

Este método es mejor que dibujar sin referencia, porque te da un rango completo para elegir.

### Comparación visual:

De dos acciones idénticas en naturaleza:

- **Con exageración** → Más atractiva visualmente, más poderosa
- **Sin exageración** → Parece incompleta, menos impactante

### En p5.js:

```js
// Exageración multiplicativa (mejor que aditiva)
jumpHeight *= 1.8; // No: jumpHeight += 50
rotationSpeed *= 2.5; // Más dramático
scaleImpact *= 1.5; // Squash más pronunciado

// Exagerar expresiones
if (emotion === "happy") {
  smileWidth *= 1.4;
  eyeOpenness *= 1.3;
  bounceHeight *= 1.6;
}

// Exagerar según velocidad
if (speed > threshold) {
  stretchFactor = 1 + speed * 0.3; // Más rápido = más stretch
}

// Comparación: normal vs exagerado
const normalPulse = 1 + sin(t) * 0.1; // Sutil
const exaggeratedPulse = 1 + sin(t) * 0.4; // Dramático
```

### Cuándo exagerar más:

| Situación            | Nivel de exageración |
| -------------------- | -------------------- |
| Estilo cartoon       | Alto                 |
| Comedia              | Muy alto             |
| Drama realista       | Sutil pero presente  |
| Acción rápida        | Muy alto (compensa)  |
| Expresiones faciales | Medio-alto           |
| Física de objetos    | Según material       |

📌 **Error común**: No exagerar lo suficiente. En animación digital, casi siempre necesitas **más** exageración de la que crees.

📌 **Multiplica, no sumes**: `scale *= 1.5` es mejor que `scale += 0.5` porque mantiene proporciones.

📌 **Combina con**: Squash & Stretch (exagerar deformaciones), Timing (exagerar duraciones), Anticipation (exagerar el retroceso).

---

## 1️⃣1️⃣ Solid Drawing

👉 **Crear la ilusión de un objeto 3D con volumen, peso y proporción usando solo trazos 2D.**

Este principio proviene de las técnicas de pintura realista tradicional. El objetivo es que tus personajes y objetos tengan **profundidad y verdad**, no parezcan símbolos planos o logotipos.

### Fundamentos:

Para que tu animación sea realista, necesitas poder dibujar personajes desde **diferentes ángulos**, lo cual requiere conocimiento de perspectiva.

### Reglas clave:

#### 1. Líneas en superficies curvas

Cuando dibujas una línea en una esfera, esa línea debe **curvarse** alrededor de la superficie:

```
MAL (plano):        BIEN (volumen):
   ___                 ___
  | | |               /   \
  |---|              (---)
  |___|               \___/
```

Una línea recta hace que el círculo parezca plano.

#### 2. Evita líneas paralelas

Las líneas paralelas dan impresión de **plano**. En su lugar:

- Usa líneas que **converjan** hacia puntos de fuga
- Combina líneas rectas con curvas para sugerir volumen

```js
// MAL: Paralelas (plano)
line(x, y, x + 50, y);
line(x, y + 20, x + 50, y + 20);

// BIEN: Convergentes (profundidad)
line(x, y, x + 50, y + 5); // Convergen hacia un punto
line(x, y + 20, x + 50, y + 18);
```

#### 3. Formas básicas 3D para construir

Usa **esferas, cubos y cilindros** (no círculos, cuadrados y triángulos) para bocetos:

| 2D (plano) | 3D (volumen)  |
| ---------- | ------------- |
| Círculo    | Esfera        |
| Cuadrado   | Cubo          |
| Triángulo  | Pirámide/Cono |
| Rectángulo | Cilindro      |

Esto te ayuda a vigilar el **bloque y volumen** del personaje.

#### 4. Perspectiva desde el suelo

Dibuja una línea de suelo en perspectiva para:

- Controlar la distancia entre personajes y cámara
- Saber si un personaje debe ser más grande o más pequeño
- Mantener consistencia de escala

#### 5. Trazos que describen bloques

Al hacer los trazos finales, **describe los diferentes bloques** superpuestos. A veces basta con un trazo extra para crear la ilusión de espacio entre planos:

```
MAL (plano):     BIEN (profundidad):
  ____              ____
 |    |            |    |
 |____|            |____|__
                      |    |
                      |____|
```

### En p5.js:

```js
// Elipse con perspectiva (no círculo perfecto)
ellipse(x, y, size, size * 0.7); // Más ancho que alto = visto desde arriba

// Esfera con líneas de latitud curvas
for (let i = 0; i < 5; i++) {
  const lat = map(i, 0, 4, -radius, radius);
  const latRadius = sqrt(radius * radius - lat * lat);
  // Curva, no línea recta
  arc(cx, cy + lat, latRadius * 2, latRadius * 0.3, 0, PI);
}

// Cilindro con convergencia
beginShape();
vertex(x - topWidth, y); // Arriba más estrecho
vertex(x + topWidth, y);
vertex(x + bottomWidth, y + h); // Abajo más ancho
vertex(x - bottomWidth, y + h);
endShape(CLOSE);

// Profundidad con opacidad
for (let z = 0; z < 5; z++) {
  const depth = z / 5;
  stroke(col.r, col.g, col.b, 255 * (1 - depth * 0.5)); // Más lejos = más tenue
  strokeWeight(2 - depth); // Más lejos = más fino
  circle(x, y + z * 10, size - z * 5);
}
```

### Técnicas para simular volumen en código:

| Técnica               | Efecto                         |
| --------------------- | ------------------------------ |
| Variación de grosor   | Líneas más gruesas = más cerca |
| Gradiente de opacidad | Más transparente = más lejos   |
| Escala decreciente    | Más pequeño = más distancia    |
| Elipses (no círculos) | Sugiere ángulo de visión       |
| Sombras proyectadas   | Ancla objetos al suelo         |

📌 **Error común**: Usar círculos perfectos y líneas paralelas. Esto produce formas planas sin intención.

📌 **Principio fundamental**: Si puedes dibujar una caja en perspectiva correcta, puedes dibujar casi cualquier cosa.

📌 **Combina con**: Staging (composición con profundidad), Arcs (trayectorias que respetan el espacio 3D).

---

## 1️⃣2️⃣ Appeal

👉 **El factor que hace que un personaje sea "llamativo" e interesante, incluso sin movimiento.**

Appeal no significa necesariamente "bonito" o "elegante". Significa **interesante, atractivo, memorable**. Un villano puede ser horrible pero debe ser horrible de manera "atractiva". Un héroe puede ser torpe pero debe ser torpe de manera "encantadora".

### Definición:

El atractivo es lo que hace que el público quiera **seguir mirando**. Es la combinación de diseño visual y personalidad que conecta emocionalmente con el espectador.

**Paradoja del Appeal**: Cada persona tiene estándares de "belleza" diferentes, pero existen principios de diseño que funcionan casi universalmente.

### 3 pasos para crear Appeal:

#### 1. Variedad de formas

No uses la misma forma repetidamente. Combina círculos, cuadrados, triángulos de diferentes tamaños:

```
ABURRIDO:           CON APPEAL:
  □ □ □               ○ △ □
  □ □ □               ◇   ○
  □ □ □             △   ◇
```

Todos los buenos diseños de personajes empiezan con **formas claras y variadas**.

#### 2. Jugar con proporciones

Los animadores **exageran lo interesante** y minimizan lo aburrido:

| Elemento                 | Exageración típica      |
| ------------------------ | ----------------------- |
| Cabeza/ojos              | Agrandar (expresividad) |
| Cuerpo                   | Encoger o estilizar     |
| Manos                    | Agrandar (gestualidad)  |
| Característica principal | Enfatizar al máximo     |

Encuentra qué aspectos expresan mejor la personalidad del personaje y **ponlos en valor**.

#### 3. Simplicidad

Demasiados detalles = complejidad excesiva = difícil de animar.

**Diferencia clave**: En ilustración puedes añadir infinitos detalles. En animación, tendrás que dibujar ese personaje **cientos de veces**.

```
ANTES (genérico):         DESPUÉS (con appeal):
  ┌───────┐
  │ Rey   │     →         🥚 Rey en forma de huevo
  │normal │                  = orgulloso, pequeño, fuerte
  └───────┘

  ┌───────┐
  │Robot  │     →         🤖 Robot simplificado
  │muchos │                  = misterioso, amenazante
  │detalles│
  └───────┘
```

### Appeal en el movimiento:

El diseño atractivo es solo el inicio. El **appeal completo** viene de cómo se mueve el personaje.

Todos los principios anteriores contribuyen al appeal en movimiento:

| Principio        | Contribución al Appeal   |
| ---------------- | ------------------------ |
| Squash & Stretch | Vida y elasticidad       |
| Anticipation     | Intención clara          |
| Staging          | Legibilidad de la pose   |
| Follow Through   | Naturalidad física       |
| Slow In/Out      | Suavidad y peso          |
| Arcs             | Fluidez orgánica         |
| Timing           | Personalidad en el ritmo |
| Exaggeration     | Expresividad aumentada   |
| Secondary Action | Capas de personalidad    |
| Solid Drawing    | Credibilidad del volumen |

### En p5.js:

```js
// Appeal a través de asimetría (no perfecto = más interesante)
const wobble = sin(frame * 0.04) * 0.1;
const breathe = 1 + sin(frame * 0.03) * 0.08;
const bounce = abs(sin(frame * 0.05)) * 5;

// Transformaciones que dan vida
push();
translate(cx, cy - bounce); // Micro-rebote
rotate(wobble); // Inclinación sutil
scale(breathe); // "Respiración"

// Forma base
ellipse(0, 0, 45, 50); // Asimétrica (no círculo)

// Ojos con personalidad (diferentes tamaños = más appeal)
circle(-10, -8, 8); // Ojo izquierdo
circle(10, -5, 10); // Ojo derecho (más grande, diferente altura)

// Sonrisa asimétrica
arc(0, 8, 20, 15, 0.2, PI - 0.2);
pop();

// Detalles que añaden magia
for (let i = 0; i < 3; i++) {
  // Sparkles/destellos
  const sparkleAngle = frame * 0.05 + (i * TWO_PI) / 3;
  const sparkleX = cos(sparkleAngle) * 50;
  const sparkleY = sin(sparkleAngle) * 50;
  point(cx + sparkleX, cy + sparkleY);
}
```

### Checklist de Appeal:

- [ ] ¿Las formas son variadas y claras?
- [ ] ¿Las proporciones enfatizan la personalidad?
- [ ] ¿El diseño es lo suficientemente simple para animar?
- [ ] ¿El movimiento tiene ritmo y personalidad?
- [ ] ¿Hay asimetría intencional?
- [ ] ¿El personaje es memorable después de verlo una vez?

📌 **Error común**: Diseñar personajes genéricos sin características distintivas. Cada personaje necesita un "gancho" visual.

📌 **Principio fundamental**: Un círculo simple puede tener appeal si se mueve con personalidad. El appeal está tanto en el diseño como en el movimiento.

📌 **Para mejorar**: Estudia actuación de cine y teatro. El appeal en animación viene de entender cómo los humanos expresamos emociones.

📌 **Combina con**: TODOS los principios. Appeal es el resultado final de aplicar bien los otros 11 principios.

---

## 🎬 Conclusión: Los 12 Principios como Sistema

Los 12 principios no son reglas aisladas, son un **sistema interconectado**:

```
                    ┌─────────────┐
                    │   APPEAL    │  ← Resultado final
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────┴────┐      ┌─────┴─────┐     ┌─────┴─────┐
    │ DISEÑO  │      │ FÍSICA    │     │ ACTUACIÓN │
    └────┬────┘      └─────┬─────┘     └─────┬─────┘
         │                 │                 │
    Solid Drawing    Squash&Stretch      Staging
    Exaggeration     Follow Through      Anticipation
                     Slow In/Out         Secondary Action
                     Arcs                Timing
                     Straight/Pose
```

Cada principio refuerza a los demás. Dominarlos es dominar el arte de dar vida a lo inanimado.

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
