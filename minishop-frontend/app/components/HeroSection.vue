<script setup lang="ts">
import { ArrowRight, Sparkles, Star } from "lucide-vue-next";
import { ref, onMounted } from "vue";

const prefersReducedMotion = ref(false);

const sectionRef = ref<HTMLElement | null>(null);

const spotlightStyle = ref({
  "--x": "50%",
  "--y": "40%",
});

function handleSpotlight(e: MouseEvent) {
  if (prefersReducedMotion.value || !sectionRef.value) return;

  const rect = sectionRef.value.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  spotlightStyle.value = {
    "--x": `${x}%`,
    "--y": `${y}%`,
  };
}

/* =========================
   LOGO TILT
========================= */

const tiltWrapperRef = ref<HTMLElement | null>(null);

const tiltStyle = ref({
  transform: "perspective(900px) rotateX(0deg) rotateY(0deg)",
});

function handleTiltMove(e: MouseEvent) {
  if (prefersReducedMotion.value) return;

  const el = tiltWrapperRef.value;
  if (!el) return;

  const rect = el.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  tiltStyle.value.transform =
    `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
}

function resetTilt() {
  tiltStyle.value.transform =
    "perspective(900px) rotateX(0deg) rotateY(0deg)";
}

/* =========================
   CTA MAGNETIC EFFECT
========================= */

const ctaStyle = ref({
  transform: "translate(0px, 0px)",
});

function handleCtaMove(e: MouseEvent) {
  if (prefersReducedMotion.value) return;

  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();

  const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
  const y = (e.clientY - rect.top - rect.height / 2) * 0.22;

  ctaStyle.value.transform = `translate(${x}px, ${y}px)`;
}

function resetCta() {
  ctaStyle.value.transform = "translate(0px, 0px)";
}

/* =========================
   PARTICLES
========================= */

const particles = Array.from({ length: 14 }, (_, i) => {
  const seed = i * 0.618;

  return {
    left: `${(seed * 37) % 100}%`,
    size: 3 + ((i * 7) % 5),
    delay: `${(i * 0.37) % 4}s`,
    duration: `${6 + ((i * 3) % 5)}s`,
  };
});

/* =========================
   COUNT-UP STAT
========================= */

const statValue = ref(0);
const statTarget = 1248;

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion.value) {
    statValue.value = statTarget;
    return;
  }

  const start = performance.now();
  const durationMs = 1400;

  function tick(now: number) {
    const progress = Math.min((now - start) / durationMs, 1);

    const eased = 1 - Math.pow(1 - progress, 3);

    statValue.value = Math.round(eased * statTarget);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  setTimeout(() => {
    requestAnimationFrame(tick);
  }, 900);
});
</script>

<template>
  <section
    ref="sectionRef"
    class="relative bg-forest overflow-hidden"
    :style="spotlightStyle"
    @mousemove="handleSpotlight"
  >
    <!-- Background Layers -->

    <div class="noise-overlay" aria-hidden="true"></div>
    <div class="grid-overlay" aria-hidden="true"></div>

    <div class="aurora aurora-1" aria-hidden="true"></div>
    <div class="aurora aurora-2" aria-hidden="true"></div>
    <div class="aurora aurora-3" aria-hidden="true"></div>

    <div class="spotlight" aria-hidden="true"></div>

    <!-- Rising Particles -->

    <div class="particles" aria-hidden="true">
      <span
        v-for="(p, i) in particles"
        :key="i"
        class="particle"
        :style="{
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size}px`,
          animationDelay: p.delay,
          animationDuration: p.duration,
        }"
      ></span>
    </div>

    <!-- Main Content -->

    <div
      class="relative z-10 max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center"
    >
      <!-- LEFT SIDE -->

      <div>
        <!-- Badge -->

        <div class="anim anim-badge inline-block mb-6">
          <div class="badge-ring">
            <span
              class="badge-inner font-body text-xs tracking-[0.2em] uppercase text-amber font-semibold"
            >
              <Sparkles
                :size="14"
                class="inline -mt-0.5 mr-1.5"
              />

              The everyday general store
            </span>
          </div>
        </div>

        <!-- Heading -->

        <h1
          class="font-display text-5xl md:text-6xl font-medium leading-[1.05] mb-6"
        >
          <span class="block overflow-hidden">
            <span class="word-reveal word-1 block text-paper">
              Good things,
            </span>
          </span>

          <span class="block overflow-hidden">
            <span class="word-reveal word-2 block gradient-text">
              plainly sold.
            </span>
          </span>
        </h1>

        <!-- Description -->

        <p
          class="anim anim-copy font-body text-paper/85 text-lg leading-relaxed mb-9 max-w-md"
        >
          A small, honest catalog of things worth buying — no gimmicks, just
          good products at fair prices.
        </p>

        <!-- CTA -->

        <div
          class="anim anim-cta flex flex-wrap items-center gap-x-8 gap-y-5"
        >
          <NuxtLink
            to="/signup"
            class="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-amber to-yellow-500 px-8 py-4 text-base font-semibold text-forest shadow-lg cta-glow transition-shadow duration-300"
            :style="ctaStyle"
            @mousemove="handleCtaMove"
            @mouseleave="resetCta"
          >
            <span
              class="cta-shine"
              aria-hidden="true"
            ></span>

            <Sparkles
              :size="20"
              class="relative z-10 sparkle-pulse transition-transform duration-300 group-hover:rotate-12"
            />

            <span class="relative z-10">
              Join MiniShop Today
            </span>

            <ArrowRight
              :size="20"
              class="relative z-10 transition-transform duration-300 group-hover:translate-x-2"
            />
          </NuxtLink>

        </div>

        <!-- Trust -->

        <div
          class="anim anim-trust mt-10 flex items-center gap-3 text-paper/70"
        >
          <div class="flex -space-x-2">
            <Star :size="16" class="fill-amber text-amber" />
            <Star :size="16" class="fill-amber text-amber" />
            <Star :size="16" class="fill-amber text-amber" />
            <Star :size="16" class="fill-amber text-amber" />
            <Star :size="16" class="fill-amber text-amber" />
          </div>

          <p class="font-body text-sm">
            <span class="text-paper font-semibold">
              {{ statValue.toLocaleString() }}+
            </span>
            happy neighbors shopping local
          </p>
        </div>
      </div>

      <!-- RIGHT SIDE -->

      <div
        class="anim anim-logo relative flex items-center justify-center"
      >
        <!-- Orbit Ring -->

        <div
          class="orbit-ring"
          aria-hidden="true"
        >
          <span class="orbit-dot"></span>
        </div>

        <!-- Logo Card -->

        <div class="gradient-border">
          <div
            ref="tiltWrapperRef"
            class="tilt-wrapper relative w-full aspect-square rounded-[22px] overflow-hidden flex items-center justify-center p-10 glass-panel"
            :style="tiltStyle"
            @mousemove="handleTiltMove"
            @mouseleave="resetTilt"
          >
            <div class="float-wrapper w-full h-full">
              <MiniShopLogo class="w-full h-full" />
            </div>
          </div>
        </div>

        <!-- Floating Chips -->

        <div class="chip chip-1 font-body">
          Free local delivery
        </div>

        <div class="chip chip-2 font-body">
          Since day one
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* =========================================
   BASE BACKGROUND
