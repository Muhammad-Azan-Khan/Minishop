<script setup lang="ts">
useHead({
  title: "MiniShop | Orders",
});

import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  RefreshCcw,
} from "lucide-vue-next";
import type { Order } from "~/types/order";
import {
  getAllOrdersAdmin,
  updateOrderStatus,
} from "~/composables/api";

const authStore = useAuthStore();
const router = useRouter();
const getImageUrl = useImageUrl();

if (!authStore.isLoggedIn || !authStore.isAdmin) {
  router.push("/login");
}

const orders = ref<Order[]>([]);
const loading = ref(true);

const pageSize = 10;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(orders.value.length / pageSize)),
);

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return orders.value.slice(start, start + pageSize);
});

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount;
  }
});

const updatingId = ref<number | null>(null);
const showSuccess = ref(false);
const successMessage = ref("");

const fetchOrders = async () => {
  try {
    orders.value = await getAllOrdersAdmin();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  } finally {
    loading.value = false;
  }
};

const updateStatusHandler = async (order: Order) => {
  try {
    updatingId.value = order.id;

    await updateOrderStatus(order.id, order.status);

    successMessage.value = "Order status updated successfully.";
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error("Status update failed:", error);
  } finally {
    updatingId.value = null;
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <AdminNavbar />

    <Transition name="fade">
      <div
        v-if="showSuccess"
        class="success-toast"
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

    <main class="orders-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-14">
        <NuxtLink
          to="/adminaccount"
          class="back-link"
        >
          <span class="back-icon">
            <ArrowLeft :size="17" />
          </span>

          <span>Back</span>
        </NuxtLink>

        <div class="page-header">
          <div class="page-label">
            <span class="page-label-line"></span>
            <span>Store Management</span>
          </div>

          <h1>Orders Management</h1>

          <p>
            View customer orders and update order status.
          </p>
        </div>

        <div class="header-divider"></div>

        <div
          v-if="loading"
          class="loading-state"
        >
          <div class="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>

        <div
          v-else
          class="orders-list"
        >
          <div
            v-for="order in paginatedOrders"
            :key="order.id"
            class="order-card"
          >
            <div class="order-header">
              <div class="order-information">
                <div class="order-number-row">
                  <span class="order-label">
                    Order
                  </span>

                  <h2>
                    #{{ order.id }}
                  </h2>
                </div>

                <div class="order-meta">
                  <div class="meta-item">
                    <span class="meta-icon">
                      <User :size="15" />
                    </span>

                    <span>
                      {{ order.user.name }}
                    </span>
                  </div>

                  <div class="meta-item">
                    <span class="meta-icon">
                      <Calendar :size="15" />
                    </span>

                    <span>
                      {{
                        new Date(
                          order.createdAt,
                        ).toLocaleDateString()
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="status-controls">
                <select v-model="order.status">
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="PROCESSING">
                    Processing
                  </option>

                  <option value="SHIPPED">
                    Shipped
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>

                <button
                  :disabled="updatingId === order.id"
                  @click="updateStatusHandler(order)"
                >
                  <RefreshCcw
                    :size="15"
                    :class="{
                      'status-spinning':
                        updatingId === order.id,
                    }"
                  />

                  <span>
                    {{
                      updatingId === order.id
                        ? "Updating..."
                        : "Update Status"
                    }}
                  </span>
                </button>
              </div>
            </div>

            <div class="order-divider"></div>

            <div class="products-heading">
              <div class="products-heading-icon">
                <Package :size="18" />
              </div>

              <h3>Products</h3>
            </div>

            <div class="order-products">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="order-product"
              >
                <div class="product-image">
                  <img
                    v-if="item.product?.imageUrl"
                    :src="getImageUrl(item.product.imageUrl)"
                    :alt="item.product?.name"
                  />

                  <div
                    v-else
                    class="no-image"
                  >
                    No Image
                  </div>
                </div>

                <div class="product-info">
                  <p class="product-name">
                    {{
                      item.product?.name ||
                      "Product no longer available"
                    }}
                  </p>

                  <div class="product-meta">
                    <span>
                      Quantity:
                      <strong>{{ item.quantity }}</strong>
                    </span>

                    <span class="meta-dot"></span>

                    <span>
                      Price:
                      <strong>
                        Rs {{ item.priceAtPurchase }}
                      </strong>
                    </span>
                  </div>
                </div>

                <div class="product-total">
                  <span>Subtotal</span>

                  <strong>
                    Rs
                    {{
                      Number(item.priceAtPurchase) *
                      item.quantity
                    }}
                  </strong>
                </div>
              </div>
            </div>

            <div class="total-section">
              <p>Total Amount</p>

              <strong>
                Rs {{ order.totalAmount }}
              </strong>
            </div>

            <div class="order-accent"></div>
          </div>
        </div>

        <CatalogPagination
          v-if="!loading && orders.length > 0"
          v-model="currentPage"
          :total-pages="totalPages"
        />
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
  top: -260px;
  right: -260px;
  background: rgba(217, 160, 40, 0.08);
}

.page-glow-two {
  width: 500px;
  height: 500px;
  bottom: 100px;
  left: -350px;
  background: rgba(217, 160, 40, 0.045);
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

.back-icon {
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.035);
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.back-link:hover .back-icon {
  border-color: rgba(217, 160, 40, 0.3);
  background: rgba(217, 160, 40, 0.08);
}

.page-header {
  margin-top: 34px;
}

.page-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: #d9a028;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.page-label-line {
  width: 25px;
  height: 1px;
  background: #d9a028;
}

.page-header h1 {
  color: #f5f0e1;
  font-size: clamp(2.7rem, 5vw, 4.3rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
}

.page-header p {
  margin-top: 12px;
  color: rgba(245, 240, 225, 0.47);
  font-size: 12px;
  line-height: 1.6;
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

.loading-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: rgba(245, 240, 225, 0.4);
  font-size: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(245, 240, 225, 0.1);
  border-top-color: #d9a028;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  position: relative;
  overflow: hidden;
  padding: 25px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 18px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;
}

.order-card:hover {
  transform: translateY(-4px);
  border-color: rgba(217, 160, 40, 0.25);
  background: rgba(245, 240, 225, 0.045);
  box-shadow:
    0 20px 45px rgba(0, 0, 0, 0.14),
    0 0 30px rgba(217, 160, 40, 0.02);
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.order-number-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.order-label {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 9px;
  border: 1px solid rgba(217, 160, 40, 0.18);
  border-radius: 999px;
  background: rgba(217, 160, 40, 0.07);
  color: #d9a028;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.order-number-row h2 {
  color: #f5f0e1;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.025em;
}

.order-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(245, 240, 225, 0.46);
  font-size: 10px;
}

.meta-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.15);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.055);
  color: #f3d27a;
}

