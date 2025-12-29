setcps(1.2); // 72 BPM

$: note(
  "<[d4 eb4 bb3 g3]!8 [c4 bb3 eb3 f3] [ab3 g3 eb3 c2] [c4 bb3 eb3 f3] [ab3 g3 eb3 c2] [c4 bb3 eb3 f3] [ab3 g3 eb3 c2] [c4 bb3 eb3 f3] [ab3 g3 eb3 c2] >"
)
  .s("triangle")
  .tremolosync("4")
  .tremoloskew("<.5>")
  .gain(0.5)
  .cutoff(sine.range(600, 1000).slow(16))
  .pan(sine.range(-0.7, 0.7))
  .scale("C:minor")
  .room(1)
  .roomsize(6)
  .color("blue")
  ._pianoroll();
