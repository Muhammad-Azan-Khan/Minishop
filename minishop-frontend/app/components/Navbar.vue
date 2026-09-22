<script setup lang="ts">
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Home,
  LayoutGrid,
  Package,
  Info,
  LockKeyhole,
  ArrowRight,
  UserPlus,
} from "lucide-vue-next";
import { ref, computed } from "vue";

const mobileMenuOpen = ref(false);
const cartOpen = ref(false);

const route = useRoute();

const activeSection = computed(() => {
  const hash = route.hash;

  if (hash === "#categories") {
    return "categories";
  }

  if (hash === "#products") {
    return "products";
  }

  if (hash === "#about") {
    return "about";
  }

  return "home";
});

function toggleCart() {
  cartOpen.value = !cartOpen.value;
}

function closeCart() {
  cartOpen.value = false;
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-paper/10 bg-forest/95 backdrop-blur-xl"
  >
    <nav>
      <div
        class="max-w-7xl mx-auto h-20 px-5 md:px-8 flex items-center justify-between"
      >
        <div class="group flex items-center gap-3 shrink-0">
          <div
            class="logo-wrapper flex h-12 w-12 items-center justify-center"
          >
            <MiniShopLogo class="w-full h-full" />
          </div>

          <div class="flex flex-col">
            <span
              class="font-display text-2xl md:text-3xl leading-none tracking-[0.08em] text-paper transition-colors duration-300 group-hover:text-amber"
            >
              MINISHOP
            </span>

            <span
              class="hidden sm:block mt-1 font-body text-[9px] uppercase tracking-[0.24em] text-paper/45"
            >
              Everyday General Store
            </span>
          </div>
        </div>

        <div
          class="hidden lg:flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.04] p-1.5"
        >
          <NuxtLink
            to="/"
            class="nav-link"
            :class="{ 'nav-link-active': activeSection === 'home' }"
          >
            <Home :size="16" />
            Home
          </NuxtLink>

          <NuxtLink
            to="/#categories"
            class="nav-link"
            :class="{
              'nav-link-active':
                activeSection === 'categories',
            }"
          >
            <LayoutGrid :size="16" />
            Categories
          </NuxtLink>

          <NuxtLink
            to="/#products"
            class="nav-link"
            :class="{
              'nav-link-active':
                activeSection === 'products',
            }"
          >
            <Package :size="16" />
            Products
          </NuxtLink>

          <NuxtLink
            to="/#about"
            class="nav-link"
            :class="{
              'nav-link-active':
                activeSection === 'about',
            }"
          >
            <Info :size="16" />
            About
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <div class="relative hidden lg:block">
            <button
              type="button"
              aria-label="Shopping cart"
              class="relative flex h-10 w-10 items-center justify-center rounded-full border border-paper/10 bg-paper/[0.05] text-paper/80 transition-all duration-300 hover:border-amber/40 hover:bg-amber/10 hover:text-amber"
              :class="{
                'border-amber/40 bg-amber/10 text-amber':
                  cartOpen,
              }"
              @click="toggleCart"
            >
              <ShoppingCart :size="20" />

              <span
                class="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber px-1 text-[9px] font-bold text-forest shadow-md"
              >
                3
              </span>
            </button>

            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2 scale-[0.97]"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-2 scale-[0.97]"
            >
              <div
                v-if="cartOpen"
                class="cart-popover bg-forest"
              >
                <div class="cart-popover-glow"></div>

                <button
                  type="button"
                  aria-label="Close cart message"
                  class="cart-close"
                  @click="closeCart"
                >
                  <X :size="15" />
                </button>

                <div class="cart-icon-wrap">
                  <ShoppingCart :size="24" />
                  <span class="cart-lock">
                    <LockKeyhole :size="10" />
                  </span>
                </div>

                <p class="cart-label">
                  Your Cart
                </p>

                <h3 class="cart-title font-display">
                  Sign in to view your cart
                </h3>

                <p class="cart-description">
                  Sign in to access your saved items and continue
                  shopping from where you left off.
                </p>

                <NuxtLink
                  to="/login"
                  class="cart-login"
                  @click="closeCart"
                >
                  <User :size="15" />
                  <span>Sign In</span>
                  <ArrowRight
                    :size="14"
                    class="cart-login-arrow"
                  />
                </NuxtLink>

                <NuxtLink
                  to="/signup"
                  class="cart-signup"
                  @click="closeCart"
                >
                  <UserPlus :size="14" />
                  <span>New to MiniShop?</span>
                  <strong>Create Account</strong>
                </NuxtLink>

                <div class="cart-secure">
                  <LockKeyhole :size="11" />
                  <span>Secure account access</span>
                </div>
              </div>
            </Transition>
          </div>

          <NuxtLink
            to="/login"
            class="signin-button group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-4 md:px-5 py-2.5 font-body text-sm font-semibold text-forest"
          >
            <span
              class="signin-shine"
              aria-hidden="true"
            ></span>

            <User
              :size="17"
              class="relative z-10 transition-transform duration-300 group-hover:scale-110"
            />

            <span class="relative z-10 hidden md:inline">
              Sign In
            </span>
          </NuxtLink>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            class="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-paper/10 bg-paper/[0.05] text-paper transition-all duration-300 hover:border-amber/40 hover:bg-amber/10 hover:text-amber"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Menu
              v-if="!mobileMenuOpen"
              :size="22"
            />

            <X
              v-else
              :size="22"
            />
          </button>
        </div>
      </div>
    </nav>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden border-t border-paper/10 bg-forest/98 backdrop-blur-xl"
      >
        <div
          class="mx-5 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
        ></div>

        <div class="flex flex-col px-4 py-5 gap-1">
          <NuxtLink
            to="/"
            class="mobile-nav-link"
            :class="{
              'mobile-nav-link-active':
                activeSection === 'home',
            }"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <Home :size="18" />
            </span>

            <span>Home</span>
          </NuxtLink>

          <NuxtLink
            to="/#categories"
            class="mobile-nav-link"
            :class="{
              'mobile-nav-link-active':
                activeSection === 'categories',
            }"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <LayoutGrid :size="18" />
            </span>

            <span>Categories</span>
          </NuxtLink>

          <NuxtLink
            to="/#products"
            class="mobile-nav-link"
            :class="{
              'mobile-nav-link-active':
                activeSection === 'products',
            }"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <Package :size="18" />
            </span>

            <span>Products</span>
          </NuxtLink>

          <NuxtLink
            to="/#about"
            class="mobile-nav-link"
            :class="{
              'mobile-nav-link-active':
                activeSection === 'about',
            }"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <Info :size="18" />
            </span>

            <span>About Us</span>
          </NuxtLink>

          <button
            type="button"
            class="mobile-nav-link w-full text-left"
            @click="
              cartOpen = true;
              mobileMenuOpen = false;
            "
          >
            <span class="mobile-icon relative">
              <ShoppingCart :size="18" />

              <span
                class="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 text-[8px] font-bold text-forest"
              >
                3
              </span>
            </span>

            <span>Cart</span>
          </button>

          <NuxtLink
            to="/login"
            class="mobile-signin group relative mt-4 flex items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 font-body font-semibold text-forest"
            @click="mobileMenuOpen = false"
          >
            <span
              class="signin-shine"
              aria-hidden="true"
            ></span>

            <User
              :size="18"
              class="relative z-10"
            />

            <span class="relative z-10">
              Sign In
            </span>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-[0.97]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-[0.97]"
    >
      <div
        v-if="cartOpen"
        class="lg:hidden fixed inset-x-4 top-24 z-[60]"
      >
        <div class="cart-popover mobile-cart-popover bg-forest">
          <div class="cart-popover-glow"></div>

          <button
            type="button"
            aria-label="Close cart message"
            class="cart-close"
            @click="closeCart"
          >
            <X :size="15" />
          </button>

          <div class="cart-icon-wrap">
            <ShoppingCart :size="24" />
            <span class="cart-lock">
              <LockKeyhole :size="10" />
            </span>
          </div>

          <p class="cart-label">
            Your Cart
          </p>

          <h3 class="cart-title font-display">
            Sign in to view your cart
          </h3>

          <p class="cart-description">
            Sign in to access your saved items and continue shopping
            from where you left off.
          </p>

          <NuxtLink
            to="/login"
            class="cart-login"
            @click="closeCart"
          >
            <User :size="15" />
            <span>Sign In</span>
            <ArrowRight
              :size="14"
              class="cart-login-arrow"
            />
          </NuxtLink>

          <NuxtLink
            to="/signup"
            class="cart-signup"
            @click="closeCart"
          >
            <UserPlus :size="14" />
            <span>New to MiniShop?</span>
            <strong>Create Account</strong>
          </NuxtLink>

          <div class="cart-secure">
            <LockKeyhole :size="11" />
            <span>Secure account access</span>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.logo-wrapper {
  position: relative;
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.35s ease;
}