.status-controls {
  display: flex;
  align-items: center;
  gap: 9px;
}

.status-controls select {
  height: 42px;
  min-width: 145px;
  padding: 0 35px 0 13px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 10px;
  outline: none;
  background: rgba(245, 240, 225, 0.035);
  color: #f5f0e1;
  font-size: 10px;
  cursor: pointer;
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.status-controls select:focus {
  border-color: rgba(217, 160, 40, 0.45);
  background: rgba(245, 240, 225, 0.05);
}

.status-controls select option {
  background: #14261a;
  color: #f5f0e1;
}

.status-controls button {
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  border: 1px solid rgba(217, 160, 40, 0.3);
  border-radius: 10px;
  background: #d9a028;
  color: #14261a;
  font-size: 10px;
  font-weight: 700;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
}

.status-controls button:hover:not(:disabled) {
  background: #f3d27a;
  transform: translateY(-1px);
}

.status-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.status-spinning {
  animation: spin 0.8s linear infinite;
}

.order-divider {
  height: 1px;
  margin: 23px 0;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.16),
    transparent
  );
}

.products-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 14px;
}

.products-heading-icon {
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.16);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.06);
  color: #f3d27a;
}

.products-heading h3 {
  color: #f5f0e1;
  font-size: 14px;
  font-weight: 600;
}

.order-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.order-product {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 82px;
  padding: 11px;
  border: 1px solid rgba(245, 240, 225, 0.07);
  border-radius: 12px;
  background: rgba(245, 240, 225, 0.025);
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.order-product:hover {
  border-color: rgba(217, 160, 40, 0.14);
  background: rgba(245, 240, 225, 0.04);
}

.product-image {
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.08);
  border-radius: 10px;
  background: rgba(245, 240, 225, 0.035);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.25);
  font-size: 8px;
}

.product-info {
  min-width: 0;
  flex: 1;
}

.product-name {
  overflow: hidden;
  color: #f5f0e1;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
  color: rgba(245, 240, 225, 0.35);
  font-size: 9px;
}

.product-meta strong {
  color: rgba(245, 240, 225, 0.62);
  font-weight: 600;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.5);
}

.product-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.product-total span {
  color: rgba(245, 240, 225, 0.3);
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.product-total strong {
  margin-top: 4px;
  color: #f3d27a;
  font-size: 11px;
  font-weight: 600;
}

.total-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 19px;
  border-top: 1px solid rgba(245, 240, 225, 0.08);
}

.total-section p {
  color: rgba(245, 240, 225, 0.4);
  font-size: 10px;
  font-weight: 500;
}

.total-section strong {
  color: #f3d27a;
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.order-accent {
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

.order-card:hover .order-accent {
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
  background: #14261a;
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
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .page-header {
    margin-top: 28px;
  }

  .order-card {
    padding: 20px;
  }

  .order-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .status-controls {
    width: 100%;
  }

  .status-controls select,
  .status-controls button {
    flex: 1;
  }

  .order-meta {
    flex-wrap: wrap;
  }
}

@media (max-width: 520px) {
  .success-toast {
    top: 15px;
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .status-controls {
    flex-direction: column;
  }

  .status-controls select,
  .status-controls button {
    width: 100%;
  }

  .order-product {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .product-info {
    width: calc(100% - 77px);
    flex: none;
  }

  .product-total {
    width: 100%;
    align-items: flex-end;
    padding-top: 8px;
    border-top: 1px solid rgba(245, 240, 225, 0.06);
  }

  .product-meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .meta-dot {
    display: none;
  }

  .total-section strong {
    font-size: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .back-icon,
  .order-card,
  .order-product,
  .status-controls select,
  .status-controls button,
  .order-accent {
    transition: none !important;
  }

  .back-link:hover,
  .order-card:hover,
  .status-controls button:hover {
    transform: none !important;
  }
}
</style>