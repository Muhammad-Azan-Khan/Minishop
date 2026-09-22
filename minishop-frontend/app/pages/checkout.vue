<script setup lang="ts">
import {
  ArrowLeft,
  Check,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
} from "lucide-vue-next";
import { checkoutCart, getCart } from "~/composables/api";

const authStore = useAuthStore();
const cartStore = useCartStore();
const getImageUrl = useImageUrl();

const { data: cart, pending, error } = await useAsyncData(
  "checkout-cart",
  getCart,
  { server: false },
);

const form = reactive({
  fullName: authStore.user?.name ?? "",
  email: authStore.user?.email ?? "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  cardName: authStore.user?.name ?? "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});

const fieldErrors = reactive<Record<string, string>>({});
const checkoutError = ref("");
const placingOrder = ref(false);

// Controls the 3D flip of the card preview. True = showing the back
// (where the CVV lives), false = showing the front.
const isCardFlipped = ref(false);

function flipCardToBack() {
  isCardFlipped.value = true;
}

function flipCardToFront() {
  isCardFlipped.value = false;
}

function toggleCardFlip() {
  isCardFlipped.value = !isCardFlipped.value;
}

const total = computed(() => {
  const amount =
    cart.value?.items.reduce(
      (sum, item) =>
        sum + Number(item.product.price) * item.quantity,
      0,
    ) ?? 0;

  return amount.toFixed(2);
});

const itemCount = computed(
  () =>
    cart.value?.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ) ?? 0,
);

function formatPrice(price: string) {
  return Number(price).toFixed(2);
}

function moveCaretToEnd(element: HTMLElement) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function formatCardNumber(event: Event) {
  const field = event.currentTarget as HTMLElement;

  const digits = (field.textContent ?? "")
    .replace(/\D/g, "")
    .slice(0, 16);

  const formattedValue = digits
    .replace(/(.{4})/g, "$1 ")
    .trim();

  form.cardNumber = formattedValue;

  if (field.textContent !== formattedValue) {
    field.textContent = formattedValue;
    moveCaretToEnd(field);
  }
}

function formatExpiry(event: Event) {
  const field = event.currentTarget as HTMLElement;

  const digits = (field.textContent ?? "")
    .replace(/\D/g, "")
    .slice(0, 4);

  const formattedValue =
    digits.length > 2
      ? `${digits.slice(0, 2)}/${digits.slice(2)}`
      : digits;

  form.expiry = formattedValue;

  if (field.textContent !== formattedValue) {
    field.textContent = formattedValue;
    moveCaretToEnd(field);
  }
}

function formatCvv(event: Event) {
  const field = event.currentTarget as HTMLElement;

  const formattedValue = (field.textContent ?? "")
    .replace(/\D/g, "")
    .slice(0, 4);

  form.cvv = formattedValue;

  if (field.textContent !== formattedValue) {
    field.textContent = formattedValue;
    moveCaretToEnd(field);
  }
}

