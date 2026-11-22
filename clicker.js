const clicker = document.querySelector(".clicker-demo");
const cap = clicker.querySelector(".clicker-cap");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let pressAnimation;
let audio;
let clickSample;

function playClick() {
  if (!window.AudioContext) return;

  audio ??= new AudioContext();
  if (!clickSample) {
    const sampleRate = audio.sampleRate;
    clickSample = audio.createBuffer(1, Math.ceil(sampleRate * 0.046), sampleRate);
    const signal = clickSample.getChannelData(0);

    for (let frame = 0; frame < signal.length; frame++) {
      const time = frame / sampleRate;
      const noise = Math.random() * 2 - 1;
      const resonance = Math.sin(2 * Math.PI * 940 * time);
      signal[frame] = (0.24 * noise + 0.14 * resonance) * Math.exp(-210 * time);
    }
  }

  if (audio.state === "suspended") audio.resume().catch(() => {});
  const source = audio.createBufferSource();
  source.buffer = clickSample;
  source.connect(audio.destination);
  source.start();
}

clicker.addEventListener("pointerdown", () => pressAnimation?.cancel());
clicker.addEventListener("click", () => {
  if (!reducedMotion.matches) {
    pressAnimation?.cancel();
    pressAnimation = cap.animate([
      { transform: "translateY(17px)" },
      { transform: "translateY(-5px)", offset: 0.57 },
      { transform: "translateY(0)" },
    ], { duration: 260, easing: "ease-out" });
  }
  playClick();
});
