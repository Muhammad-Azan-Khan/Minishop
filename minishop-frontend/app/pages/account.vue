<script setup lang="ts">

useHead({
  title: "MiniShop | Home",
});


import { Package, ShoppingBag, ArrowRight } from "lucide-vue-next";
import type { Cart } from "~/types/cart";
import type { Order } from "~/types/order";
import {
  getCart,
  getMyOrders,
} from "~/composables/api";

const authStore = useAuthStore();
const router = useRouter();

if (!authStore.isLoggedIn) {
  router.push("/login");
}

const cart = ref<Cart | null>(null);
const orders = ref<Order[]>([]);

const fetchData = async () => {
  try {
    const [cartData, ordersData] = await Promise.all([
      getCart(),
      getMyOrders(),
    ]);

    cart.value = cartData;
    orders.value = ordersData;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchData();
});

const cartItemCount = computed(
  () =>
    cart.value?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ) ?? 0,
);

const orderCount = computed(() => orders.value.length);
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <UsersNavbar />

    <main class="account-page bg-forest">
      <div class="square-grid"></div>
      <div class="grid-fade"></div>
      <div class="page-glow glow-one"></div>
      <div class="page-glow glow-two"></div>

      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="section-label">
              <span class="section-label-line"></span>
              <span>User Dashboard</span>
            </div>

            <h1 class="hero-title">
              Welcome,
              <span>
                {{
                  authStore.user?.name ||
                  authStore.user?.email
                }}
              </span>
            </h1>

            <p class="hero-description">
              Manage your account, keep track of your orders, and continue
              shopping your favourite products from MiniShop.
            </p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon-wrapper">
                  <ShoppingBag :size="25" />
                </div>
              </div>

              <div class="stat-bottom">
                <h2 class="font-display">
                  {{ cartItemCount }}
                </h2>

                <p>
                  Items in Cart
                </p>
              </div>

              <div class="stat-corner stat-corner-top"></div>
              <div class="stat-corner stat-corner-bottom"></div>
              <div class="stat-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon-wrapper">
                  <Package :size="25" />
                </div>
              </div>

              <div class="stat-bottom">
                <h2 class="font-display">
                  {{ orderCount }}
                </h2>

                <p>
                  Past Orders
                </p>
              </div>

              <div class="stat-corner stat-corner-top"></div>
              <div class="stat-corner stat-corner-bottom"></div>
              <div class="stat-accent"></div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section class="manage-section">
        <div class="mx-auto max-w-6xl px-6">
          <h2 class="manage-heading font-display">
            Manage your account
          </h2>

          <div class="manage-grid">
            <NuxtLink
              to="/orders"
              class="manage-card"
            >
              <div>
                <h3 class="font-display">
                  Your Orders
                </h3>

                <p>
                  Track and review past purchases
                </p>
              </div>

              <div class="arrow-container">
                <ArrowRight
                  :size="18"
                  class="arrow-icon"
                />
              </div>

              <div class="card-corner card-corner-top"></div>
              <div class="card-corner card-corner-bottom"></div>
              <div class="card-accent"></div>
            </NuxtLink>

            <NuxtLink
              to="/cart"
              class="manage-card"
            >
              <div>
                <h3 class="font-display">
                  Your Cart
                </h3>

                <p>
                  Review items before checkout
                </p>
              </div>

              <div class="arrow-container">
                <ArrowRight
                  :size="18"
                  class="arrow-icon"
                />
              </div>

              <div class="card-corner card-corner-top"></div>
              <div class="card-corner card-corner-bottom"></div>
              <div class="card-accent"></div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.account-page {
  position: relative;
  min-height: 75vh;
  overflow: hidden;
  isolation: isolate;
}

.square-grid {
  position: absolute;
  z-index: 0;
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

.grid-fade {
  display: none;
}

.page-glow {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  filter: blur(110px);
  pointer-events: none;
}

.glow-one {
  width: 520px;
  height: 520px;
  top: -270px;
  right: -180px;
  background: rgba(217, 160, 40, 0.13);
}

.glow-two {
  width: 420px;
  height: 420px;
  top: 330px;
  left: -280px;
  background: rgba(217, 160, 40, 0.07);
}

.hero-section {
  position: relative;
  z-index: 5;
  background: transparent;
}

.hero-container {
  width: 100%;
  max-width: 1280px;
  min-height: 500px;
  margin: 0 auto;
  padding: 82px 24px 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 70px;
}

.hero-content {
  width: 100%;
  max-width: 720px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 18px;
  color: #d9a028;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.section-label-line {
  width: 30px;
  height: 1px;
  background: #d9a028;
}

.hero-title {
  max-width: 620px;
  color: #f5f0e1;
  font-size: clamp(3rem, 6vw, 5.2rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.hero-title span {
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
  animation: goldGradient 5s ease-in-out infinite;
}

.hero-description {
  max-width: 580px;
  margin-top: 27px;
  color: rgba(245, 240, 225, 0.58);
  font-size: 14px;
  line-height: 1.85;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 190px);
  gap: 16px;
  flex-shrink: 0;
}

.stat-card {
  position: relative;
  min-height: 210px;
  overflow: hidden;
  padding: 25px;
  border: 1px solid rgba(245, 240, 225, 0.14);
  border-radius: 5px;
  background: rgba(245, 240, 225, 0.045);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.13),
    inset 0 1px 0 rgba(245, 240, 225, 0.04);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-7px);
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(245, 240, 225, 0.065);
  box-shadow:
    0 28px 60px rgba(0, 0, 0, 0.18),
    0 0 35px rgba(217, 160, 40, 0.04);
}