.logo-wrapper::before {
  content: "";
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(217, 160, 40, 0.2),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.group:hover .logo-wrapper {
  transform: scale(1.06) rotate(-2deg);
  filter: drop-shadow(
    0 0 8px rgba(217, 160, 40, 0.2)
  );
}

.group:hover .logo-wrapper::before {
  opacity: 1;
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 15px;
  border-radius: 999px;
  color: rgba(245, 240, 225, 0.68);
  font-size: 14px;
  font-weight: 600;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.nav-link:hover {
  color: #f3d27a;
  background: rgba(217, 160, 40, 0.09);
  transform: translateY(-1px);
}

.nav-link.nav-link-active {
  color: #f3d27a;
  background: rgba(217, 160, 40, 0.12);
}

.nav-link.nav-link-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 3px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d9a028;
  transform: translateX(-50%);
  box-shadow: 0 0 7px rgba(217, 160, 40, 0.8);
}

.signin-button,
.mobile-signin {
  background: linear-gradient(
    100deg,
    #d9a028 0%,
    #f3d27a 50%,
    #d9a028 100%
  );
  background-size: 200% auto;
  box-shadow: 0 6px 18px rgba(217, 160, 40, 0.18);
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease,
    background-position 0.4s ease;
}

.signin-button:hover,
.mobile-signin:hover {
  transform: translateY(-1px);
  background-position: 100% center;
  box-shadow: 0 9px 25px rgba(217, 160, 40, 0.32);
}

.signin-shine {
  position: absolute;
  top: 0;
  left: -60%;
  width: 35%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.45),
    transparent
  );
  transform: skewX(-20deg);
  transition: left 0.6s ease;
  pointer-events: none;
}