function validateForm() {
  Object.keys(fieldErrors).forEach(
    (key) => delete fieldErrors[key],
  );

  if (!form.fullName.trim()) {
    fieldErrors.fullName = "Enter your full name.";
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (form.phone.replace(/\D/g, "").length < 10) {
    fieldErrors.phone = "Enter a valid phone number.";
  }

  if (form.address.trim().length < 5) {
    fieldErrors.address = "Enter your delivery address.";
  }

  if (!form.city.trim()) {
    fieldErrors.city = "Enter your city.";
  }

  if (!form.postalCode.trim()) {
    fieldErrors.postalCode = "Enter your postal code.";
  }

  if (!form.cardName.trim()) {
    fieldErrors.cardName =
      "Enter the name shown on the card.";
  }

  const cardDigits = form.cardNumber.replace(/\D/g, "");

  if (cardDigits.length !== 16) {
    fieldErrors.cardNumber =
      "Card number must be exactly 16 digits.";
  }

  if (!form.expiry.trim()) {
    fieldErrors.expiry = "Enter an expiry date.";
  }

  if (!form.cvv.trim()) {
    fieldErrors.cvv = "Enter a security code.";
  }

  return Object.keys(fieldErrors).length === 0;
}

async function placeOrder() {
  checkoutError.value = "";

  if (!validateForm()) {
    await nextTick();

    document
      .querySelector<HTMLElement>(".field-error")
      ?.closest(".form-field")
      ?.querySelector<HTMLElement>(
        "input, select, [contenteditable='true']",
      )
      ?.focus();

    return;
  }

  if (!cart.value?.items.length || placingOrder.value) {
    return;
  }

  placingOrder.value = true;

  try {
    await checkoutCart();
    cartStore.clearCart();

    sessionStorage.setItem(
      "orderSuccess",
      "Your order has been placed successfully.",
    );

    await navigateTo("/orders");
  } catch (err: any) {
    checkoutError.value =
      err?.data?.message ||
      "We couldn't place your order. Please try again.";
  } finally {
    placingOrder.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <UsersNavbar />

    <main class="checkout-page bg-forest">
      <div class="page-grid"></div>

      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div
        class="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-6 md:py-14"
      >
        <NuxtLink
          to="/cart"
          class="back-link"
        >
          <ArrowLeft :size="16" />
          Back to cart
        </NuxtLink>

        <div class="page-header">
          <div>
            <p class="eyebrow">
              Secure checkout
            </p>

            <h1 class="font-display">
              Complete your order
            </h1>

            <p class="page-description">
              Add your delivery and payment details below.
            </p>
          </div>

          <div
            class="steps"
            aria-label="Checkout progress"
          >
            <span class="step-complete">
              <Check :size="12" />
              Cart
            </span>

            <span class="step-line"></span>

            <span class="step-current">
              2
            </span>

            <span class="step-label">
              Checkout
            </span>
          </div>
        </div>

        <div class="header-divider"></div>

        <div
          v-if="pending"
          class="page-state"
        >
          Loading checkout...
        </div>

        <div
          v-else-if="error"
          class="page-state"
        >
          Failed to load your cart. Is the backend running?
        </div>

        <div
          v-else-if="!cart?.items.length"
          class="empty-state"
        >
          <CreditCard :size="30" />

          <h2 class="font-display">
            Your cart is empty
          </h2>

          <p>
            Add something to your cart before checking out.
          </p>

          <NuxtLink
            to="/products"
            class="primary-link"
          >
            Browse products
          </NuxtLink>
        </div>

        <form
          v-else
          class="checkout-layout"
          novalidate
          @submit.prevent="placeOrder"
        >
          <div class="form-column">
            <section class="form-card">
              <div class="section-heading payment-heading">
                <span class="section-icon">
                  <CreditCard :size="18" />
                </span>

                <div>
                  <p class="section-number">
                    01
                  </p>

                  <h2 class="font-display">
                    Payment details
                  </h2>
                </div>

                <span class="secure-label">
                  <LockKeyhole :size="12" />
                  Not stored
                </span>
              </div>

              <!-- 3D rotating card preview -->
              <div
                class="card-scene"
                aria-hidden="true"
              >
                <div
                  class="card-flipper"
                  :class="{ flipped: isCardFlipped }"
                  role="button"
                  tabindex="-1"
                  @click="toggleCardFlip"
                >
                  <!-- FRONT FACE -->
                  <div class="card-face card-front">
                    <div class="card-shine"></div>

                    <div class="card-preview-top">
                      <span class="card-chip"></span>
                      <span class="card-network">
                        VISA
                      </span>
                    </div>

                    <p class="preview-number">
                      {{
                        form.cardNumber ||
                        "•••• •••• •••• ••••"
                      }}
                    </p>

                    <div class="preview-bottom">
                      <div class="preview-field">
                        <span class="preview-label">
                          Card holder
                        </span>
                        <span class="preview-value">
                          {{
                            form.cardName ||
                            "CARDHOLDER NAME"
                          }}
                        </span>
                      </div>

                      <div class="preview-field align-right">
                        <span class="preview-label">
                          Expires
                        </span>
                        <span class="preview-value">
                          {{
                            form.expiry ||
                            "MM/YY"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- BACK FACE -->
                  <div class="card-face card-back">
                    <div class="magnetic-stripe"></div>

                    <div class="signature-row">
                      <div class="signature-strip"></div>

                      <div class="cvv-box">
                        {{
                          form.cvv
                            ? "•".repeat(form.cvv.length)
                            : "CVV"
                        }}
                      </div>
                    </div>

                    <p class="back-note">
                      This card is property of MiniShop
                      Bank. Authorized signature required.
                      Not valid unless signed.
                    </p>

                    <span class="card-network back-network">
                      VISA
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-grid payment-grid">
                <label class="form-field full-width">
                  <span>
                    Name on card
                  </span>

                  <input
                    v-model="form.cardName"
                    autocomplete="off"
                    type="text"
                    placeholder="Name as shown on card"
                    :class="{
                      invalid: fieldErrors.cardName,
                    }"
                    @focus="flipCardToFront"
                  />

                  <small
                    v-if="fieldErrors.cardName"
                    class="field-error"
                  >
                    {{ fieldErrors.cardName }}
                  </small>
                </label>

                <label class="form-field full-width">
                  <span>
                    Card number
                  </span>

                  <div class="input-with-icon">
                    <CreditCard :size="17" />

                    <div
                      role="textbox"
                      aria-label="Card number"
                      :aria-invalid="
                        Boolean(fieldErrors.cardNumber)
                      "
                      aria-multiline="false"
                      contenteditable="true"
                      inputmode="numeric"
                      spellcheck="false"
                      data-placeholder="1234 5678 9012 3456"
                      class="editable-field"
                      :class="{
                        invalid: fieldErrors.cardNumber,
                      }"
                      @input="formatCardNumber"
                      @focus="flipCardToFront"
                      @keydown.enter.prevent
                    ></div>
                  </div>

                  <small
                    v-if="fieldErrors.cardNumber"
                    class="field-error"
                  >
                    {{ fieldErrors.cardNumber }}
                  </small>
                </label>

                <label class="form-field">
                  <span>
                    Expiry date
                  </span>

                  <div
                    role="textbox"
                    aria-label="Expiry date"
                    :aria-invalid="
                      Boolean(fieldErrors.expiry)
                    "
                    aria-multiline="false"
                    contenteditable="true"
                    inputmode="numeric"
                    spellcheck="false"
                    data-placeholder="MM/YY"
                    class="editable-field"
                    :class="{
                      invalid: fieldErrors.expiry,
                    }"
                    @input="formatExpiry"
                    @focus="flipCardToFront"
                    @keydown.enter.prevent
                  ></div>

                  <small
                    v-if="fieldErrors.expiry"
                    class="field-error"
                  >
                    {{ fieldErrors.expiry }}
                  </small>
                </label>

                <label class="form-field">
                  <span>
                    CVV
                  </span>

                  <div
                    role="textbox"
                    aria-label="CVV"
                    :aria-invalid="
                      Boolean(fieldErrors.cvv)
                    "
                    aria-multiline="false"
                    contenteditable="true"
                    inputmode="numeric"
                    spellcheck="false"
                    data-placeholder="•••"
                    class="editable-field cvv-field"
                    :class="{
                      invalid: fieldErrors.cvv,
                    }"
                    @input="formatCvv"
                    @focus="flipCardToBack"
                    @blur="flipCardToFront"
                    @keydown.enter.prevent
                  ></div>

                  <small
                    v-if="fieldErrors.cvv"
                    class="field-error"
                  >
                    {{ fieldErrors.cvv }}
                  </small>
                </label>
              </div>

              <p class="privacy-note">
                <ShieldCheck :size="15" />

                Your card details are used only to validate
                this checkout and are not stored by MiniShop.
              </p>
            </section>

            <section class="form-card">
              <div class="section-heading">
                <span class="section-icon">
                  <MapPin :size="18" />
                </span>

                <div>
                  <p class="section-number">
                    02
                  </p>

                  <h2 class="font-display">
                    Delivery information
                  </h2>
                </div>
              </div>

              <div class="form-grid">
                <label class="form-field full-width">
                  <span>
                    Full name
                  </span>

                  <input
                    v-model="form.fullName"
                    autocomplete="name"
                    type="text"
                    placeholder="Your full name"
                    :class="{
                      invalid: fieldErrors.fullName,
                    }"
                  />

                  <small
                    v-if="fieldErrors.fullName"
                    class="field-error"
                  >
                    {{ fieldErrors.fullName }}
                  </small>
                </label>

                <label class="form-field">
                  <span>
                    Email address
                  </span>

                  <input
                    v-model.trim="form.email"
                    autocomplete="email"
                    inputmode="email"
                    type="email"
                    placeholder="you@example.com"
                    :class="{
                      invalid: fieldErrors.email,
                    }"
                  />

                  <small
                    v-if="fieldErrors.email"
                    class="field-error"
                  >
                    {{ fieldErrors.email }}
                  </small>
                </label>

                <label class="form-field">
                  <span>
                    Phone number
                  </span>

                  <input
                    v-model.trim="form.phone"
                    autocomplete="tel"
                    inputmode="tel"
                    type="tel"
                    placeholder="+92 300 1234567"
                    :class="{
                      invalid: fieldErrors.phone,
                    }"
                  />

                  <small
                    v-if="fieldErrors.phone"
                    class="field-error"
                  >
                    {{ fieldErrors.phone }}
                  </small>
                </label>

                <label class="form-field full-width">
                  <span>
                    Street address
                  </span>

                  <input
                    v-model="form.address"
                    autocomplete="street-address"
                    type="text"
                    placeholder="House number and street"
                    :class="{
                      invalid: fieldErrors.address,
                    }"
                  />

                  <small
                    v-if="fieldErrors.address"
                    class="field-error"
                  >
                    {{ fieldErrors.address }}
                  </small>
                </label>

                <label class="form-field">
                  <span>
                    City
                  </span>

                  <input
                    v-model="form.city"
                    autocomplete="address-level2"
                    type="text"
                    placeholder="City"
                    :class="{
                      invalid: fieldErrors.city,
                    }"
                  />

                  <small
                    v-if="fieldErrors.city"
                    class="field-error"
                  >
                    {{ fieldErrors.city }}
                  </small>
                </label>

                <label class="form-field">
                  <span>
                    Postal code
                  </span>

                  <input
                    v-model.trim="form.postalCode"
                    autocomplete="postal-code"
                    inputmode="numeric"
                    type="text"
                    placeholder="Postal code"
                    :class="{
                      invalid: fieldErrors.postalCode,
                    }"
                  />

                  <small
                    v-if="fieldErrors.postalCode"
                    class="field-error"
                  >
                    {{ fieldErrors.postalCode }}
                  </small>
                </label>
              </div>
            </section>
          </div>

          <aside class="order-summary">
            <div class="summary-heading">
              <div>
                <p class="section-number">
                  Your cart
                </p>

                <h2 class="font-display">
                  Order summary
                </h2>
              </div>

              <span>
                {{ itemCount }}
                {{ itemCount === 1 ? "item" : "items" }}
              </span>
            </div>

            <div class="summary-items">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="summary-item"
              >
                <div class="summary-image">
                  <img
                    v-if="item.product.imageUrl"
                    :src="
                      getImageUrl(
                        item.product.imageUrl,
                      )
                    "
                    :alt="item.product.name"
                  />

                  <span v-else>
                    No image
                  </span>

                  <b>
                    {{ item.quantity }}
                  </b>
                </div>

                <div class="summary-item-info">
                  <p>
                    {{ item.product.name }}
                  </p>

                  <span>
                    Qty {{ item.quantity }}
                  </span>
                </div>

                <strong>
                  PKR
                  {{
                    formatPrice(
                      String(
                        Number(item.product.price) *
                          item.quantity,
                      ),
                    )
                  }}
                </strong>
              </div>
            </div>

            <div class="totals">
              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  PKR {{ total }}
                </strong>
              </div>

              <div>
                <span>
                  Delivery
                </span>

                <strong class="free">
                  Free
                </strong>
              </div>

              <div class="grand-total">
                <span>
                  Total
                </span>

                <strong class="font-display">
                  PKR {{ total }}
                </strong>
              </div>
            </div>

            <p
              v-if="checkoutError"
              role="alert"
              class="checkout-error"
            >
              {{ checkoutError }}
            </p>

            <button
              type="submit"
              class="place-order-button"
              :disabled="placingOrder"
            >
              <LockKeyhole :size="16" />

              {{
                placingOrder
                  ? "Placing order..."
                  : `Place order · PKR ${total}`
              }}
            </button>

            <p class="terms">
              By placing your order, you agree to
              MiniShop's terms and purchase policy.
            </p>
          </aside>
        </form>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.checkout-page {
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
  top: -270px;
  right: -220px;
  background: rgba(217, 160, 40, 0.09);
}