.stat-top {
  display: flex;
  justify-content: flex-start;
}

.stat-icon-wrapper {
  width: 47px;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.3);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.09);
  color: #f3d27a;
}

.stat-bottom {
  position: absolute;
  right: 25px;
  bottom: 25px;
  left: 25px;
}

.stat-card h2 {
  color: #f5f0e1;
  font-size: 48px;
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.04em;
}

.stat-card p {
  margin-top: 11px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.stat-corner,
.card-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-corner-top,
.card-corner-top {
  top: 10px;
  right: 10px;
  border-top: 1px solid rgba(217, 160, 40, 0.75);
  border-right: 1px solid rgba(217, 160, 40, 0.75);
}

.stat-corner-bottom,
.card-corner-bottom {
  bottom: 10px;
  left: 10px;
  border-bottom: 1px solid rgba(217, 160, 40, 0.75);
  border-left: 1px solid rgba(217, 160, 40, 0.75);
}

.stat-card:hover .stat-corner,
.manage-card:hover .card-corner {
  opacity: 1;
}

.stat-accent {
  position: absolute;
  right: 22px;
  bottom: 0;
  left: 22px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #d9a028,
    transparent
  );
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.stat-card:hover .stat-accent {
  transform: scaleX(1);
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
    rgba(217, 160, 40, 0.25),
    rgba(245, 240, 225, 0.08),
    transparent
  );
}

.manage-section {
  position: relative;
  z-index: 5;
  padding: 62px 0 78px;
  background: transparent;
}

.manage-heading {
  position: relative;
  width: fit-content;
  margin-bottom: 32px;
  color: #f5f0e1;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.035em;
}

.manage-heading::after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 44px;
  height: 2px;
  background: #d9a028;
}

.manage-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.manage-card {
  position: relative;
  min-height: 145px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  overflow: hidden;
  padding: 30px;
  border: 1px solid rgba(245, 240, 225, 0.12);
  border-radius: 5px;
  background: rgba(245, 240, 225, 0.04);
  outline: none;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.manage-card:hover {
  transform: translateY(-5px);
  border-color: rgba(217, 160, 40, 0.35);
  background: rgba(245, 240, 225, 0.055);
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.14),
    0 0 30px rgba(217, 160, 40, 0.03);
}

.manage-card:focus-visible {
  border-color: rgba(217, 160, 40, 0.65);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.1);
}

.manage-card h3 {
  color: #f5f0e1;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.manage-card:hover h3 {
  color: #f3d27a;
}

.manage-card p {
  margin-top: 8px;
  color: rgba(245, 240, 225, 0.45);
  font-size: 11px;
  line-height: 1.6;
}

.arrow-container {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(245, 240, 225, 0.13);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.04);
  color: rgba(245, 240, 225, 0.5);
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;
}

.manage-card:hover .arrow-container {
  color: #f3d27a;
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(217, 160, 40, 0.1);
  transform: translateX(4px);
}

.arrow-icon {
  display: block;
  flex-shrink: 0;
}

.card-accent {
  position: absolute;
  right: 25px;
  bottom: 0;
  left: 25px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    #d9a028,
    transparent
  );
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.manage-card:hover .card-accent {
  transform: scaleX(1);
}

@keyframes goldGradient {
  0%,
  100% {
    background-position: 0% center;
  }

  50% {
    background-position: 100% center;
  }
}

@media (max-width: 1024px) {
  .hero-container {
    min-height: auto;
    align-items: flex-start;
    flex-direction: column;
  }

  .stats-grid {
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-card {
    min-height: 190px;
  }
}

@media (max-width: 640px) {
  .square-grid {
    background-size: 38px 38px;
  }

  .hero-container {
    padding-top: 55px;
    padding-bottom: 55px;
    gap: 42px;
  }

  .hero-title {
    font-size: clamp(2.7rem, 13vw, 4rem);
  }

  .hero-description {
    margin-top: 20px;
    font-size: 12px;
  }

  .stats-grid {
    gap: 12px;
  }

  .stat-card {
    min-height: 165px;
    padding: 20px;
  }

  .stat-bottom {
    right: 20px;
    bottom: 20px;
    left: 20px;
  }

  .stat-card h2 {
    font-size: 39px;
  }

  .stat-icon-wrapper {
    width: 42px;
    height: 42px;
  }

  .manage-section {
    padding-top: 52px;
    padding-bottom: 60px;
  }

  .manage-heading {
    font-size: 27px;
  }

  .manage-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .hero-container {
    padding-right: 18px;
    padding-left: 18px;
  }

  .section-label {
    font-size: 9px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-card {
    min-height: 155px;
    padding: 17px;
  }

  .stat-bottom {
    right: 17px;
    bottom: 17px;
    left: 17px;
  }

  .stat-card h2 {
    font-size: 35px;
  }

  .stat-card p {
    font-size: 9px;
  }

  .manage-card {
    min-height: 130px;
    padding: 23px;
  }

  .manage-card h3 {
    font-size: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-title span {
    animation: none;
  }

  .stat-card,
  .stat-corner,
  .stat-accent,
  .manage-card,
  .manage-card h3,
  .arrow-container,
  .card-corner,
  .card-accent {
    transition: none !important;
  }

  .stat-card:hover,
  .manage-card:hover,
  .manage-card:hover .arrow-container {
    transform: none !important;
  }
}
</style>