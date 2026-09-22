<script setup lang="ts">
useHead({
  title: "MiniShop | Home",
});

import {
  Users,
  FolderTree,
  Package,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
} from "lucide-vue-next";
import {
  getAllOrdersAdmin,
  getAllUsersAdmin,
  getCategories,
  getProducts,
} from "~/composables/api";

const authStore = useAuthStore();
const router = useRouter();

if (!authStore.isLoggedIn || !authStore.isAdmin) {
  router.push("/login");
}

const usersCount = ref(0);
const categoriesCount = ref(0);
const productsCount = ref(0);
const ordersCount = ref(0);

const fetchDashboardStats = async () => {
  try {
    const [users, categories, products, orders] = await Promise.all([
      getAllUsersAdmin(),
      getCategories(),
      getProducts(),
      getAllOrdersAdmin(),
    ]);

    usersCount.value = users.length;
    categoriesCount.value = categories.length;
    productsCount.value = products.length;
    ordersCount.value = orders.length;
  } catch (error) {
    console.error("Dashboard stats error:", error);
  }
};

onMounted(() => {
  fetchDashboardStats();
});
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <AdminNavbar />

    <main class="admin-content bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <section class="relative z-10">
        <div
          class="max-w-7xl mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-[1fr_0.95fr] gap-14 lg:gap-20 items-center"
        >
          <div>
            <div class="section-label">
              <span class="section-label-line"></span>
              <span>Admin Dashboard</span>
            </div>

            <h1 class="hero-title">
              Welcome,
              <span>{{ authStore.user?.name }}</span>
            </h1>

            <p class="hero-description">
              Manage your entire MiniShop store from one central dashboard.
              Create categories, manage products, monitor customer orders and
              oversee your entire business.
            </p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon">
                  <Users :size="23" />
                </div>

                <span class="stat-number">01</span>
              </div>

              <div class="stat-content">
                <h2>{{ usersCount }}</h2>
                <p>Users</p>
              </div>

              <div class="stat-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon">
                  <FolderTree :size="23" />
                </div>

                <span class="stat-number">02</span>
              </div>

              <div class="stat-content">
                <h2>{{ categoriesCount }}</h2>
                <p>Categories</p>
              </div>

              <div class="stat-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon">
                  <Package :size="23" />
                </div>

                <span class="stat-number">03</span>
              </div>

              <div class="stat-content">
                <h2>{{ productsCount }}</h2>
                <p>Products</p>
              </div>

              <div class="stat-accent"></div>
            </div>

            <div class="stat-card">
              <div class="stat-top">
                <div class="stat-icon">
                  <ClipboardList :size="23" />
                </div>

                <span class="stat-number">04</span>
              </div>

              <div class="stat-content">
                <h2>{{ ordersCount }}</h2>
                <p>Orders</p>
              </div>

              <div class="stat-accent"></div>
            </div>
          </div>
        </div>
      </section>

      <div class="section-divider"></div>

      <section class="relative z-10 py-16 md:py-20">
        <div class="max-w-7xl mx-auto px-6">
          <div class="management-heading">
            <div>
              <div class="section-label">
                <span class="section-label-line"></span>
                <span>Administration</span>
              </div>

              <h2 class="management-title">
                Store Management
              </h2>
            </div>

            <p class="management-description">
              Access and manage the core areas of your MiniShop store.
            </p>
          </div>

          <div class="management-divider"></div>

          <div class="management-cards">
            <NuxtLink
              to="/admin/categories"
              class="management-card group"
            >
              <div class="management-card-top">
                <div class="management-icon">
                  <FolderTree :size="25" />
                </div>

                <span class="management-number">01</span>
              </div>

              <div class="management-card-content">
                <h3>Categories</h3>

                <p>
                  Create, edit and delete product categories.
                </p>
              </div>

              <div class="management-card-bottom">
                <span>Manage Categories</span>

                <div class="arrow-wrapper">
                  <ArrowRight :size="18" />
                </div>
              </div>

              <div class="management-accent"></div>
            </NuxtLink>

            <NuxtLink
              to="/admin/products"
              class="management-card group"
            >
              <div class="management-card-top">
                <div class="management-icon">
                  <Package :size="25" />
                </div>

                <span class="management-number">02</span>
              </div>

              <div class="management-card-content">
                <h3>Products</h3>

                <p>
                  Add, edit and remove products from your store.
                </p>
              </div>

              <div class="management-card-bottom">
                <span>Manage Products</span>

                <div class="arrow-wrapper">
                  <ArrowRight :size="18" />
                </div>
              </div>

              <div class="management-accent"></div>
            </NuxtLink>

            <NuxtLink
              to="/admin/orders"
              class="management-card group"
            >
              <div class="management-card-top">
                <div class="management-icon">
                  <ClipboardList :size="25" />
                </div>

                <span class="management-number">03</span>
              </div>

              <div class="management-card-content">
                <h3>Orders</h3>

                <p>
                  View customer orders and update delivery status.
                </p>
              </div>

              <div class="management-card-bottom">
                <span>Manage Orders</span>

                <div class="arrow-wrapper">
                  <ArrowRight :size="18" />
                </div>
              </div>

              <div class="management-accent"></div>
            </NuxtLink>

            <NuxtLink
              to="/admin/users"
              class="management-card group"
            >
              <div class="management-card-top">
                <div class="management-icon">
                  <Users :size="25" />
                </div>

                <span class="management-number">04</span>
              </div>

              <div class="management-card-content">
                <h3>Users</h3>

                <p>
                  View all registered users and account information.
                </p>
              </div>

              <div class="management-card-bottom">
                <span>Manage Users</span>

                <div class="arrow-wrapper">
                  <ArrowRight :size="18" />
                </div>
              </div>

              <div class="management-accent"></div>
            </NuxtLink>

            <NuxtLink
              to="/security"
              class="management-card group"
            >
              <div class="management-card-top">
                <div class="management-icon">
                  <ShieldCheck :size="25" />
                </div>

                <span class="management-number">05</span>
              </div>

              <div class="management-card-content">
                <h3>Security</h3>

                <p>
                  Manage your administrator password and account security.
                </p>
              </div>

              <div class="management-card-bottom">
                <span>Manage Security</span>

                <div class="arrow-wrapper">
                  <ArrowRight :size="18" />
                </div>
              </div>

              <div class="management-accent"></div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.admin-content {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.page-grid {
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

.page-glow {
  position: absolute;
  z-index: 1;
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
  top: 800px;
  right: -320px;
  background: rgba(217, 160, 40, 0.055);
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(245, 240, 225, 0.1);
  border-left: 1px solid rgba(245, 240, 225, 0.1);
}

.stat-card {
  position: relative;
  min-height: 180px;
  padding: 23px;
  overflow: hidden;
  border-right: 1px solid rgba(245, 240, 225, 0.1);
  border-bottom: 1px solid rgba(245, 240, 225, 0.1);
  background: rgba(245, 240, 225, 0.025);
  transition:
    background 0.35s ease,
    transform 0.35s ease;
}

.stat-card:hover {
  background: rgba(217, 160, 40, 0.055);
}

.stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.stat-icon {
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.2);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
  transition:
    transform 0.35s ease,
    background 0.35s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.08) rotate(-5deg);
  background: rgba(217, 160, 40, 0.13);
}