.page-glow-two {
  width: 480px;
  height: 480px;
  bottom: 40px;
  left: -330px;
  background: rgba(217, 160, 40, 0.05);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  color: rgba(245, 240, 225, 0.55);
  font-size: 11px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #f3d27a;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.eyebrow,
.section-number {
  color: #d9a028;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.page-header h1 {
  margin-top: 6px;
  color: #f5f0e1;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.035em;
}

.page-description {
  margin-top: 12px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 12px;
}

.steps {
  display: flex;
  align-items: center;
  color: rgba(245, 240, 225, 0.42);
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.step-complete {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f3d27a;
}

.step-line {
  width: 38px;
  height: 1px;
  margin: 0 10px;
  background: rgba(217, 160, 40, 0.3);
}

.step-current {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  margin-right: 7px;
  border: 1px solid rgba(217, 160, 40, 0.55);
  border-radius: 50%;
  color: #f3d27a;
}

.header-divider {
  height: 1px;
  margin: 30px 0 34px;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.25),
    transparent
  );
}

.page-state {
  min-height: 420px;
  display: grid;
  place-items: center;
  color: rgba(245, 240, 225, 0.45);
  font-size: 12px;
}

.empty-state {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.5);
  text-align: center;
}

.empty-state h2 {
  margin-top: 16px;
  color: #f5f0e1;
  font-size: 25px;
}