.signin-button:hover .signin-shine,
.mobile-signin:hover .signin-shine {
  left: 130%;
}

.cart-popover {
  position: absolute;
  top: calc(100% + 16px);
  right: 0;
  width: 320px;
  overflow: hidden;
  padding: 25px;
  border: 1px solid rgba(245, 240, 225, 0.11);
  border-radius: 20px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(217, 160, 40, 0.03);
}

.cart-popover::before {
  content: "";
  position: absolute;
  top: -6px;
  right: 15px;
  width: 12px;
  height: 12px;
  background: inherit;
  border-top: 1px solid rgba(245, 240, 225, 0.11);
  border-left: 1px solid rgba(245, 240, 225, 0.11);
  transform: rotate(45deg);
}

.cart-popover-glow {
  position: absolute;
  top: -80px;
  left: -60px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.09);
  filter: blur(60px);
  pointer-events: none;
}

.cart-close {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.09);
  border-radius: 50%;
  color: rgba(245, 240, 225, 0.45);
  background: rgba(245, 240, 225, 0.04);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.cart-close:hover {
  color: #f3d27a;
  border-color: rgba(217, 160, 40, 0.25);
  background: rgba(217, 160, 40, 0.08);
  transform: rotate(5deg);
}

.cart-icon-wrap {
  position: relative;
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  margin-bottom: 19px;
  border: 1px solid rgba(217, 160, 40, 0.18);
  border-radius: 14px;
  color: #d9a028;
  background: rgba(217, 160, 40, 0.08);
  box-shadow: 0 8px 25px rgba(217, 160, 40, 0.06);
}

