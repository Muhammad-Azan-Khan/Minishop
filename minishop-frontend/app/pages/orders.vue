<script setup lang="ts">
useHead({
  title: "MiniShop | Orders",
});

import { Check } from "lucide-vue-next";
import type { Order } from "~/types/order";
import { getMyOrders } from "~/composables/api";

const getImageUrl = useImageUrl();
const authStore = useAuthStore();
const router = useRouter();

if (!authStore.isLoggedIn) {
  router.push("/login");
}

const orderSuccessToast = ref("");

const {
  data: orders,
  pending,
  error,
} = await useAsyncData("my-orders", getMyOrders, {
  server: false,
});

function formatPrice(price: string) {
  return Number(price).toFixed(2);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const statusStyles: Record<Order["status"], string> = {
  PENDING: "status-pending",
  SHIPPED: "status-shipped",
  DELIVERED: "status-delivered",
  PROCESSING: "status-processing",
  CANCELLED: "status-cancelled",
};

onMounted(() => {
  const message = sessionStorage.getItem("orderSuccess");

  if (message) {
    orderSuccessToast.value = message;
    sessionStorage.removeItem("orderSuccess");

    setTimeout(() => {
      orderSuccessToast.value = "";
    }, 3500);
  }
});
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <UsersNavbar />

    <Transition name="toast">
      <div
        v-if="orderSuccessToast"
        class="order-success-toast"
        role="status"
      >
        <div class="toast-icon">
          <Check :size="17" />
        </div>

        <div class="toast-content">
          <strong>Order placed</strong>
          <p>{{ orderSuccessToast }}</p>
        </div>
      </div>
    </Transition>

    <main class="orders-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 py-14 md:py-16">
        <div class="page-header">
          <h1 class="font-display">
            Your Orders
          </h1>

          <p>
            Track and review your past purchases.
          </p>
        </div>

        <div class="header-divider"></div>

        <div
          v-if="pending"
          class="page-state"
        >
          Loading orders...
        </div>

        <div
          v-else-if="error"
          class="page-state"
        >
          Failed to load orders. Is the backend running?
        </div>

        <div
          v-else-if="!orders || orders.length === 0"
          class="empty-state"
        >
          <span>You haven't placed any orders yet.</span>

          <NuxtLink
            to="/products"
            class="shopping-link"
          >
            Start shopping
          </NuxtLink>
        </div>

        <div
          v-else
          class="orders-list"
        >
          <div
            v-for="order in orders"
            :key="order.id"
            class="order-card"
          >
            <div class="order-header">
              <div>
                <p class="order-number font-display">
                  Order #{{ order.id }}
                </p>

                <p class="order-date">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>

              <div class="order-summary">
                <span
                  class="status-badge"
                  :class="statusStyles[order.status]"
                >
                  {{ order.status }}
                </span>

                <p class="order-total font-display">
                  PKR {{ formatPrice(order.totalAmount) }}
                </p>
              </div>
            </div>

            <div class="order-items">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-item"
              >
                <div class="item-image">
                  <img
                    v-if="item.product?.imageUrl"
                    :src="getImageUrl(item.product.imageUrl)"
                    :alt="item.product?.name"
                  />

                  <span v-else>
                    No image
                  </span>
                </div>

                <div class="item-information">
                  <p class="item-name">
                    {{
                      item.product?.name ||
                      "Product no longer available"
                    }}
                  </p>

                  <p class="item-quantity">
                    Qty: {{ item.quantity }}
                  </p>
                </div>

                <p class="item-price">
                  PKR {{ formatPrice(item.priceAtPurchase) }}
                </p>
              </div>
            </div>

            <div class="card-corner corner-top"></div>
            <div class="card-corner corner-bottom"></div>
            <div class="card-accent"></div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.orders-page {
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

.order-success-toast {
  position: fixed;
  z-index: 100;
  top: 100px;
  right: 24px;
  width: min(360px, calc(100vw - 32px));
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(217, 160, 40, 0.28);
  border-radius: 10px;
  background: #17302e;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.28),
    0 0 30px rgba(217, 160, 40, 0.06);
}

.toast-icon {
  width: 36px;
  height: 36px;
  display: grid;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid rgba(217, 160, 40, 0.28);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.1);
  color: #f3d27a;
}

.toast-content {
  min-width: 0;
}

.toast-content strong {
  display: block;
  color: #f5f0e1;
  font-size: 12px;
  font-weight: 600;
}

.toast-content p {
  margin-top: 2px;
  color: rgba(245, 240, 225, 0.55);
  font-size: 9px;
  line-height: 1.5;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.page-header h1 {
  color: #f5f0e1;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.035em;
}

.page-header p {
  margin-top: 12px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 12px;
  line-height: 1.65;
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

.page-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.42);
  font-size: 12px;
  text-align: center;
}

.empty-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: rgba(245, 240, 225, 0.45);
  font-size: 12px;
  text-align: center;
}