========================================= */

.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.05;
  mix-blend-mode: overlay;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

.grid-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;

  background-image:
    linear-gradient(
      to right,
      rgba(245, 240, 225, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(245, 240, 225, 0.05) 1px,
      transparent 1px
    );

  background-size: 48px 48px;

  -webkit-mask-image: radial-gradient(
    ellipse 70% 60% at 50% 40%,
    black 0%,
    transparent 75%
  );

  mask-image: radial-gradient(
    ellipse 70% 60% at 50% 40%,
    black 0%,
    transparent 75%
  );
}

/* =========================================
   SPOTLIGHT
========================================= */

.spotlight {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;

  background: radial-gradient(
    circle 380px at var(--x, 50%) var(--y, 40%),
    rgba(217, 160, 40, 0.16),
    transparent 70%
  );

  transition: background 0.15s ease-out;
}

/* =========================================
   AURORA
========================================= */

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 0;
  pointer-events: none;
}

.aurora-1 {
  width: 520px;
  height: 520px;

  top: -180px;
  left: -140px;

  background: radial-gradient(
    circle,
    rgba(217, 160, 40, 0.35),
    transparent 70%
  );

  animation: driftA 16s ease-in-out infinite;
}

.aurora-2 {
  width: 460px;
  height: 460px;

  bottom: -160px;
  right: -120px;

  background: radial-gradient(
    circle,
    rgba(90, 155, 120, 0.3),
    transparent 70%
  );

  animation: driftB 18s ease-in-out infinite;
}

