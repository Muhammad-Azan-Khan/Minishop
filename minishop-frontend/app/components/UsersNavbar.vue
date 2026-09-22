<script setup lang="ts">
import {
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  LayoutGrid,
  Package,
  ClipboardList,
} from "lucide-vue-next";
import { logoutUser } from "~/composables/api";

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const mobileMenuOpen = ref(false);
const profileOpen = ref(false);

const displayedCartCount = computed(() =>
  cartStore.itemCount > 99 ? "99+" : String(cartStore.itemCount),
);

onMounted(() => {
  cartStore.refreshCartCount();
});

async function handleLogout() {
  await logoutUser();
  authStore.clearUser();
  cartStore.clearCart();
  router.push("/login");
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
            to="/account"
            class="nav-link"
          >
            <Home :size="16" />
            Home
          </NuxtLink>

          <NuxtLink
            to="/categories/page"
            class="nav-link"
          >
            <LayoutGrid :size="16" />
            Categories
          </NuxtLink>

          <NuxtLink
            to="/products"
            class="nav-link"
          >
            <Package :size="16" />
            Products
          </NuxtLink>

          <NuxtLink
            to="/orders"
            class="nav-link"
          >
            <ClipboardList :size="16" />
            Orders
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2 md:gap-3">
          <NuxtLink
            to="/cart"
            aria-label="Shopping cart"
            class="relative hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-paper/10 bg-paper/[0.05] text-paper/80 transition-all duration-300 hover:border-amber/40 hover:bg-amber/10 hover:text-amber"
          >
            <ShoppingCart :size="20" />

            <Transition name="cart-count">
              <span
                v-if="cartStore.itemCount > 0"
                :key="cartStore.itemCount"
                class="cart-count-badge"
              >
                {{ displayedCartCount }}
              </span>
            </Transition>
          </NuxtLink>

          <div class="relative hidden md:block">
            <button
              type="button"
              class="profile-button"
              @click="profileOpen = !profileOpen"
            >
              <div class="profile-avatar">
                {{
                  authStore.user?.email
                    ?.charAt(0)
                    .toUpperCase()
                }}
              </div>

              <span class="profile-name">
                {{ authStore.user?.name }}
              </span>

              <ChevronDown
                :size="16"
                class="profile-chevron"
                :class="{ 'rotate-180': profileOpen }"
              />
            </button>

            <Transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="profileOpen"
                class="profile-dropdown"
              >
                <NuxtLink
                  to="/profile"
                  class="dropdown-item"
                  @click="profileOpen = false"
                >
                  <p class="dropdown-title">
                    Personal Details
                  </p>

                  <p class="dropdown-description">
                    View your account information
                  </p>
                </NuxtLink>

                <div class="dropdown-divider"></div>

                <NuxtLink
                  to="/security"
                  class="dropdown-item"
                  @click="profileOpen = false"
                >
                  <p class="dropdown-title">
                    Privacy & Security
                  </p>

                  <p class="dropdown-description">
                    Password, security and privacy settings
                  </p>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <button
            type="button"
            class="logout-button group"
            @click="handleLogout"
          >
            <span
              class="logout-shine"
              aria-hidden="true"
            ></span>

            <LogOut
              :size="17"
              class="relative z-10 transition-transform duration-300 group-hover:scale-110"
            />

            <span class="relative z-10">
              Logout
            </span>
          </button>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            class="mobile-menu-button"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Menu
              v-if="!mobileMenuOpen"
              :size="22"
              class="mobile-menu-icon"
            />

            <X
              v-else
              :size="22"
              class="mobile-menu-icon"
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

        <div class="px-4 pt-5">
          <button
            type="button"
            class="mobile-profile-button"
            @click="profileOpen = !profileOpen"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div class="mobile-profile-avatar">
                {{
                  authStore.user?.email
                    ?.charAt(0)
                    .toUpperCase()
                }}
              </div>

              <div class="min-w-0 text-left">
                <p class="mobile-profile-name">
                  {{ authStore.user?.name }}
                </p>

                <p class="mobile-profile-label">
                  My Account
                </p>
              </div>
            </div>

            <ChevronDown
              :size="18"
              class="mobile-profile-chevron"
              :class="{ 'rotate-180': profileOpen }"
            />
          </button>

          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="profileOpen"
              class="mobile-profile-dropdown"
            >
              <NuxtLink
                to="/profile"
                class="mobile-dropdown-item"
                @click="
                  profileOpen = false;
                  mobileMenuOpen = false;
                "
              >
                <p class="mobile-dropdown-title">
                  Personal Details
                </p>

                <p class="mobile-dropdown-description">
                  View your account information
                </p>
              </NuxtLink>

              <div class="mobile-dropdown-divider"></div>

              <NuxtLink
                to="/security"
                class="mobile-dropdown-item"
                @click="
                  profileOpen = false;
                  mobileMenuOpen = false;
                "
              >
                <p class="mobile-dropdown-title">
                  Privacy & Security
                </p>

                <p class="mobile-dropdown-description">
                  Password and security settings
                </p>
              </NuxtLink>
            </div>
          </Transition>
        </div>

        <div class="flex flex-col px-4 py-5 gap-1">
          <NuxtLink
            to="/account"
            class="mobile-nav-link"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <Home :size="18" />
            </span>

            <span>Home</span>
          </NuxtLink>

          <NuxtLink
            to="/categories/page"
            class="mobile-nav-link"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <LayoutGrid :size="18" />
            </span>

            <span>Categories</span>
          </NuxtLink>

          <NuxtLink
            to="/products"
            class="mobile-nav-link"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <Package :size="18" />
            </span>

            <span>Products</span>
          </NuxtLink>

          <NuxtLink
            to="/orders"
            class="mobile-nav-link"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <ClipboardList :size="18" />
            </span>

            <span>Orders</span>
          </NuxtLink>

          <NuxtLink
            to="/cart"
            class="mobile-nav-link"
            @click="mobileMenuOpen = false"
          >
            <span class="mobile-icon">
              <ShoppingCart :size="18" />
            </span>

            <span>Cart</span>

            <span
              v-if="cartStore.itemCount > 0"
              class="mobile-cart-count"
            >
              {{ displayedCartCount }}
            </span>
          </NuxtLink>

          <button
            type="button"
            class="mobile-logout group"
            @click="handleLogout"
          >
            <span
              class="logout-shine"
              aria-hidden="true"
            ></span>

            <LogOut
              :size="18"
              class="relative z-10"
            />

            <span class="relative z-10">
              Logout
            </span>
          </button>
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
  filter:
    drop-shadow(
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

.nav-link.router-link-exact-active {
  color: #f3d27a;
  background: rgba(217, 160, 40, 0.12);
}

.nav-link.router-link-exact-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: 3px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d9a028;
  transform: translateX(-50%);
  box-shadow:
    0 0 7px rgba(217, 160, 40, 0.8);
}

.profile-button {
  display: flex;
  height: 40px;
  align-items: center;
  gap: 8px;
  padding: 4px 11px 4px 5px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 999px;
  background: rgba(245, 240, 225, 0.05);
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;
}

.profile-button:hover {
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(217, 160, 40, 0.1);
  transform: translateY(-1px);
}

.profile-avatar {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(
    100deg,
    #d9a028,
    #f3d27a
  );
  color: #14261a;
  font-size: 11px;
  font-weight: 800;
}

.profile-name {
  max-width: 110px;
  overflow: hidden;
  color: rgba(245, 240, 225, 0.8);
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-chevron {
  flex-shrink: 0;
  color: rgba(245, 240, 225, 0.5);
  transition:
    transform 0.25s ease,
    color 0.25s ease;
}

.profile-button:hover .profile-chevron {
  color: #f3d27a;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 260px;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 14px;
  background: #14261a;
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.28);
  transform-origin: top right;
}

.dropdown-item {
  display: block;
  padding: 17px 18px;
  transition: background 0.25s ease;
}

.dropdown-item:hover {
  background: rgba(217, 160, 40, 0.08);
}

.dropdown-title {
  color: #f5f0e1;
  font-size: 13px;
  font-weight: 700;
  transition: color 0.25s ease;
}

.dropdown-item:hover .dropdown-title {
  color: #f3d27a;
}

.dropdown-description {
  margin-top: 4px;
  color: rgba(245, 240, 225, 0.42);
  font-size: 11px;
  line-height: 1.55;
}

.dropdown-divider {
  height: 1px;
  background: rgba(245, 240, 225, 0.08);
}

.logout-button,
.mobile-logout {
  position: relative;
  align-items: center;
  justify-content: center;
  gap: 8px;
  overflow: hidden;
  color: #14261a;
  font-weight: 600;
  background: linear-gradient(
    100deg,
    #d9a028 0%,
    #f3d27a 50%,
    #d9a028 100%
  );
  background-size: 200% auto;
  box-shadow:
    0 6px 18px rgba(217, 160, 40, 0.18);
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s ease,
    background-position 0.4s ease;
}

.logout-button {
  display: none;
  height: 40px;
  padding: 0 17px;
  border-radius: 999px;
  font-size: 13px;
}

.logout-button:hover,
.mobile-logout:hover {
  transform: translateY(-1px);
  background-position: 100% center;
  box-shadow:
    0 9px 25px rgba(217, 160, 40, 0.32);
}

.logout-shine {
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

.logout-button:hover .logout-shine,
.mobile-logout:hover .logout-shine {
  left: 130%;
}

.mobile-menu-button {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 0;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.05);
  color: #f5f0e1;
  appearance: none;
  -webkit-appearance: none;
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.mobile-menu-button:hover {
  color: #d9a028;
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(217, 160, 40, 0.1);
}

.mobile-menu-icon {
  display: block;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin: 0;
}

.mobile-profile-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 12px;
  background: rgba(245, 240, 225, 0.04);
  transition:
    border-color 0.25s ease,
    background 0.25s ease;
}

.mobile-profile-button:hover {
  border-color: rgba(217, 160, 40, 0.3);
  background: rgba(217, 160, 40, 0.07);
}

.mobile-profile-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(
    100deg,
    #d9a028,
    #f3d27a
  );
  color: #14261a;
  font-size: 13px;
  font-weight: 800;
}

