<script setup lang="ts">
import {
  Truck,
  ShieldCheck,
  PackageCheck,
  Headphones,
} from "lucide-vue-next";
import { getCategories, getProducts } from "~/composables/api";

const getImageUrl = useImageUrl();

const {
  data: categories,
  pending: categoriesPending,
  error: categoriesError,
} = await useAsyncData("home-categories", getCategories);

const {
  data: products,
  pending: productsPending,
  error: productsError,
} = await useAsyncData("home-products", () => getProducts());
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <Navbar />

    <HeroSection />

    <main class="home-content bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="section-divider"></div>

      <section
        id="categories"
        class="relative z-10 bg-forest py-16 md:py-20 scroll-mt-24"
      >
        <div class="max-w-6xl mx-auto px-6">
          <h2
            class="section-title font-display text-3xl md:text-4xl font-medium text-paper mb-10"
          >
            Featured Categories
          </h2>

          <div
            v-if="categoriesPending"
            class="status-message"
          >
            Loading categories...
          </div>

          <div
            v-else-if="categoriesError"
            class="status-message"
          >
            Failed to load categories. Is the backend running?
          </div>

          <div
            v-else
            class="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible"
          >
            <div
              v-for="(category, index) in (categories ?? []).slice(0, 6)"
              :key="category.id"
              class="category-card group min-w-full snap-center md:min-w-0"
            >
              <div class="category-image-area">
                <img
                  v-if="category.imageUrl"
                  :src="getImageUrl(category.imageUrl)"
                  :alt="category.name"
                  class="category-image"
                />

                <div
                  v-else
                  class="no-image"
                >
                  No image
                </div>

                <div class="category-image-gradient"></div>

                <div class="category-number">
                  {{ String(index + 1).padStart(2, "0") }}
                </div>

                <div class="category-content">
                  <h3 class="category-name">
                    {{ category.name }}
                  </h3>

                  <p class="category-description">
                    {{ category.description }}
                  </p>
                </div>
              </div>

              <div class="card-corner card-corner-top"></div>
              <div class="card-corner card-corner-bottom"></div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section
        id="products"
        class="relative z-10 bg-forest py-16 md:py-20 scroll-mt-24"
      >
        <div class="max-w-6xl mx-auto px-6">
          <h2
            class="section-title font-display text-3xl md:text-4xl font-medium text-paper mb-10"
          >
            Featured Products
          </h2>

          <div
            v-if="productsPending"
            class="status-message"
          >
            Loading products...
          </div>

          <div
            v-else-if="productsError"
            class="status-message"
          >
            Failed to load products. Is the backend running?
          </div>

          <div
            v-else
            class="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible"
          >
            <div
              v-for="(product, index) in (products ?? []).slice(0, 6)"
              :key="product.id"
              class="product-card group min-w-full snap-center md:min-w-0"
            >
              <div class="product-image-area">
                <img
                  v-if="product.imageUrl"
                  :src="getImageUrl(product.imageUrl)"
                  :alt="product.name"
                  class="product-image"
                />

                <div
                  v-else
                  class="no-image"
                >
                  No image
                </div>

                <div class="product-image-gradient"></div>

                <div class="product-index">
                  {{ String(index + 1).padStart(2, "0") }}
                </div>
              </div>

              <div class="product-content">
                <div class="product-heading">
                  <h3 class="product-name">
                    {{ product.name }}
                  </h3>

                  <div class="product-price">
                    PKR {{ product.price }}
                  </div>
                </div>

                <p class="product-description">
                  {{ product.description }}
                </p>
              </div>

              <div class="product-accent"></div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section
        id="about"
        class="about-section relative z-10 bg-forest py-24 md:py-32 scroll-mt-24"
      >
        <div class="about-glow"></div>

        <div class="relative z-10 max-w-6xl mx-auto px-6">
          <div class="about-layout">
            <div class="about-intro">
              <div class="about-label">
                <span class="about-label-line"></span>
                <span>Why MiniShop</span>
              </div>

              <h2 class="about-title">
                Why Shop With
                <span class="about-title-accent">
                  MiniShop?
                </span>
              </h2>

              <p class="about-description">
                We make online shopping simple, secure, and enjoyable with
                quality products and exceptional customer service.
              </p>
            </div>

            <div class="features-grid">
              <div class="feature-item">
                <div class="feature-top">
                  <div class="feature-icon">
                    <Truck :size="25" />
                  </div>

                  <span class="feature-number">
                    01
                  </span>
                </div>

                <div class="feature-content">
                  <h3 class="feature-title">
                    Fast Delivery
                  </h3>

                  <p class="feature-description">
                    Quick and reliable delivery across Pakistan with real-time
                    order tracking.
                  </p>
                </div>

                <div class="feature-line"></div>
              </div>

              <div class="feature-item">
                <div class="feature-top">
                  <div class="feature-icon">
                    <ShieldCheck :size="25" />
                  </div>

                  <span class="feature-number">
                    02
                  </span>
                </div>

                <div class="feature-content">
                  <h3 class="feature-title">
                    Secure Payments
                  </h3>

                  <p class="feature-description">
                    Shop confidently using trusted and secure payment methods.
                  </p>
                </div>

                <div class="feature-line"></div>
              </div>

              <div class="feature-item">
                <div class="feature-top">
                  <div class="feature-icon">
                    <PackageCheck :size="25" />
                  </div>

                  <span class="feature-number">
                    03
                  </span>
                </div>

                <div class="feature-content">
                  <h3 class="feature-title">
                    Quality Products
                  </h3>

                  <p class="feature-description">
                    Every product is carefully selected to ensure premium
                    quality and value.
                  </p>
                </div>

                <div class="feature-line"></div>
              </div>

              <div class="feature-item">
                <div class="feature-top">
                  <div class="feature-icon">
                    <Headphones :size="25" />
                  </div>

                  <span class="feature-number">
                    04
                  </span>
                </div>

                <div class="feature-content">
                  <h3 class="feature-title">
                    24/7 Support
                  </h3>

                  <p class="feature-description">
                    Our support team is always ready to help with your questions
                    and orders.
                  </p>
                </div>

                <div class="feature-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.home-content {
  position: relative;
  overflow: hidden;
}