.empty-state p {
  margin-top: 5px;
  font-size: 11px;
}

.primary-link {
  margin-top: 22px;
  padding: 11px 18px;
  border-radius: 8px;
  background: #d9a028;
  color: #172e2d;
  font-size: 10px;
  font-weight: 700;
}

.checkout-layout {
  display: grid;
  grid-template-columns:
    minmax(0, 1.45fr)
    minmax(310px, 0.75fr);
  align-items: start;
  gap: 24px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-card,
.order-summary {
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 15px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.08);
}

.form-card {
  padding: 25px;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  margin-bottom: 21px;
  border-bottom: 1px solid rgba(245, 240, 225, 0.08);
}

.section-icon {
  display: grid;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(217, 160, 40, 0.25);
  border-radius: 10px;
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
}

.section-heading h2,
.summary-heading h2 {
  margin-top: 3px;
  color: #f5f0e1;
  font-size: 20px;
  font-weight: 500;
}

.secure-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  color: rgba(245, 240, 225, 0.45);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: rgba(245, 240, 225, 0.62);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.form-field input {
  width: 100%;
  height: 43px;
  padding: 0 13px;
  border: 1px solid rgba(245, 240, 225, 0.12);
  border-radius: 8px;
  outline: none;
  background: rgba(7, 25, 24, 0.22);
  color: #f5f0e1;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: normal;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-field input::placeholder {
  color: rgba(245, 240, 225, 0.38);
}