.stat-number {
  color: rgba(245, 240, 225, 0.2);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.stat-content {
  margin-top: 25px;
}

.stat-content h2 {
  color: #f5f0e1;
  font-size: 34px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-content p {
  margin-top: 7px;
  color: rgba(245, 240, 225, 0.45);
  font-size: 11px;
  font-weight: 500;
}

.stat-accent {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    #d9a028,
    transparent
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.stat-card:hover .stat-accent {
  transform: scaleX(1);
}

.section-divider {
  position: relative;
  z-index: 10;
  width: min(1216px, calc(100% - 48px));
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

.management-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.management-title {
  color: #f5f0e1;
  font-size: clamp(2.3rem, 4vw, 3.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.035em;
}

.management-description {
  max-width: 360px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 12px;
  line-height: 1.7;
}

.management-divider {
  width: 100%;
  height: 1px;
  margin: 31px 0 36px;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.28),
    transparent
  );
}

.management-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.management-card {
  position: relative;
  min-height: 285px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 25px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 18px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;
}

.management-card:hover {
  transform: translateY(-7px);
  border-color: rgba(217, 160, 40, 0.32);
  background: rgba(245, 240, 225, 0.055);
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.18),
    0 0 30px rgba(217, 160, 40, 0.035);
}

.management-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.management-icon {
  width: 49px;
  height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.22);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.35s ease;
}

.management-card:hover .management-icon {
  transform: rotate(-7deg) scale(1.08);
  background: rgba(217, 160, 40, 0.14);
}

.management-number {
  color: rgba(245, 240, 225, 0.2);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.management-card-content {
  margin-top: 35px;
}

.management-card-content h3 {
  color: #f5f0e1;
  font-size: 21px;
  font-weight: 650;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.management-card:hover .management-card-content h3 {
  color: #f3d27a;
}

.management-card-content p {
  max-width: 300px;
  margin-top: 9px;
  color: rgba(245, 240, 225, 0.5);
  font-size: 12px;
  line-height: 1.7;
}

.management-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: auto;
  padding-top: 25px;
}

.management-card-bottom > span {
  color: rgba(245, 240, 225, 0.34);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.management-card:hover .management-card-bottom > span {
  color: #d9a028;
}

.arrow-wrapper {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.025);
  color: rgba(245, 240, 225, 0.7);
  transition:
    color 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease,
    transform 0.35s ease;
}

.management-card:hover .arrow-wrapper {
  color: #14261a;
  border-color: #d9a028;
  background: #d9a028;
  transform: translateX(3px);
}

.management-accent {
  position: absolute;
  left: 25px;
  right: 25px;
  bottom: 0;
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

.management-card:hover .management-accent {
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

@media (max-width: 1023px) {
  .management-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .management-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 767px) {
  .hero-title {
    font-size: 3.2rem;
  }

  .stat-card {
    min-height: 165px;
    padding: 20px;
  }

  .stat-content h2 {
    font-size: 30px;
  }

  .management-cards {
    grid-template-columns: 1fr;
  }

  .management-card {
    min-height: 260px;
  }
}

@media (max-width: 640px) {
  .page-grid {
    background-size: 38px 38px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.7rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-card {
    min-height: 150px;
    padding: 17px;
  }

  .stat-icon {
    width: 39px;
    height: 39px;
  }

  .stat-content {
    margin-top: 21px;
  }

  .stat-content h2 {
    font-size: 27px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .stat-icon,
  .stat-accent,
  .management-card,
  .management-icon,
  .management-card-content h3,
  .management-card-bottom > span,
  .arrow-wrapper,
  .management-accent {
    transition: none !important;
  }

  .hero-title span {
    animation: none;
  }

  .stat-card:hover .stat-icon,
  .management-card:hover,
  .management-card:hover .management-icon,
  .management-card:hover .arrow-wrapper {
    transform: none !important;
  }
}
</style>