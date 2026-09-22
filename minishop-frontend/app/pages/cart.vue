<script setup lang="ts">

useHead({
  title: "MiniShop | Cart",
});


import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "~/composables/api";

const getImageUrl = useImageUrl();
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

if (!authStore.isLoggedIn) {
  router.push("/login");
}

const {
  data: cart,
  pending,
  error,
  refresh,
} = await useAsyncData("cart", getCart, {
  server: false,
});

watch(
  cart,
  (currentCart) => cartStore.syncCart(currentCart),
  { immediate: true },
);

const updatingId = ref<number | null>(null);
const toastMessage = ref("");
const toastType = ref<"success" | "danger">("success");
const showToast = ref(false);

let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function displayToast(
  message: string,
  type: "success" | "danger",
) {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function formatPrice(price: string) {
  return Number(price).toFixed(2);
}

const total = computed(() => {
  if (!cart.value?.items) return "0.00";

  const sum = cart.value.items.reduce(
    (acc, item) =>
      acc +
      Number(item.product.price) * item.quantity,
    0,
  );

  return sum.toFixed(2);
});

async function updateQuantity(
  itemId: number,
  newQuantity: number,
) {
  if (newQuantity < 1) return;

  updatingId.value = itemId;

  try {
    const updatedCart = await updateCartItem(itemId, newQuantity);
    cartStore.syncCart(updatedCart);
    await refresh();

    displayToast(
      "Cart quantity updated successfully.",
      "success",
    );
  } finally {
    updatingId.value = null;
  }
}

async function removeItem(itemId: number) {
  updatingId.value = itemId;

  try {
    const updatedCart = await removeCartItem(itemId);
    cartStore.syncCart(updatedCart);
    await refresh();

    displayToast("Item removed from cart.", "danger");
  } finally {
    updatingId.value = null;
  }
}

</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <UsersNavbar />

    <Transition name="fade">
      <div
        v-if="showToast"
        aria-live="polite"
        class="cart-toast bg-forest"
        :class="{
          'success-toast': toastType === 'success',
          'danger-toast': toastType === 'danger',
        }"
      >
        <div
          class="toast-icon"
          :class="{
            'success-toast-icon': toastType === 'success',
            'danger-toast-icon': toastType === 'danger',
          }"
        >
          {{ toastType === "success" ? "✓" : "×" }}
        </div>

        <div>
          <p class="toast-title">
            {{
              toastType === "success"
                ? "Success"
                : "Removed"
            }}
          </p>

          <p class="toast-description">
            {{ toastMessage }}
          </p>
        </div>
      </div>
    </Transition>

    <main class="cart-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="relative z-10 mx-auto max-w-4xl px-6 py-14 md:py-16">
        <div class="page-header">
          <h1 class="font-display">
            Your Cart
          </h1>

          <p>
            Review your items before checkout.
          </p>
        </div>

        <div class="header-divider"></div>

        <div
          v-if="pending"
          class="page-state"
        >
          Loading cart...
        </div>

        <div
          v-else-if="error"
          class="page-state"
        >
          Failed to load cart. Is the backend running?
        </div>

        <div
          v-else-if="!cart?.items || cart.items.length === 0"
          class="empty-state"
        >
          <span>Your cart is empty.</span>

          <NuxtLink
            to="/products"
            class="browse-link"
          >
            Browse products
          </NuxtLink>
        </div>

        <div v-else>
          <div class="cart-items">
            <div
              v-for="item in cart.items"
              :key="item.id"
              class="cart-item"
            >
              <div class="item-image">
                <img
                  v-if="item.product.imageUrl"
                  :src="getImageUrl(item.product.imageUrl)"
                  :alt="item.product.name"
                />

                <span v-else>
                  No image
                </span>
              </div>

              <div class="item-information">
                <h3 class="font-display">
                  {{ item.product.name }}
                </h3>

                <p>
                  PKR {{ formatPrice(item.product.price) }}
                </p>
              </div>

              <div class="quantity-control">
                <button
                  :disabled="
                    item.quantity === 1 ||
                    updatingId === item.id
                  "
                  @click="
                    updateQuantity(
                      item.id,
                      item.quantity - 1,
                    )
                  "
                >
                  &minus;
                </button>

                <span>
                  {{ item.quantity }}
                </span>

                <button
                  :disabled="updatingId === item.id"
                  @click="
                    updateQuantity(
                      item.id,
                      item.quantity + 1,
                    )
                  "
                >
                  &plus;
                </button>
              </div>

              <button
                :disabled="updatingId === item.id"
                class="remove-button"
                @click="removeItem(item.id)"
              >
                Remove
              </button>

              <div class="item-accent"></div>
            </div>
          </div>

          <div class="cart-summary">
            <div>
              <p class="total-label">
                Total
              </p>

              <p class="total-price font-display">
                PKR {{ total }}
              </p>
            </div>

            <NuxtLink
              to="/checkout"
              class="checkout-button"
            >
              Checkout
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.cart-page {
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
  bottom: 60px;
  left: -330px;
  background: rgba(217, 160, 40, 0.045);
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

.browse-link {
  color: #f3d27a;
  font-weight: 600;
  transition: color 0.25s ease;
}

.browse-link:hover {
  color: #d9a028;
  text-decoration: underline;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

.cart-item {
  position: relative;
  display: grid;
  grid-template-columns:
    82px
    minmax(180px, 1fr)
    auto
    auto;
  align-items: center;
  gap: 20px;
  overflow: hidden;
  padding: 16px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 14px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-3px);
  border-color: rgba(217, 160, 40, 0.22);
  background: rgba(245, 240, 225, 0.045);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 82px;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.08);
  border-radius: 10px;
  background: rgba(245, 240, 225, 0.03);
  color: rgba(245, 240, 225, 0.3);
  font-size: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cart-item:hover .item-image img {
  transform: scale(1.06);
}

.item-information {
  min-width: 0;
}

.item-information h3 {
  overflow: hidden;
  color: #f5f0e1;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.cart-item:hover .item-information h3 {
  color: #f3d27a;
}

.item-information p {
  margin-top: 7px;
  color: #f3d27a;
  font-size: 11px;
  font-weight: 700;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 9px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.12);
  border-radius: 8px;
  background: rgba(245, 240, 225, 0.035);
  color: rgba(245, 240, 225, 0.7);
  font-size: 15px;
  transition:
    color 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.quantity-control button:hover:not(:disabled) {
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
}

.quantity-control button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.quantity-control span {
  width: 25px;
  color: #f5f0e1;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

.remove-button {
  padding: 7px 9px;
  color: rgba(245, 240, 225, 0.38);
  font-size: 9px;
  font-weight: 600;
  transition: color 0.25s ease;
}

.remove-button:hover:not(:disabled) {
  color: #f87171;
}

.remove-button:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.item-accent {
  position: absolute;
  right: 16px;
  bottom: 0;
  left: 16px;
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

.cart-item:hover .item-accent {
  transform: scaleX(1);
}

.cart-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  padding: 24px;
  border: 1px solid rgba(217, 160, 40, 0.17);
  border-radius: 15px;
  background: rgba(217, 160, 40, 0.045);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07);
}

.total-label {
  color: rgba(245, 240, 225, 0.38);
  font-size: 9px;
  font-weight: 600;
}

.total-price {
  margin-top: 4px;
  color: #f5f0e1;
  font-size: 25px;
  font-weight: 500;
  line-height: 1.2;
}

.checkout-button {
  min-width: 145px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border: 1px solid rgba(217, 160, 40, 0.4);
  border-radius: 9px;
  background: #d9a028;
  color: #14261a;
  font-size: 10px;
  font-weight: 700;
  transition:
    background 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.checkout-button:hover:not(:disabled) {
  background: #f3d27a;
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(217, 160, 40, 0.12);
}

.checkout-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cart-toast {
  position: fixed;
  z-index: 100;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: calc(100vw - 48px);
  padding: 13px 17px;
  border-radius: 14px;
  color: #f5f0e1;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
}

.success-toast {
  border: 1px solid rgba(217, 160, 40, 0.25);
}

.danger-toast {
  border: 1px solid rgba(239, 68, 68, 0.28);
}

.toast-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 800;
}

.success-toast-icon {
  background: #d9a028;
  color: #14261a;
}

.danger-toast-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.toast-title {
  color: #f5f0e1;
  font-size: 11px;
  font-weight: 700;
}

.toast-description {
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

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .cart-item {
    grid-template-columns: 75px minmax(0, 1fr);
    gap: 14px;
  }

  .item-image {
    width: 75px;
    height: 75px;
  }

  .quantity-control {
    grid-column: 1 / 2;
    justify-content: flex-start;
  }

  .remove-button {
    grid-column: 2;
    justify-self: end;
  }
}

@media (max-width: 520px) {
  .header-divider {
    margin: 25px 0 30px;
  }

  .cart-summary {
    align-items: stretch;
    flex-direction: column;
  }

  .checkout-button {
    width: 100%;
  }

  .cart-toast {
    top: 15px;
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .empty-state {
    flex-direction: column;
  }
}

@media (max-width: 390px) {
  .cart-item {
    grid-template-columns: 65px minmax(0, 1fr);
    padding: 13px;
  }

  .item-image {
    width: 65px;
    height: 65px;
  }

  .quantity-control button {
    width: 30px;
    height: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cart-item,
  .item-image img,
  .item-information h3,
  .quantity-control button,
  .remove-button,
  .item-accent,
  .checkout-button {
    transition: none !important;
  }

  .cart-item:hover,
  .cart-item:hover .item-image img,
  .checkout-button:hover {
    transform: none !important;
  }
}
</style>
