<script setup lang="ts">
useHead({
  title: "MiniShop | Categories",
});


import type { Category } from "~/types/category";
import { getCategories } from "~/composables/api";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const getImageUrl = useImageUrl();

const searchQuery = ref((route.query.search as string) || "");

const {
  data: categories,
  pending,
  error,
} = await useAsyncData<Category[]>("all-categories", getCategories, {
  default: () => [],
});

const pageSize = 9;
const currentPage = ref(1);

watch(searchQuery, (value) => {
  currentPage.value = 1;

  router.replace({
    query: {
      search: value || undefined,
    },
  });
});

const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value;
  }

  const term = searchQuery.value.toLowerCase();

  return categories.value.filter((category) =>
    category.name.toLowerCase().includes(term),
  );
});

const totalPages = computed(() =>
  Math.max(
    1,
    Math.ceil(filteredCategories.value.length / pageSize),
  ),
);

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize;

  return filteredCategories.value.slice(
    start,
    start + pageSize,
  );
});

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount;
  }
});
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <UsersNavbar />

    <main class="categories-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="relative z-10 mx-auto max-w-6xl px-6 py-14 md:py-16">
        <div class="page-header">
          <h1 class="font-display">
            All Categories
          </h1>

          <p>
            Browse our full range of categories.
          </p>
        </div>

        <div class="header-divider"></div>

        <div class="search-wrapper">
          <svg
            class="search-icon"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="search-input"
          />
        </div>

        <div
          v-if="pending"
          class="page-state"
        >
          Loading categories...
        </div>

        <div
          v-else-if="error"
          class="page-state"
        >
          Failed to load categories. Is the backend running?
        </div>

        <div
          v-else-if="filteredCategories.length === 0"
          class="page-state"
        >
          No categories match "{{ searchQuery }}".
        </div>

        <div
          v-else
          class="categories-grid"
        >
          <NuxtLink
            v-for="category in paginatedCategories"
            :key="category.id"
            :to="`/categories/${category.id}`"
            external
            class="category-card"
          >
            <div class="category-image">
              <img
                v-if="category.imageUrl"
                :src="getImageUrl(category.imageUrl)"
                :alt="category.name"
              />

              <span
                v-else
                class="no-image"
              >
                No image
              </span>

              <div
                v-if="category.imageUrl"
                class="image-overlay"
              ></div>

              <div class="corner corner-top"></div>
              <div class="corner corner-bottom"></div>
            </div>

            <div class="category-content">
              <h3 class="font-display">
                {{ category.name }}
              </h3>

              <p>
                {{ category.description }}
              </p>
            </div>

            <div class="card-accent"></div>
          </NuxtLink>
        </div>

        <CatalogPagination
          v-if="
            !pending &&
            !error &&
            filteredCategories.length > 0
          "
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.categories-page {
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
  bottom: 100px;
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
  margin: 31px 0;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.25),
    transparent
  );
}

.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 430px;
  margin-bottom: 38px;
}

.search-icon {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 16px;
  color: rgba(217, 160, 40, 0.72);
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 45px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 11px;
  outline: none;
  background: rgba(245, 240, 225, 0.035);
  color: #f5f0e1;
  font-size: 11px;
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.search-input::placeholder {
  color: rgba(245, 240, 225, 0.27);
}

.search-input:hover {
  border-color: rgba(245, 240, 225, 0.17);
}

.search-input:focus {
  border-color: rgba(217, 160, 40, 0.5);
  background: rgba(245, 240, 225, 0.05);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.055);
}

.page-state {
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.42);
  font-size: 12px;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.category-card {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 15px;
  background: rgba(245, 240, 225, 0.035);
  outline: none;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-6px);
  border-color: rgba(217, 160, 40, 0.26);
  background: rgba(245, 240, 225, 0.045);
  box-shadow:
    0 22px 45px rgba(0, 0, 0, 0.14),
    0 0 30px rgba(217, 160, 40, 0.025);
}

.category-card:focus-visible {
  border-color: rgba(217, 160, 40, 0.6);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.1);
}

.category-image {
  position: relative;
  height: 225px;
  flex-shrink: 0;
  overflow: hidden;
  background: rgba(245, 240, 225, 0.025);
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.category-card:hover .category-image img {
  transform: scale(1.07);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 45%,
    rgba(10, 20, 13, 0.48) 100%
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
  pointer-events: none;
  opacity: 0;
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

.category-card:hover .corner {
  opacity: 1;
}

.category-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 19px 20px 21px;
}

.category-content h3 {
  color: #f5f0e1;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.category-card:hover .category-content h3 {
  color: #f3d27a;
}

.category-content p {
  display: -webkit-box;
  margin-top: 7px;
  overflow: hidden;
  color: rgba(245, 240, 225, 0.4);
  font-size: 10px;
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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

.category-card:hover .card-accent {
  transform: scaleX(1);
}

@media (max-width: 900px) {
  .categories-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-image {
    height: 240px;
  }

  .header-divider {
    margin: 25px 0;
  }

  .search-wrapper {
    max-width: none;
    margin-bottom: 30px;
  }
}

@media (max-width: 420px) {
  .category-image {
    height: 215px;
  }

  .category-content {
    padding: 17px 18px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-input,
  .category-card,
  .category-image img,
  .category-content h3,
  .corner,
  .card-accent {
    transition: none !important;
  }

  .category-card:hover,
  .category-card:hover .category-image img {
    transform: none !important;
  }
}
</style>