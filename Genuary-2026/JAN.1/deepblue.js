await initHydra()

// ================================
// VISUAL — DEEP BLUE
// ================================


shape(100, 0.1, 0.5)
  .modulateScale(
    noise(9, 0.08), 
    () => 0.35 + Math.sin(time * 0.25) * 0.15
  )
  .modulateScale(
    noise(9, 0.5)
      .rotate(() => time * 0.05), 
    0.25
  )
  .modulate(
    noise(9, 0.04),
    () => 0.08 + Math.sin(time * 0.3) * 0.04
  )

  .color(0.02, 0.2, 0.7)
  .saturate(2.5)
  .contrast(2.2)
  .brightness(-0.05)

  .scrollX(() => Math.sin(time * 0.08) * 0.06 + Math.cos(time * 0.15) * 0.03)
  .scrollY(() => Math.cos(time * 0.06) * 0.05 + Math.sin(time * 0.12) * 0.02)
  .rotate(() => Math.sin(time * 0.04) * 0.1)
  // Respiración celular orgánica
  .scale(() => 1 + Math.sin(time * 0.18) * 0.12 + Math.cos(time * 0.25) * 0.06)

  .add(
    shape(100, 0.18, 0.05)
      .modulateScale(noise(1.5, 0.08), () => 0.35 + Math.sin(time * 0.25) * 0.15)
      .color(0.1, 0.3, 0.5)
      .brightness(-0.3)
      .scrollX(() => Math.sin(time * 0.08) * 0.06 + Math.cos(time * 0.15) * 0.03)
      .scrollY(() => Math.cos(time * 0.06) * 0.05 + Math.sin(time * 0.12) * 0.02)
      .scale(() => 1 + Math.sin(time * 0.18) * 0.12 + Math.cos(time * 0.25) * 0.06),
    0.4
  )
  .out(o0)

// ================================
// AUDIO — STRINGS
// ================================
$: chord("<Cm9 AbM7 EbM7 Cm9 AbM7 Fm7 Gm>/8")
  .s("gm_synth_strings_2")
  .voicing()
  .release(0.6)
  .gain(0.1)
  .room(0.5)

// ================================
// AUDIO — HARP
// ================================
$: note(`<
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
>`)
  .s("gm_orchestral_harp")
  .delay(0.5)
  .room(0.8)
  .size(4)
  .decay(0.9)
  .sustain(0)
  .gain(0.2)

// ================================
// AUDIO — LEAD
// ================================
$: note("<c5 eb5>/16")
  .s("gm_lead_7_fifths")
  .gain(0.05)

// ================================
// AUDIO — HARMONICA
// ================================
$: note("<c3 ab2>/8")
  .s("gm_harmonica")
  .gain(0.05)

// hush()