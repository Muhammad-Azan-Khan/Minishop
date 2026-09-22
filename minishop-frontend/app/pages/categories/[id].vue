<script setup lang="ts">

useHead({
  title: "MiniShop | Products",
});

import { addToCart, getCategory } from "~/composables/api";

const getImageUrl = useImageUrl();
const authStore = useAuthStore();
const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();

const {
  data: category,
  pending,
  error,
} = await useAsyncData(`category-${route.params.id}`, () =>
  getCategory(route.params.id as string),
);

const addingId = ref<number | null>(null);
const showSuccess = ref(false);
const successMessage = ref("");

let messageTimeout: ReturnType<typeof setTimeout> | null = null;

function showCartMessage(message: string) {
  successMessage.value = message;
  showSuccess.value = true;

  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }

  messageTimeout = setTimeout(() => {
    showSuccess.value = false;
  }, 3000);
}

async function handleAddToCart(productId: number) {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }

  addingId.value = productId;

  try {
    const updatedCart = await addToCart(productId);
    cartStore.syncCart(updatedCart);
    showCartMessage("Product added to cart successfully.");
  } catch (err: any) {
    showCartMessage(
      err?.data?.message || "Could not add product to cart.",
    );
  } finally {
    addingId.value = null;
  }
}

function formatPrice(price: string) {
  return Number(price).toFixed(2);
}
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <UsersNavbar />

    <Transition name="fade">
      <div
        v-if="showSuccess"
        class="success-toast bg-forest"
      >
        <div class="success-icon">
          ✓
        </div>

        <div>
          <p class="success-title">
            Success
          </p>

          <p class="success-description">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </Transition>

    <main class="category-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div
        v-if="pending"
        class="page-state"
      >
        Loading category...
      </div>

      <div
        v-else-if="error"
        class="page-state"
      >
        Category not found.
      </div>

      <template v-else-if="category">
        <div class="relative z-10 mx-auto max-w-6xl px-6 pt-14 md:pt-16">
          <NuxtLink
            to="/categories/page"
            class="back-link"
          >
            <span class="back-arrow">←</span>
            <span>Back to Categories</span>
          </NuxtLink>

          <div class="category-header">
            <h1 class="font-display">
              {{ category.name }}
            </h1>

            <p>
              {{ category.description }}
            </p>
          </div>

          <div class="header-divider"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-6xl px-6 pb-16">
          <div
            v-if="category.products.length === 0"
            class="empty-state"
          >
            No products in this category yet.
          </div>

          <div
            v-else
            class="products-grid"
          >
            <div
              v-for="product in category.products"
              :key="product.id"
              class="product-card"
            >
              <div class="product-image">
                <img
                  v-if="product.imageUrl"
                  :src="getImageUrl(product.imageUrl)"
                  :alt="product.name"
                />

                <span
                  v-else
                  class="no-image"
                >
                  No image
                </span>

                <div
                  v-if="product.imageUrl"
                  class="image-overlay"
                ></div>

                <div class="corner corner-top"></div>
                <div class="corner corner-bottom"></div>
              </div>

              <div class="product-content">
                <h3 class="font-display">
                  {{ product.name }}
                </h3>

                <p class="product-description">
                  {{ product.description }}
                </p>

                <p class="product-price">
                  PKR {{ formatPrice(product.price) }}
                </p>

                <button
                  :disabled="addingId === product.id"
                  class="cart-button"
                  @click="handleAddToCart(product.id)"
                >
                  {{
                    addingId === product.id
                      ? "Adding..."
                      : "Add to Cart"
                  }}
                </button>
              </div>

              <div class="card-accent"></div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.category-page {
  position: relative;
  min-height: 75vh;
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
    black,
    transparent 95%
  );
  mask-image: linear-gradient(
    to bottom,
    black,
    transparent 95%
  );
}

.page-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  pointer-events: none;
}

.page-glow-one {
  width: 500px;
  height: 500px;
  top: -280px;
  right: -260px;
  background: rgba(217, 160, 40, 0.08);
}

.page-glow-two {
  width: 480px;
  height: 480px;
  bottom: 80px;
  left: -330px;
  background: rgba(217, 160, 40, 0.045);
}

.page-state {
  position: relative;
  z-index: 10;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  color: rgba(245, 240, 225, 0.42);
  font-size: 12px;
  text-align: center;
}