.form-field input:focus::placeholder {
  color: transparent;
}

.editable-field {
  width: 100%;
  height: 43px;
  min-height: 43px;
  max-height: 43px;
  display: block;
  overflow: hidden;
  padding: 13px;
  border: 1px solid rgba(245, 240, 225, 0.12);
  border-radius: 8px;
  outline: none;
  background: rgba(7, 25, 24, 0.22);
  color: #f5f0e1;
  font-size: 11px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: normal;
  white-space: nowrap;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.editable-field:empty::before {
  content: attr(data-placeholder);
  color: rgba(245, 240, 225, 0.38);
  pointer-events: none;
}

.editable-field:focus:empty::before {
  content: "";
}

.form-field input:focus,
.editable-field:focus {
  border-color: rgba(217, 160, 40, 0.55);
  background: rgba(7, 25, 24, 0.35);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.07);
}

.form-field input.invalid,
.editable-field.invalid {
  border-color: rgba(248, 113, 113, 0.55);
}

.field-error {
  color: #fca5a5;
  font-size: 8px;
  font-weight: 500;
  letter-spacing: normal;
}

.input-with-icon {
  position: relative;
}

.input-with-icon > svg {
  position: absolute;
  z-index: 1;
  top: 13px;
  left: 13px;
  color: rgba(245, 240, 225, 0.35);
  pointer-events: none;
}