.shopping-link {
  color: #f3d27a;
  font-weight: 600;
  transition: color 0.25s ease;
}

.shopping-link:hover {
  color: #d9a028;
  text-decoration: underline;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.order-card {
  position: relative;
  overflow: hidden;
  padding: 24px;
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

.order-card:hover {
  transform: translateY(-4px);
  border-color: rgba(217, 160, 40, 0.25);
  background: rgba(245, 240, 225, 0.045);
  box-shadow:
    0 22px 45px rgba(0, 0, 0, 0.13),
    0 0 30px rgba(217, 160, 40, 0.025);
}

.order-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(245, 240, 225, 0.08);
}

.order-number {
  color: #f5f0e1;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.order-card:hover .order-number {
  color: #f3d27a;
}

.order-date {
  margin-top: 5px;
  color: rgba(245, 240, 225, 0.38);
  font-size: 9px;
}

.order-summary {
  text-align: right;
}

.status-badge {
  display: inline-block;
  margin-bottom: 7px;
  padding: 5px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.status-pending {
  border-color: rgba(217, 160, 40, 0.22);
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
}

.status-shipped {
  border-color: rgba(96, 165, 250, 0.2);
  background: rgba(96, 165, 250, 0.08);
  color: #93c5fd;
}

.status-delivered {
  border-color: rgba(74, 222, 128, 0.2);
  background: rgba(74, 222, 128, 0.08);
  color: #86efac;
}

.status-processing {
  border-color: rgba(192, 132, 252, 0.2);
  background: rgba(192, 132, 252, 0.08);
  color: #d8b4fe;
}

.status-cancelled {
  border-color: rgba(248, 113, 113, 0.2);
  background: rgba(248, 113, 113, 0.08);
  color: #fca5a5;
}

.order-total {
  color: #f5f0e1;
  font-size: 19px;
  font-weight: 500;
  line-height: 1.2;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.order-item:hover {
  border-color: rgba(245, 240, 225, 0.07);
  background: rgba(245, 240, 225, 0.025);
}

.item-image {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.08);
  border-radius: 8px;
  background: rgba(245, 240, 225, 0.03);
  color: rgba(245, 240, 225, 0.3);
  font-size: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.order-item:hover .item-image img {
  transform: scale(1.06);
}

.item-information {
  min-width: 0;
  flex: 1;
}

.item-name {
  overflow: hidden;
  color: rgba(245, 240, 225, 0.82);
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-quantity {
  margin-top: 4px;
  color: rgba(245, 240, 225, 0.34);
  font-size: 9px;
}

.item-price {
  flex-shrink: 0;
  color: rgba(245, 240, 225, 0.5);
  font-size: 10px;
  font-weight: 500;
}

.card-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.corner-top {
  top: 11px;
  right: 11px;
  border-top: 1px solid rgba(217, 160, 40, 0.7);
  border-right: 1px solid rgba(217, 160, 40, 0.7);
}

.corner-bottom {
  bottom: 11px;
  left: 11px;
  border-bottom: 1px solid rgba(217, 160, 40, 0.7);
  border-left: 1px solid rgba(217, 160, 40, 0.7);
}

.order-card:hover .card-corner {
  opacity: 1;
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
  transform-origin: center;
  transition: transform 0.4s ease;
}

.order-card:hover .card-accent {
  transform: scaleX(1);
}

@media (max-width: 640px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .order-success-toast {
    top: 88px;
    right: 16px;
    left: 16px;
    width: auto;
  }

  .header-divider {
    margin: 25px 0 30px;
  }

  .order-card {
    padding: 18px;
  }

  .order-header {
    gap: 15px;
  }

  .order-number {
    font-size: 18px;
  }

  .order-total {
    font-size: 17px;
  }
}

@media (max-width: 480px) {
  .order-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .order-summary {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    text-align: left;
  }

  .status-badge {
    margin-bottom: 0;
  }

  .order-item {
    padding-right: 0;
    padding-left: 0;
  }

  .item-image {
    width: 52px;
    height: 52px;
  }

  .item-price {
    font-size: 9px;
  }

  .empty-state {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shopping-link,
  .order-card,
  .order-number,
  .order-item,
  .item-image img,
  .card-corner,
  .card-accent,
  .toast-enter-active,
  .toast-leave-active {
    transition: none !important;
  }

  .order-card:hover,
  .order-item:hover .item-image img {
    transform: none !important;
  }
}
</style>