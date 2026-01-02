// ================================
// Genuary | JAN 1 | DEEP BLUE
// ================================

await initHydra();

// ================================
// TEMPO GLOBAL
// ================================
setcps(0.8);

// ================================
// VISUAL
// ================================

// Campo base (materia)
noise(1.2, 0.03)
  // Segundo campo = metaballs falsas
  .add(noise(1.5, 0.02).scrollX(0.01).scrollY(-0.008))

  // UMBRAL VIVO
  // Oscila lentamente siguiendo el tiempo global (cps)
  .thresh(
    sine.range(0.42, 0.48).slow(16) // ← respiración larga
  )

  // Suavizado
  .contrast(2)

  // Color único — Deep Blue
  .color(0, 0.15, 0.6)
  .brightness(-0.12)

  // erosión
  .modulateScrollY(o0, sine.range(-0.002, 0.002).slow(32))

  // Cada tanto el movimiento se detiene
  .modulate(noise(0.5), sine.range(0, 0.02).slow(64))

  .out(o0);

// ================================
// AUDIO — STRINGS
// ================================
$: chord("<Cm9 AbM7 EbM7 Cm9 AbM7 Fm7 Gm>/8")
  .s("gm_synth_strings_2")
  .voicing()
  .release(0.6)
  .gain(0.1)
  .room(0.5);

// ================================
// AUDIO — HARP
// ================================
$: note(`
<
  [d4 eb4 bb3 g3]!7
  [~ ~ ~ ~]
  [c4 bb3 eb3 f3]
  [ab3 g3 eb3 c3]
  [c4 bb3 eb3 f3]
  [ab3 g3 eb3 c3]
  [c4 bb3 eb3 f3]
  [ab3 g3 eb3 c3]
  [~ ~ ~ ~]
  [~ ~ ~ ~]
>
`)
  .s("gm_orchestral_harp")
  .delay(0.5)
  .room(0.8)
  .size(4)
  .decay(0.9)
  .sustain(0)
  .gain(0.2);

// ================================
// AUDIO — LEAD
// ================================
$: note("<c4 eb4>/16").s("gm_lead_2_sawtooth").gain(0.05);

// ================================
// AUDIO — HARMONICA
// ================================
$: note("<c3 ab2>/8").s("gm_harmonica").gain(0.05);

// hush()