.input-with-icon .editable-field {
  padding: 13px 13px 13px 40px;
}

.cvv-field:not(:empty) {
  -webkit-text-security: disc;
}

/* ---------- 3D rotating card ---------- */

.card-scene {
  width: min(100%, 365px);
  margin: 0 auto 24px;
  perspective: 1400px;
}

.card-flipper {
  position: relative;
  width: 100%;
  min-height: 200px;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.card-flipper.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  overflow: hidden;
  padding: 22px;
  border: 1px solid rgba(232, 163, 61, 0.3);
  border-radius: 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
}

.card-front {
  isolation: isolate;
  background: linear-gradient(135deg, #2c5350, #142f2d 65%);
  color: #f5f0e1;
}

.card-back {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #142f2d, #1f403d 70%);
  color: #f5f0e1;
  transform: rotateY(180deg);
}

.card-shine {
  position: absolute;
  z-index: -1;
  width: 210px;
  height: 210px;
  top: -120px;
  right: -70px;
  border-radius: 50%;
  background: rgba(232, 163, 61, 0.18);
  filter: blur(18px);
}

.card-preview-top,
.preview-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-preview-top {
  color: #f3d27a;
}

.card-chip {
  position: relative;
  width: 38px;
  height: 28px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f3dc9c, #a8741d);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
}

.card-chip::before,
.card-chip::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  height: 1px;
  background: rgba(90, 60, 10, 0.4);
}

.card-chip::before {
  top: 9px;
}

.card-chip::after {
  top: 18px;
}

.card-network {
  font-family: ui-serif, Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 0.03em;
  color: #fdf2d2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.preview-number {
  margin: 34px 0 24px;
  overflow: hidden;
  color: #fff9e9;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: clamp(16px, 3vw, 19px);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
}

.preview-field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preview-field.align-right {
  align-items: flex-end;
}

.preview-label {
  color: rgba(245, 240, 225, 0.45);
  font-size: 6.5px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.preview-value {
  max-width: 190px;
  overflow: hidden;
  color: rgba(245, 240, 225, 0.85);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.magnetic-stripe {
  width: calc(100% + 44px);
  height: 38px;
  margin: -22px 0 22px -22px;
  background: repeating-linear-gradient(
    180deg,
    #0c0c0c,
    #0c0c0c 2px,
    #1a1a1a 2px,
    #1a1a1a 4px
  );
}

.signature-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.signature-strip {
  flex: 1;
  height: 30px;
  border-radius: 3px;
  background: repeating-linear-gradient(
    135deg,
    rgba(245, 240, 225, 0.85),
    rgba(245, 240, 225, 0.85) 3px,
    rgba(245, 240, 225, 0.7) 3px,
    rgba(245, 240, 225, 0.7) 6px
  );
}

.cvv-box {
  display: grid;
  width: 52px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 3px;
  background: #f5f0e1;
  color: #172e2d;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.back-note {
  margin-top: 16px;
  color: rgba(245, 240, 225, 0.4);
  font-size: 7px;
  line-height: 1.5;
}

.back-network {
  position: absolute;
  right: 22px;
  bottom: 20px;
  font-size: 13px;
}

/* ---------- end card ---------- */

.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 19px;
  color: rgba(245, 240, 225, 0.38);
  font-size: 8px;
  line-height: 1.5;
  text-align: center;
}

.privacy-note svg {
  flex: 0 0 auto;
  color: #f3d27a;
}

.order-summary {
  position: sticky;
  top: 104px;
  padding: 24px;
}

.summary-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(245, 240, 225, 0.08);
}