.back-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 11px;
  font-weight: 600;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

.back-link:hover {
  color: #f3d27a;
  transform: translateX(-3px);
}

.back-arrow {
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.035);
  color: inherit;
  font-size: 15px;
  line-height: 1;
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.back-link:hover .back-arrow {
  border-color: rgba(217, 160, 40, 0.3);
  background: rgba(217, 160, 40, 0.08);
}

.category-header {
  margin-top: 32px;
}

.category-header h1 {
  color: #f5f0e1;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.035em;
}

.category-header p {
  max-width: 680px;
  margin-top: 12px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 12px;
  line-height: 1.7;
}

.header-divider {
  width: 100%;
  height: 1px;
  margin: 31px 0 36px;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.25),
    transparent
  );
}

.empty-state {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.42);
  font-size: 12px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.product-card {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 15px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: rgba(217, 160, 40, 0.26);
  background: rgba(245, 240, 225, 0.045);
  box-shadow:
    0 22px 45px rgba(0, 0, 0, 0.14),
    0 0 30px rgba(217, 160, 40, 0.025);
}

.product-image {
  position: relative;
  height: 225px;
  flex-shrink: 0;
  overflow: hidden;
  background: rgba(245, 240, 225, 0.025);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.07);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(10, 20, 13, 0.45) 100%
  );
  pointer-events: none;
}

.no-image {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.32);
  font-size: 10px;
}

.corner {
  position: absolute;
  width: 22px;
  height: 22px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.corner-top {
  top: 12px;
  right: 12px;
  border-top: 1px solid rgba(217, 160, 40, 0.7);
  border-right: 1px solid rgba(217, 160, 40, 0.7);
}

.corner-bottom {
  bottom: 12px;
  left: 12px;
  border-bottom: 1px solid rgba(217, 160, 40, 0.7);
  border-left: 1px solid rgba(217, 160, 40, 0.7);
}

.product-card:hover .corner {
  opacity: 1;
}

.product-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 19px 20px 20px;
}

.product-content h3 {
  color: #f5f0e1;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.product-card:hover .product-content h3 {
  color: #f3d27a;
}

.product-description {
  display: -webkit-box;
  min-height: 34px;
  margin-top: 7px;
  overflow: hidden;
  color: rgba(245, 240, 225, 0.4);
  font-size: 10px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-price {
  margin-top: 16px;
  color: #f3d27a;
  font-size: 13px;
  font-weight: 700;
}

.cart-button {
  width: 100%;
  height: 42px;
  margin-top: 18px;
  border: 1px solid rgba(217, 160, 40, 0.3);
  border-radius: 9px;
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
  font-size: 10px;
  font-weight: 700;
  transition:
    color 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
}

.cart-button:hover:not(:disabled) {
  color: #14261a;
  border-color: #d9a028;
  background: #d9a028;
  transform: translateY(-1px);
}

.cart-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.card-accent {
  position: absolute;
  right: 20px;
  bottom: 0;
  left: 20px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #d9a028,
    transparent
  );
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.4s ease;
}

.product-card:hover .card-accent {
  transform: scaleX(1);
}

.success-toast {
  position: fixed;
  z-index: 100;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: calc(100vw - 48px);
  padding: 13px 17px;
  border: 1px solid rgba(217, 160, 40, 0.25);
  border-radius: 14px;
  color: #f5f0e1;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
}

.success-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #d9a028;
  color: #14261a;
  font-size: 13px;
  font-weight: 800;
}

.success-title {
  color: #f5f0e1;
  font-size: 11px;
  font-weight: 700;
}

.success-description {
  margin-top: 2px;
  color: rgba(245, 240, 225, 0.5);
  font-size: 9px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 240px;
  }

  .category-header {
    margin-top: 27px;
  }

  .header-divider {
    margin: 25px 0 30px;
  }

  .success-toast {
    top: 15px;
    right: 15px;
    left: 15px;
    max-width: none;
  }
}

@media (max-width: 420px) {
  .product-image {
    height: 215px;
  }

  .product-content {
    padding: 17px 18px 19px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .back-arrow,
  .product-card,
  .product-image img,
  .product-content h3,
  .corner,
  .cart-button,
  .card-accent {
    transition: none !important;
  }

  .back-link:hover,
  .product-card:hover,
  .product-card:hover .product-image img,
  .cart-button:hover {
    transform: none !important;
  }
}
</style>