.mobile-profile-name {
  max-width: 210px;
  overflow: hidden;
  color: #f5f0e1;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-profile-label {
  margin-top: 2px;
  color: rgba(245, 240, 225, 0.42);
  font-size: 10px;
}

.mobile-profile-chevron {
  flex-shrink: 0;
  color: rgba(245, 240, 225, 0.55);
  transition: transform 0.25s ease;
}

.mobile-profile-dropdown {
  margin-top: 9px;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.09);
  border-radius: 12px;
  background: rgba(245, 240, 225, 0.035);
}

.mobile-dropdown-item {
  display: block;
  padding: 14px 15px;
  transition: background 0.25s ease;
}

.mobile-dropdown-item:hover {
  background: rgba(217, 160, 40, 0.07);
}

.mobile-dropdown-title {
  color: #f5f0e1;
  font-size: 13px;
  font-weight: 600;
}

.mobile-dropdown-description {
  margin-top: 3px;
  color: rgba(245, 240, 225, 0.4);
  font-size: 11px;
}

.mobile-dropdown-divider {
  height: 1px;
  background: rgba(245, 240, 225, 0.08);
}

.cart-count-badge {
  position: absolute;
  top: -6px;
  right: -7px;
  min-width: 19px;
  height: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid #1f3d3b;
  border-radius: 999px;
  background: #e8a33d;
  color: #17302e;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  box-shadow: 0 4px 12px rgba(232, 163, 61, 0.35);
}