.summary-heading > span {
  padding: 5px 8px;
  border-radius: 20px;
  background: rgba(217, 160, 40, 0.1);
  color: #f3d27a;
  font-size: 8px;
  font-weight: 600;
}

.summary-items {
  max-height: 310px;
  overflow: auto;
  padding: 17px 5px 17px 0;
  scrollbar-width: thin;
  scrollbar-color:
    rgba(217, 160, 40, 0.3)
    transparent;
}

.summary-item {
  display: grid;
  grid-template-columns:
    52px
    minmax(0, 1fr)
    auto;
  align-items: center;
  gap: 11px;
  padding: 8px 0;
}

.summary-image {
  position: relative;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(245, 240, 225, 0.05);
  color: rgba(245, 240, 225, 0.3);
  font-size: 7px;
}

.summary-image img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

.summary-image b {
  position: absolute;
  top: -5px;
  right: -5px;
  display: grid;
  width: 17px;
  height: 17px;
  place-items: center;
  border-radius: 50%;
  background: #d9a028;
  color: #172e2d;
  font-size: 8px;
}

.summary-item-info {
  min-width: 0;
}

.summary-item-info p {
  overflow: hidden;
  color: rgba(245, 240, 225, 0.82);
  font-size: 10px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-item-info span {
  color: rgba(245, 240, 225, 0.35);
  font-size: 8px;
}

.summary-item > strong {
  color: rgba(245, 240, 225, 0.7);
  font-size: 9px;
  font-weight: 600;
}

.totals {
  padding: 17px 0;
  border-top: 1px solid rgba(245, 240, 225, 0.08);
}

.totals > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 11px;
  color: rgba(245, 240, 225, 0.46);
  font-size: 9px;
}

.totals strong {
  color: rgba(245, 240, 225, 0.75);
  font-weight: 600;
}

.totals .free {
  color: #86d9a3;
}

.totals .grand-total {
  align-items: flex-end;
  margin: 17px 0 0;
  padding-top: 17px;
  border-top: 1px solid rgba(245, 240, 225, 0.08);
  color: #f5f0e1;
  font-size: 11px;
}

.grand-total strong {
  color: #f3d27a;
  font-size: 21px;
  font-weight: 500;
}

.checkout-error {
  margin-bottom: 12px;
  padding: 10px 11px;
  border: 1px solid rgba(248, 113, 113, 0.2);
  border-radius: 8px;
  background: rgba(248, 113, 113, 0.06);
  color: #fca5a5;
  font-size: 9px;
  line-height: 1.5;
}

.place-order-button {
  width: 100%;
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 9px;
  background: linear-gradient(
    135deg,
    #e3ad3f,
    #c88b1d
  );
  color: #17302e;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 12px 28px rgba(217, 160, 40, 0.14);
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    opacity 0.2s ease;
}

.place-order-button:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.place-order-button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.terms {
  margin-top: 12px;
  color: rgba(245, 240, 225, 0.3);
  font-size: 7px;
  line-height: 1.55;
  text-align: center;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .steps {
    align-self: stretch;
  }

  .form-card,
  .order-summary {
    padding: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: auto;
  }

  .payment-heading {
    flex-wrap: wrap;
  }

  .secure-label {
    margin-left: 51px;
  }

  .summary-item {
    grid-template-columns:
      48px
      minmax(0, 1fr);
  }

  .summary-item > strong {
    grid-column: 2;
  }
}
</style>
