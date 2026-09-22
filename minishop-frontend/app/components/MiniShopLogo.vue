<template>
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="MiniShop logo"
    >
      <defs>
        <clipPath id="awning-clip">
          <path
            d="M130 80 H270 L300 120
               A16.67 16.67 0 0 1 266.67 120
               A16.67 16.67 0 0 1 233.33 120
               A16.67 16.67 0 0 1 200 120
               A16.67 16.67 0 0 1 166.67 120
               A16.67 16.67 0 0 1 133.33 120
               A16.67 16.67 0 0 1 100 120
               Z"
          />
        </clipPath>
  
        <linearGradient id="shimmer-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
  
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
  
      <!-- shop body -->
      <rect
        x="120" y="125" width="160" height="175" rx="6"
        class="fill-none stroke-paper" stroke-width="6"
      />
  
      <!-- windows -->
      <g class="fill-none stroke-paper" stroke-width="4">
        <rect x="134" y="200" width="32" height="42" rx="3" />
        <path d="M150 200 V242 M134 221 H166" />
        <rect x="234" y="200" width="32" height="42" rx="3" />
        <path d="M250 200 V242 M234 221 H266" />
      </g>
  
      <!-- doorbell glow (behind door) -->
      <circle cx="214" cy="266" r="10" class="fill-amber" filter="url(#glow)">
        <animate
          attributeName="opacity"
          values="0.3;0.8;0.3"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>
  
      <!-- arched door -->
      <path
        d="M175 300 V228 a25 25 0 0 1 50 0 V300 Z"
        class="fill-amber"
      />
      <circle cx="214" cy="266" r="3.5" class="fill-forest" />
  
      <!-- striped awning -->
      <g clip-path="url(#awning-clip)">
        <rect x="100" y="70" width="33.33" height="70" class="fill-paper" />
        <rect x="133.33" y="70" width="33.33" height="70" class="fill-amber" />
        <rect x="166.67" y="70" width="33.33" height="70" class="fill-paper" />
        <rect x="200" y="70" width="33.33" height="70" class="fill-amber" />
        <rect x="233.33" y="70" width="33.33" height="70" class="fill-paper" />
        <rect x="266.67" y="70" width="33.33" height="70" class="fill-amber" />
  
        <!-- shimmer sweep across the awning -->
        <rect
          x="-140" y="70" width="80" height="70"
          fill="url(#shimmer-grad)"
        >
          <animate
            attributeName="x"
            values="-140;340"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
  
      <!-- ground line -->
      <path
        d="M90 300 H310"
        class="stroke-paper" stroke-width="6" stroke-linecap="round"
      />
  
      <!-- twinkle accent -->
      <path
        d="M320 90 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z"
        class="fill-amber"
      >
        <animate
          attributeName="opacity"
          values="0.2;1;0.2"
          dur="2.8s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.8;1.15;0.8"
          additive="sum"
          dur="2.8s"
          repeatCount="indefinite"
        />
      </path>
  
      <!-- wordmark -->
      <text
        x="200" y="348" text-anchor="middle"
        class="font-display fill-paper" font-size="46" font-weight="500"
      >
        MiniShop
      </text>
      <text
        x="200" y="376" text-anchor="middle"
        class="font-body fill-amber" font-size="12" font-weight="600"
        letter-spacing="4"
      >
        GENERAL STORE
      </text>
    </svg>
  </template>