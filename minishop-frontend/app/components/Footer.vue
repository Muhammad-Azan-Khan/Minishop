<script setup lang="ts">
import {
  Github,
  Linkedin,
  Instagram,
  ArrowUpRight,
} from "lucide-vue-next";

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer bg-forest text-paper">
    <div class="footer-glow footer-glow-left"></div>
    <div class="footer-glow footer-glow-right"></div>
    <div class="footer-grid"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6">
      <div
        class="footer-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 py-16 md:py-20"
      >
        <div class="lg:col-span-5 lg:pr-16">
          <div class="brand-heading">
            <span class="brand-dot"></span>

            <h2 class="font-display text-3xl font-medium tracking-tight">
              MiniShop
            </h2>
          </div>

          <p class="brand-description">
            Your one-stop destination for quality products at affordable prices.
            Shop electronics, fashion, home essentials, and much more with fast
            and secure delivery.
          </p>

          <div class="brand-line"></div>
        </div>

        <div class="lg:col-span-2">
          <h3 class="footer-heading">
            Shop
          </h3>

          <ul class="footer-list">
            <li>
              <span class="footer-link">
                All Products
              </span>
            </li>

            <li>
              <span class="footer-link">
                Electronics
              </span>
            </li>

            <li>
              <span class="footer-link">
                Fashion
              </span>
            </li>

            <li>
              <span class="footer-link">
                Home & Living
              </span>
            </li>

            <li>
              <span class="footer-link">
                New Arrivals
              </span>
            </li>
          </ul>
        </div>

        <div class="lg:col-span-3">
          <h3 class="footer-heading">
            Customer Service
          </h3>

          <ul class="footer-list">
            <li>
              <span class="footer-link">
                Contact Us
              </span>
            </li>

            <li>
              <span class="footer-link">
                FAQs
              </span>
            </li>

            <li>
              <span class="footer-link">
                Shipping & Delivery
              </span>
            </li>

            <li>
              <span class="footer-link">
                Returns & Refunds
              </span>
            </li>

            <li>
              <span class="footer-link">
                Track Your Order
              </span>
            </li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <h3 class="footer-heading">
            Company
          </h3>

          <ul class="footer-list">
            <li>
              <span class="footer-link">
                About Us
              </span>
            </li>

            <li>
              <span class="footer-link">
                Privacy Policy
              </span>
            </li>

            <li>
              <span class="footer-link">
                Terms & Conditions
              </span>
            </li>

            <li>
              <span class="footer-link">
                Careers
              </span>
            </li>

            <li>
              <span class="footer-link">
                Become a Seller
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-divider"></div>

      <div
        class="footer-bottom py-6 flex flex-col md:flex-row justify-between items-center gap-5"
      >
        <p class="copyright">
          © {{ currentYear }} MiniShop. All rights reserved.
        </p>

        <div class="socials">
          <a
            href="https://www.linkedin.com/in/muhammadazankhan/"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link group"
            aria-label="LinkedIn"
          >
            <Linkedin :size="18" />

            <ArrowUpRight
              :size="9"
              class="social-arrow"
            />
          </a>

          <a
            href="https://github.com/Muhammad-Azan-Khan"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link group"
            aria-label="GitHub"
          >
            <Github :size="18" />

            <ArrowUpRight
              :size="9"
              class="social-arrow"
            />
          </a>

          <a
            href="https://www.instagram.com/_azanyounas/"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link group"
            aria-label="Instagram"
          >
            <Instagram :size="18" />

            <ArrowUpRight
              :size="9"
              class="social-arrow"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
}

.footer-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      to right,
      rgba(245, 240, 225, 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(245, 240, 225, 0.02) 1px,
      transparent 1px
    );
  background-size: 52px 52px;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8),
    transparent 85%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8),
    transparent 85%
  );
}

.footer-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  pointer-events: none;
}

.footer-glow-left {
  width: 420px;
  height: 420px;
  left: -260px;
  bottom: -220px;
  background: rgba(217, 160, 40, 0.08);
}

.footer-glow-right {
  width: 360px;
  height: 360px;
  right: -230px;
  top: -170px;
  background: rgba(217, 160, 40, 0.055);
}

.footer-main {
  position: relative;
}

.brand-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.brand-dot {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #d9a028;
  box-shadow:
    0 0 10px rgba(217, 160, 40, 0.65),
    0 0 22px rgba(217, 160, 40, 0.22);
}

.brand-description {
  max-width: 440px;
  margin-top: 22px;
  color: rgba(245, 240, 225, 0.58);
  font-size: 14px;
  line-height: 1.85;
}

.brand-line {
  width: 52px;
  height: 2px;
  margin-top: 28px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    #d9a028,
    rgba(217, 160, 40, 0.1)
  );
}

.footer-heading {
  position: relative;
  display: inline-block;
  margin-bottom: 23px;
  color: #f5f0e1;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.footer-heading::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 18px;
  height: 1px;
  background: #d9a028;
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.footer-link {
  position: relative;
  display: inline-block;
  color: rgba(245, 240, 225, 0.55);
  font-size: 13px;
  line-height: 1.5;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

.footer-link::before {
  content: "";
  position: absolute;
  top: 50%;
  left: -13px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d9a028;
  opacity: 0;
  transform: translateY(-50%) scale(0);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.footer-link:hover {
  color: #f3d27a;
  transform: translateX(6px);
}

.footer-link:hover::before {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.footer-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(245, 240, 225, 0.08) 12%,
    rgba(217, 160, 40, 0.2) 50%,
    rgba(245, 240, 225, 0.08) 88%,
    transparent
  );
}

.copyright {
  color: rgba(245, 240, 225, 0.4);
  font-size: 12px;
  letter-spacing: 0.02em;
}

.socials {
  display: flex;
  align-items: center;
  gap: 9px;
}

.social-link {
  position: relative;
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.035);
  color: rgba(245, 240, 225, 0.65);
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease;
}

.social-link:hover {
  color: #f3d27a;
  border-color: rgba(217, 160, 40, 0.35);
  background: rgba(217, 160, 40, 0.09);
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.16);
}

.social-arrow {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #d9a028;
  opacity: 0;
  transform: translate(-2px, 2px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.social-link:hover .social-arrow {
  opacity: 1;
  transform: translate(0, 0);
}

@media (max-width: 1023px) {
  .brand-description {
    max-width: 500px;
  }
}

@media (max-width: 767px) {
  .footer-grid {
    background-size: 38px 38px;
  }

  .footer-main {
    padding-top: 55px;
    padding-bottom: 55px;
  }

  .footer-bottom {
    text-align: center;
  }

  .brand-description {
    max-width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-link,
  .footer-link::before,
  .social-link,
  .social-arrow {
    transition: none !important;
  }

  .footer-link:hover,
  .social-link:hover {
    transform: none !important;
  }
}
</style>