.cart-count-enter-active,
.cart-count-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-count-enter-from,
.cart-count-leave-to {
  opacity: 0;
  transform: scale(0.45);
}

.mobile-cart-count {
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0 6px;
  border-radius: 999px;
  background: #e8a33d;
  color: #17302e;
  font-size: 9px;
  font-weight: 700;
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
  color: #f5f0e1;
  background: rgba(245, 240, 225, 0.06);
  transform: translateX(3px);
}

.mobile-nav-link.router-link-exact-active {
  color: #f3d27a;
  background: rgba(217, 160, 40, 0.08);
}

.mobile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 9px;
  color: #d9a028;
  background: rgba(217, 160, 40, 0.1);
  border: 1px solid rgba(217, 160, 40, 0.12);
}

.mobile-logout {
  width: 100%;
  min-height: 47px;
  display: flex;
  margin-top: 16px;
  border-radius: 999px;
  font-size: 14px;
}

@media (min-width: 1024px) {
  .logout-button {
    display: flex;
  }

  .mobile-menu-button {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-wrapper,
  .nav-link,
  .profile-button,
  .profile-chevron,
  .dropdown-item,
  .logout-button,
  .mobile-logout,
  .logout-shine,
  .mobile-menu-button,
  .mobile-profile-button,
  .mobile-profile-chevron,
  .mobile-dropdown-item,
  .mobile-nav-link {
    transition: none !important;
  }

  .group:hover .logo-wrapper,
  .nav-link:hover,
  .profile-button:hover,
  .logout-button:hover,
  .mobile-logout:hover,
  .mobile-nav-link:hover {
    transform: none !important;
  }
}
</style>