.page-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      to right,
      rgba(245, 240, 225, 0.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(245, 240, 225, 0.025) 1px,
      transparent 1px
    );
  background-size: 52px 52px;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    black 8%,
    black 92%,
    transparent
  );
  mask-image: linear-gradient(
    to bottom,
    transparent,
    black 8%,
    black 92%,
    transparent
  );
}

.page-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.page-glow-one {
  width: 500px;
  height: 500px;
  top: 100px;
  left: -300px;
  background: rgba(217, 160, 40, 0.08);
}

.page-glow-two {
  width: 520px;
  height: 520px;
  top: 900px;
  right: -320px;
  background: rgba(217, 160, 40, 0.055);
}

.section-title {
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -12px;
  width: 48px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    #d9a028,
    #f3d27a
  );
  box-shadow: 0 0 14px rgba(217, 160, 40, 0.25);
}

.section-divider {
  position: relative;
  z-index: 10;
  width: min(1152px, calc(100% - 48px));
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.18),
    rgba(245, 240, 225, 0.08),
    transparent
  );
}

.category-card {
  position: relative;
  height: 360px;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 22px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s ease,
    box-shadow 0.4s ease;
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: rgba(217, 160, 40, 0.32);
  box-shadow:
    0 25px 55px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(217, 160, 40, 0.04);
}

.category-image-area {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition:
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.5s ease;
}

.category-card:hover .category-image {
  transform: scale(1.08);
}

.category-image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 38, 26, 0.04) 20%,
    rgba(20, 38, 26, 0.2) 48%,
    rgba(20, 38, 26, 0.96) 100%
  );
}

.category-number {
  position: absolute;
  top: 18px;
  right: 20px;
  color: rgba(245, 240, 225, 0.65);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.category-content {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card:hover .category-content {
  transform: translateY(-4px);
}

.category-name {
  color: #f5f0e1;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.15;
}

.category-description {
  margin-top: 8px;
  color: #d9a028;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.card-corner {
  position: absolute;
  z-index: 3;
  width: 28px;
  height: 28px;
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.card-corner-top {
  top: 11px;
  left: 11px;
  border-top: 1px solid #d9a028;
  border-left: 1px solid #d9a028;
  transform: translate(-5px, -5px);
}

.card-corner-bottom {
  right: 11px;
  bottom: 11px;
  border-right: 1px solid #d9a028;
  border-bottom: 1px solid #d9a028;
  transform: translate(5px, 5px);
}

.category-card:hover .card-corner {
  opacity: 0.8;
  transform: translate(0, 0);
}

.product-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 22px;
  background: rgba(245, 240, 225, 0.045);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.4s ease,
    box-shadow 0.4s ease,
    background 0.4s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  border-color: rgba(217, 160, 40, 0.32);
  background: rgba(245, 240, 225, 0.06);
  box-shadow:
    0 25px 55px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(217, 160, 40, 0.035);
}

.product-image-area {
  position: relative;
  height: 280px;
  margin: 9px;
  overflow: hidden;
  border-radius: 15px;
  background: rgba(245, 240, 225, 0.05);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.5s ease;
}

.product-card:hover .product-image {
  transform: scale(1.065);
}

.product-image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 55%,
    rgba(20, 38, 26, 0.22) 100%
  );
  pointer-events: none;
}

.product-index {
  position: absolute;
  top: 13px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 27px;
  padding: 0 8px;
  border: 1px solid rgba(245, 240, 225, 0.16);
  border-radius: 999px;
  background: rgba(20, 38, 26, 0.72);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  color: #f3d27a;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.product-content {
  padding: 14px 20px 22px;
}