.cart-lock {
  position: absolute;
  right: -5px;
  bottom: -5px;
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(10, 30, 28, 0.95);
  border-radius: 50%;
  color: #17302e;
  background: #d9a028;
}

.cart-label {
  margin-bottom: 7px;
  color: #d9a028;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}

.cart-title {
  padding-right: 20px;
  color: #f5f0e1;
  font-size: 23px;
  font-weight: 500;
  line-height: 1.15;
}

.cart-description {
  margin-top: 10px;
  color: rgba(245, 240, 225, 0.5);
  font-size: 12px;
  line-height: 1.7;
}

.cart-login {
  position: relative;
  display: flex;
  height: 43px;
  align-items: center;
  gap: 9px;
  margin-top: 20px;
  padding: 0 15px;
  overflow: hidden;
  border-radius: 999px;
  color: #17302e;
  background: linear-gradient(
    100deg,
    #d9a028,
    #f3d27a,
    #d9a028
  );
  background-size: 200% auto;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 7px 20px rgba(217, 160, 40, 0.15);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-position 0.35s ease;
}

.cart-login:hover {
  transform: translateY(-1px);
  background-position: 100% center;
  box-shadow: 0 10px 26px rgba(217, 160, 40, 0.25);
}

.cart-login-arrow {
  margin-left: auto;
  transition: transform 0.25s ease;
}

.cart-login:hover .cart-login-arrow {
  transform: translateX(3px);
}

.cart-signup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 14px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 10px;
  transition: color 0.2s ease;
}

.cart-signup strong {
  color: rgba(243, 210, 122, 0.9);
  font-weight: 600;
}

.cart-signup:hover {
  color: #f5f0e1;
}

.cart-secure {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 19px;
  padding-top: 15px;
  border-top: 1px solid rgba(245, 240, 225, 0.07);
  color: rgba(245, 240, 225, 0.3);
  font-size: 9px;
  letter-spacing: 0.04em;
}

.mobile-cart-popover {
  position: relative;
  top: auto;
  right: auto;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
}

.mobile-cart-popover::before {
  display: none;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 11px 12px;
  border-radius: 12px;
  color: rgba(245, 240, 225, 0.75);
  font-size: 15px;
  font-weight: 500;
  transition:
    color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

.mobile-nav-link:hover {
  color: #f3d27a;
  background: rgba(217, 160, 40, 0.08);
  transform: translateX(3px);
}

.mobile-nav-link-active {
  color: #f3d27a;
  background: rgba(217, 160, 40, 0.1);
}

.mobile-icon {
  display: flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 9px;
  color: rgba(245, 240, 225, 0.68);
  background: rgba(245, 240, 225, 0.05);
  transition:
    color 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.mobile-nav-link:hover .mobile-icon,
.mobile-nav-link-active .mobile-icon {
  color: #d9a028;
  background: rgba(217, 160, 40, 0.1);
  border-color: rgba(217, 160, 40, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .logo-wrapper,
  .nav-link,
  .signin-button,
  .mobile-signin,
  .mobile-nav-link,
  .mobile-icon,
  .signin-shine,
  .cart-login,
  .cart-login-arrow,
  .cart-close {
    transition: none !important;
  }

  .group:hover .logo-wrapper,
  .nav-link:hover,
  .signin-button:hover,
  .mobile-signin:hover,
  .mobile-nav-link:hover,
  .cart-login:hover,
  .cart-close:hover {
    transform: none !important;
  }
}
</style>