.aurora-3 {
  width: 360px;
  height: 360px;

  top: 30%;
  right: 15%;

  background: radial-gradient(
    circle,
    rgba(245, 240, 225, 0.08),
    transparent 70%
  );

  animation: driftC 14s ease-in-out infinite;
}

@keyframes driftA {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(50px, 30px) scale(1.1);
  }
}

@keyframes driftB {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(-40px, -30px) scale(1.08);
  }
}

@keyframes driftC {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }

  50% {
    transform: translate(-25px, 25px) scale(1.15);
    opacity: 1;
  }
}

/* =========================================
   PARTICLES
========================================= */

.particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  bottom: -20px;

  border-radius: 50%;

  background: rgba(217, 160, 40, 0.55);

  animation: rise linear infinite;
}

@keyframes rise {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }

  10% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.4;
  }

  100% {
    transform: translateY(-620px) translateX(20px);
    opacity: 0;
  }
}

/* =========================================
   GENERAL ENTRANCE
========================================= */

.anim {
  opacity: 0;
  transform: translateY(20px);

  animation: fadeUpIn 0.7s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.anim-badge {
  animation-delay: 0.05s;
}

.anim-copy {
  animation-delay: 0.5s;
}

.anim-cta {
  animation-delay: 0.65s;
}

.anim-trust {
  animation-delay: 0.85s;
}

.anim-logo {
  opacity: 0;
  transform: scale(0.94);

  animation: fadeScaleIn 0.9s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;

  animation-delay: 0.35s;
}

@keyframes fadeUpIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeScaleIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* =========================================
   HEADING — BOTTOM TO TOP REVEAL
========================================= */

.word-reveal {
  display: block;

  transform: translateY(115%);
  filter: blur(6px);
  opacity: 0;

  animation: wordReveal 0.85s
    cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.word-1 {
  animation-delay: 0.15s;
}

/*
  Important:
  word-2 has both animations explicitly defined
  so gradientShift does not overwrite wordReveal.
*/
.word-2 {
  animation:
    wordReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards,
    gradientShift 4s ease-in-out 1.15s infinite;
}

@keyframes wordReveal {
  0% {
    transform: translateY(115%);
    filter: blur(6px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    filter: blur(0);
    opacity: 1;
  }
}

/* =========================================
   "PLAINLY SOLD." GRADIENT
========================================= */

.gradient-text {
  background-image: linear-gradient(
    100deg,
    #d9a028 0%,
    #f3d27a 45%,
    #d9a028 100%
  );

  background-size: 200% auto;
  background-position: 0% center;
  background-repeat: no-repeat;

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
  color: transparent;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% center;
  }

  50% {
    background-position: 100% center;
  }
}

/* =========================================
   BADGE
========================================= */

.badge-ring {
  position: relative;

  padding: 1px;

  border-radius: 999px;

  background: linear-gradient(
    90deg,
    #d9a028,
    rgba(217, 160, 40, 0.2)
  );
}

.badge-inner {
  display: block;

  background: #14261a;

  border-radius: 999px;

  padding: 8px 18px;
}

/* =========================================
   CTA
========================================= */

.cta-glow {
  transition:
    transform 0.2s ease-out,
    box-shadow 0.3s ease;

  animation: ctaPulse 2.6s ease-in-out infinite;
}

.cta-glow:hover {
  box-shadow: 0 12px 32px rgba(217, 160, 40, 0.5);
}

@keyframes ctaPulse {
  0%,
  100% {
    box-shadow:
      0 8px 20px rgba(217, 160, 40, 0.25);
  }

  50% {
    box-shadow:
      0 10px 30px rgba(217, 160, 40, 0.5);
  }
}

/* CTA Shine */

.cta-shine {
  position: absolute;

  top: 0;
  left: -60%;

  width: 40%;
  height: 100%;

  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.55) 50%,
    rgba(255, 255, 255, 0) 100%
  );

  transform: skewX(-20deg);

  animation: shineSweep 3.2s ease-in-out infinite;
}