.product-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.product-name {
  flex: 1;
  color: #f5f0e1;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.25;
  transition: color 0.3s ease;
}

.product-card:hover .product-name {
  color: #f3d27a;
}

.product-price {
  flex-shrink: 0;
  color: #f3d27a;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  text-align: right;
}

.product-description {
  margin-top: 9px;
  color: rgba(245, 240, 225, 0.58);
  font-size: 13px;
  line-height: 1.6;
}

.product-accent {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #d9a028,
    transparent
  );
  transform: scaleX(0);
  transition: transform 0.45s ease;
}

.product-card:hover .product-accent {
  transform: scaleX(1);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.4);
  font-size: 13px;
  font-weight: 500;
}

.status-message {
  min-height: 100px;
  display: flex;
  align-items: center;
  color: rgba(245, 240, 225, 0.6);
  font-size: 14px;
}

.about-section {
  position: relative;
  overflow: hidden;
}

.about-glow {
  position: absolute;
  width: 650px;
  height: 650px;
  left: -380px;
  top: 50%;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.07);
  filter: blur(110px);
  transform: translateY(-50%);
  pointer-events: none;
}

.about-layout {
  display: grid;
  grid-template-columns: 0.85fr 1.5fr;
  gap: 90px;
  align-items: start;
}

.about-intro {
  position: sticky;
  top: 130px;
}

.about-label {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  color: #d9a028;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.about-label-line {
  width: 28px;
  height: 1px;
  background: #d9a028;
}

.about-title {
  max-width: 390px;
  color: #f5f0e1;
  font-size: clamp(2.7rem, 5vw, 4.3rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.035em;
}

.about-title-accent {
  display: block;
  margin-top: 7px;
  background: linear-gradient(
    100deg,
    #d9a028,
    #f3d27a,
    #d9a028
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: aboutGradient 5s ease-in-out infinite;
}

.about-description {
  max-width: 390px;
  margin-top: 26px;
  color: rgba(245, 240, 225, 0.58);
  font-size: 15px;
  line-height: 1.8;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(245, 240, 225, 0.1);
  border-left: 1px solid rgba(245, 240, 225, 0.1);
}

.feature-item {
  position: relative;
  min-height: 270px;
  padding: 30px;
  overflow: hidden;
  border-right: 1px solid rgba(245, 240, 225, 0.1);
  border-bottom: 1px solid rgba(245, 240, 225, 0.1);
  background: rgba(245, 240, 225, 0.018);
  transition:
    background 0.4s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-item:hover {
  background: rgba(217, 160, 40, 0.055);
}

.feature-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 52px;
}

.feature-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.22);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.4s ease,
    border-color 0.4s ease;
}

.feature-item:hover .feature-icon {
  transform: rotate(-8deg) scale(1.08);
  border-color: rgba(217, 160, 40, 0.45);
  background: rgba(217, 160, 40, 0.14);
}

.feature-number {
  color: rgba(245, 240, 225, 0.22);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  transition: color 0.35s ease;
}

.feature-item:hover .feature-number {
  color: #d9a028;
}

.feature-title {
  color: #f5f0e1;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.3;
  transition: color 0.35s ease;
}

.feature-item:hover .feature-title {
  color: #f3d27a;
}

.feature-description {
  max-width: 280px;
  margin-top: 10px;
  color: rgba(245, 240, 225, 0.55);
  font-size: 13px;
  line-height: 1.7;
}

.feature-line {
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    #d9a028,
    transparent
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-item:hover .feature-line {
  transform: scaleX(1);
}

@keyframes aboutGradient {
  0%,
  100% {
    background-position: 0% center;
  }

  50% {
    background-position: 100% center;
  }
}

@media (max-width: 900px) {
  .about-layout {
    grid-template-columns: 1fr;
    gap: 55px;
  }

  .about-intro {
    position: static;
  }

  .about-title,
  .about-description {
    max-width: 600px;
  }
}

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .category-card,
  .product-card {
    min-width: 88%;
  }

  .category-card {
    height: 330px;
  }

  .product-image-area {
    height: 250px;
  }

  .product-heading {
    flex-direction: column;
    gap: 5px;
  }

  .product-price {
    text-align: left;
  }
}

@media (max-width: 640px) {
  .about-section {
    padding-top: 80px;
    padding-bottom: 80px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    min-height: 240px;
    padding: 25px;
  }

  .feature-top {
    margin-bottom: 40px;
  }

  .feature-line {
    left: 25px;
    right: 25px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-card,
  .category-image,
  .category-content,
  .card-corner,
  .product-card,
  .product-image,
  .product-name,
  .product-accent,
  .feature-item,
  .feature-icon,
  .feature-number,
  .feature-title,
  .feature-line {
    transition: none !important;
  }

  .category-card:hover,
  .product-card:hover,
  .feature-item:hover .feature-icon {
    transform: none !important;
  }

  .about-title-accent {
    animation: none;
  }
}
</style>