@keyframes shineSweep {
  0% {
    left: -60%;
  }

  40% {
    left: 130%;
  }

  100% {
    left: 130%;
  }
}

/* CTA Sparkle */

.sparkle-pulse {
  animation: sparklePulse 2.4s ease-in-out infinite;
}

@keyframes sparklePulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }

  50% {
    transform: scale(1.15) rotate(6deg);
  }
}

/* =========================================
   CATALOG LINK
========================================= */

.underline-grow {
  position: absolute;

  left: 0;
  bottom: -4px;

  width: 100%;
  height: 1px;

  background: currentColor;

  transform: scaleX(0.3);
  transform-origin: left;

  transition: transform 0.3s ease;
}

.group:hover .underline-grow {
  transform: scaleX(1);
}

/* =========================================
   LOGO CARD
========================================= */

.gradient-border {
  position: relative;

  width: 100%;

  border-radius: 24px;

  padding: 2px;

  background: linear-gradient(
    135deg,
    #d9a028,
    #f3d27a,
    #1f3d2b
  );
}

.glass-panel {
  background: linear-gradient(
    160deg,
    rgba(31, 61, 43, 0.9),
    rgba(15, 26, 19, 0.95)
  );

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  border: 1px solid rgba(245, 240, 225, 0.08);
}

.tilt-wrapper {
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.float-wrapper {
  animation: floatY 4.5s ease-in-out infinite;
}

@keyframes floatY {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* =========================================
   ORBIT
========================================= */

.orbit-ring {
  position: absolute;

  inset: -6%;

  border: 1px dashed rgba(217, 160, 40, 0.35);

  border-radius: 50%;

  animation: spin 18s linear infinite;

  z-index: 0;
}

.orbit-dot {
  position: absolute;

  top: -4px;
  left: 50%;

  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #d9a028;

  box-shadow:
    0 0 12px 3px rgba(217, 160, 40, 0.6);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================
   FLOATING CHIPS
========================================= */

.chip {
  position: absolute;

  background: rgba(15, 26, 19, 0.85);

  border: 1px solid rgba(245, 240, 225, 0.12);

  color: #f5f0e1;

  font-size: 12px;
  font-weight: 600;

  padding: 8px 14px;

  border-radius: 999px;

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.25);

  animation: chipFloat 5s ease-in-out infinite;
}

.chip-1 {
  top: 6%;
  right: -6%;

  animation-delay: 0.2s;
}

.chip-2 {
  bottom: 8%;
  left: -8%;

  animation-delay: 1.2s;
}

@keyframes chipFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

/* =========================================
   REDUCED MOTION
========================================= */

@media (prefers-reduced-motion: reduce) {
  .anim,
  .word-reveal,
  .cta-glow,
  .cta-shine,
  .sparkle-pulse,
  .float-wrapper,
  .aurora,
  .particle,
  .orbit-ring,
  .chip {
    animation: none !important;

    opacity: 1 !important;

    transform: none !important;

    filter: none !important;
  }

  .gradient-text {
    background-position: 0% center !important;

    -webkit-background-clip: text;
    background-clip: text;

    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .tilt-wrapper {
    transition: none !important;
  }

  .spotlight {
    display: none;
  }
}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 767px) {
  .chip-1 {
    right: 0;
  }

  .chip-2 {
    left: 0;
  }

  .orbit-ring {
    inset: -3%;
  }
}
</style>