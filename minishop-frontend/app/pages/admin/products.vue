<script setup lang="ts">
useHead({
  title: "MiniShop | Products",
});

import {
  ArrowLeft,
  Trash2,
  Plus,
  Image as ImageIcon,
  Search,
} from "lucide-vue-next";
import type { Product } from "~/types/product";
import type { Category } from "~/types/category";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
} from "~/composables/api";

const authStore = useAuthStore();
const router = useRouter();
const getImageUrl = useImageUrl();

if (!authStore.isLoggedIn || !authStore.isAdmin) {
  router.push("/login");
}

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);

const pageSize = 9;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(products.value.length / pageSize)),
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return products.value.slice(start, start + pageSize);
});

const loading = ref(true);
const creating = ref(false);
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showSuccess = ref(false);
const successMessage = ref("");
const productToDelete = ref<Product | null>(null);
const search = ref("");
const deleting = ref(false);

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const form = reactive({
  name: "",
  description: "",
  price: null as number | null,
  stock: null as number | null,
  categoryId: 0,
  image: null as File | null,
});

const imagePreview = ref("");

const fetchCategoriesHandler = async () => {
  categories.value = await getCategories();
};

const fetchProductsHandler = async () => {
  loading.value = true;

  try {
    products.value = await getProducts(search.value.trim());
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

watch(search, (value) => {
  currentPage.value = 1;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    const term = value.trim();

    if (term === "" || term.length >= 2) {
      fetchProductsHandler();
    }
  }, 800);
});

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount;
  }
});

const onImageSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  form.image = file;
  imagePreview.value = URL.createObjectURL(file);
};

const createProductHandler = async () => {
  creating.value = true;

  try {
    const body = new FormData();

    body.append("name", form.name);
    body.append("description", form.description);
    body.append("price", String(form.price));
    body.append("stock", String(form.stock));
    body.append("categoryId", String(form.categoryId));

    if (form.image) {
      body.append("image", form.image);
    }

    const product = await createProduct(body);

    products.value.unshift(product);

    showCreateModal.value = false;

    successMessage.value = "Product created successfully.";
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);

    form.name = "";
    form.description = "";
    form.price = 0;
    form.stock = 0;
    form.categoryId = 0;
    form.image = null;
    imagePreview.value = "";
  } catch (error) {
    console.error(error);
  } finally {
    creating.value = false;
  }
};

const openDeleteModal = (product: Product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const deleteProductHandler = async () => {
  if (!productToDelete.value) return;

  deleting.value = true;

  try {
    await deleteProduct(productToDelete.value.id);

    products.value = products.value.filter(
      (p) => p.id !== productToDelete.value!.id,
    );

    closeDeleteModal();

    successMessage.value = "Product deleted successfully.";
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error(error);
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchCategoriesHandler(),
    fetchProductsHandler(),
  ]);
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

    <main class="products-page bg-forest">
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
          <div>
            <div class="page-label">
              <span class="page-label-line"></span>
              <span>Store Management</span>
            </div>

            <h1>
              Products
            </h1>

            <p>
              Manage your store products.
            </p>
          </div>

          <button
            class="create-button group"
            @click="showCreateModal = true"
          >
            <Plus
              :size="18"
              class="transition-transform duration-300 group-hover:rotate-90"
            />

            <span>Create Product</span>
          </button>
        </div>

        <div class="header-divider"></div>

        <div class="search-wrapper">
          <Search
            :size="18"
            class="search-icon"
          />

          <input
            v-model="search"
            type="text"
            placeholder="Search products..."
          />
        </div>

        <div
          v-if="loading"
          class="loading-state"
        >
          <div class="loading-spinner"></div>
          <p>Loading products...</p>
        </div>

        <div
          v-else-if="products.length === 0"
          class="empty-state"
        >
          No products found.
        </div>

        <div
          v-else
          class="products-grid"
        >
          <div
            v-for="(product, index) in paginatedProducts"
            :key="product.id"
            class="product-card group"
          >
            <div class="product-image">
              <img
                v-if="product.imageUrl"
                :src="getImageUrl(product.imageUrl)"
                :alt="product.name"
              />

              <div
                v-else
                class="no-image"
              >
                <ImageIcon :size="28" />
                <span>No image</span>
              </div>

              <div class="image-overlay"></div>

              <span class="product-index">
                {{
                  String(
                    (currentPage - 1) * pageSize + index + 1,
                  ).padStart(2, "0")
                }}
              </span>
            </div>

            <div class="product-content">
              <div class="product-tags">
                <span class="product-id">
                  #{{ product.id }}
                </span>

                <span class="category-tag">
                  {{ product.category.name }}
                </span>
              </div>

              <h3>
                {{ product.name }}
              </h3>

              <p class="product-description">
                {{ product.description }}
              </p>

              <div class="product-details">
                <div class="detail-row">
                  <span>Price</span>

                  <strong>
                    Rs. {{ product.price }}
                  </strong>
                </div>

                <div class="detail-row">
                  <span>Stock</span>

                  <strong>
                    {{ product.stock }}
                  </strong>
                </div>

                <div class="detail-row">
                  <span>Created</span>

                  <strong>
                    {{
                      new Date(
                        product.createdAt,
                      ).toLocaleDateString()
                    }}
                  </strong>
                </div>
              </div>

              <div class="card-divider"></div>

              <button
                class="delete-button"
                @click="openDeleteModal(product)"
              >
                <Trash2 :size="16" />
                <span>Delete Product</span>
              </button>
            </div>

            <div class="card-accent"></div>
          </div>
        </div>

        <CatalogPagination
          v-if="!loading && products.length > 0"
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </main>

    <Transition name="fade">
      <div
        v-if="showCreateModal"
        class="modal-overlay modal-scroll"
      >
        <div class="create-modal">
          <div class="modal-label">
            <span class="modal-label-line"></span>
            <span>New Product</span>
          </div>

          <h2>
            Create Product
          </h2>

          <div class="modal-divider"></div>

          <div class="form-content">
            <div class="field-group">
              <label>Product Name</label>

              <input
                v-model="form.name"
                placeholder="Product Name"
              />
            </div>

            <div class="field-group">
              <label>Product Description</label>

              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Product Description"
              ></textarea>
            </div>

            <div class="two-fields">
              <div class="field-group">
                <label>Price</label>

                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  placeholder="Price"
                />
              </div>

              <div class="field-group">
                <label>Stock</label>

                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  placeholder="Stock"
                />
              </div>
            </div>

            <div class="field-group">
              <label>Category</label>

              <select v-model.number="form.categoryId">
                <option :value="0">
                  Select Category
                </option>

                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <label class="image-upload">
              <div class="upload-icon">
                <ImageIcon :size="22" />
              </div>

              <span>Select Product Image</span>

              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="onImageSelected"
              />
            </label>

            <div
              v-if="imagePreview"
              class="image-preview"
            >
              <img
                :src="imagePreview"
                alt="Product preview"
              />
            </div>

            <div class="modal-actions">
              <button
                class="cancel-button"
                @click="showCreateModal = false"
              >
                Cancel
              </button>

              <button
                class="confirm-create-button"
                :disabled="creating"
                @click="createProductHandler"
              >
                <Plus
                  v-if="!creating"
                  :size="17"
                />

                <span>
                  {{ creating ? "Creating..." : "Create Product" }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="showDeleteModal"
        class="modal-overlay"
      >
        <div class="delete-modal">
          <div class="delete-modal-icon">
            <Trash2 :size="27" />
          </div>

          <h2>
            Delete Product?
          </h2>

          <p class="delete-description">
            Are you sure you want to delete
            <span>{{ productToDelete?.name }}</span>?
          </p>

          <p class="delete-warning">
            This action cannot be undone.
          </p>

          <div class="delete-divider"></div>

          <div class="delete-actions">
            <button
              class="cancel-button"
              :disabled="deleting"
              @click="closeDeleteModal"
            >
              Cancel
            </button>

            <button
              class="confirm-delete-button"
              :disabled="deleting"
              @click="deleteProductHandler"
            >
              <Trash2
                v-if="!deleting"
                :size="16"
              />

              <span>
                {{ deleting ? "Deleting..." : "Delete" }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Footer />
  </div>
</template>

<style scoped>
.products-page {
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
  bottom: 50px;
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
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

.create-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 45px;
  padding: 0 19px;
  border: 1px solid rgba(217, 160, 40, 0.3);
  border-radius: 999px;
  background: #d9a028;
  color: #14261a;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(217, 160, 40, 0.13);
  transition:
    transform 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.create-button:hover {
  transform: translateY(-2px);
  background: #f3d27a;
  box-shadow: 0 12px 30px rgba(217, 160, 40, 0.2);
}

.header-divider {
  width: 100%;
  height: 1px;
  margin: 31px 0 28px;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.25),
    transparent
  );
}

.search-wrapper {
  position: relative;
  margin-bottom: 36px;
}

.search-wrapper input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 46px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 12px;
  outline: none;
  background: rgba(245, 240, 225, 0.035);
  color: #f5f0e1;
  font-size: 11px;
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.search-wrapper input::placeholder {
  color: rgba(245, 240, 225, 0.28);
}

.search-wrapper input:focus {
  border-color: rgba(217, 160, 40, 0.45);
  background: rgba(245, 240, 225, 0.05);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.05);
}

.search-icon {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 17px;
  color: rgba(245, 240, 225, 0.34);
  transform: translateY(-50%);
  pointer-events: none;
}

.loading-state,
.empty-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 240, 225, 0.4);
  font-size: 12px;
}

.loading-state {
  flex-direction: column;
  gap: 15px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 2px solid rgba(245, 240, 225, 0.1);
  border-top-color: #d9a028;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 18px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.09);
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;
}

.product-card:hover {
  transform: translateY(-7px);
  border-color: rgba(217, 160, 40, 0.3);
  background: rgba(245, 240, 225, 0.05);
  box-shadow:
    0 22px 45px rgba(0, 0, 0, 0.15),
    0 0 30px rgba(217, 160, 40, 0.025);
}

.product-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: rgba(245, 240, 225, 0.035);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.06);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 45%,
    rgba(20, 38, 26, 0.8)
  );
  pointer-events: none;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(245, 240, 225, 0.3);
  font-size: 10px;
}

.product-index {
  position: absolute;
  z-index: 2;
  top: 15px;
  right: 15px;
  min-width: 32px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid rgba(245, 240, 225, 0.13);
  border-radius: 999px;
  background: rgba(20, 38, 26, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #f3d27a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 21px;
}

.product-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 13px;
}

.product-id,
.category-tag {
  min-height: 25px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.product-id {
  border: 1px solid rgba(245, 240, 225, 0.1);
  background: rgba(245, 240, 225, 0.035);
  color: rgba(245, 240, 225, 0.45);
}

.category-tag {
  max-width: 160px;
  overflow: hidden;
  border: 1px solid rgba(217, 160, 40, 0.16);
  background: rgba(217, 160, 40, 0.07);
  color: #f3d27a;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-content h3 {
  overflow: hidden;
  color: #f5f0e1;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.product-card:hover .product-content h3 {
  color: #f3d27a;
}

.product-description {
  min-height: 63px;
  margin-top: 10px;
  overflow: hidden;
  display: -webkit-box;
  color: rgba(245, 240, 225, 0.45);
  font-size: 11px;
  line-height: 1.8;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 18px;
}

.detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  color: rgba(245, 240, 225, 0.32);
  font-size: 9px;
}

.detail-row strong {
  color: rgba(245, 240, 225, 0.7);
  font-size: 10px;
  font-weight: 600;
}

.detail-row:first-child strong {
  color: #f3d27a;
}

.card-divider {
  height: 1px;
  margin: 18px 0 14px;
  background: rgba(245, 240, 225, 0.07);
}

.delete-button {
  width: 100%;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  border: 1px solid rgba(239, 68, 68, 0.16);
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.055);
  color: rgba(252, 165, 165, 0.85);
  font-size: 10px;
  font-weight: 600;
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.delete-button:hover {
  color: #fee2e2;
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.13);
}

.card-accent {
  position: absolute;
  left: 22px;
  right: 22px;
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

.modal-overlay {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(7, 15, 10, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal-scroll {
  overflow-y: auto;
}

.create-modal,
.delete-modal {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.11);
  border-radius: 20px;
  background: #14261a;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(217, 160, 40, 0.035);
}

.create-modal {
  max-width: 620px;
  margin: 30px 0;
  padding: 29px;
}

.modal-label {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #d9a028;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.modal-label-line {
  width: 22px;
  height: 1px;
  background: #d9a028;
}

.create-modal h2 {
  margin-top: 10px;
  color: #f5f0e1;
  font-size: 29px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.modal-divider {
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(
    90deg,
    rgba(217, 160, 40, 0.25),
    rgba(245, 240, 225, 0.06),
    transparent
  );
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.two-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field-group label {
  display: block;
  margin-bottom: 6px;
  color: rgba(245, 240, 225, 0.7);
  font-size: 10px;
  font-weight: 600;
}

.field-group input,
.field-group textarea,
.field-group select {
  width: 100%;
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

.field-group input,
.field-group select {
  height: 44px;
  padding: 0 14px;
}

.field-group textarea {
  min-height: 100px;
  padding: 12px 14px;
  resize: vertical;
}

.field-group input::placeholder,
.field-group textarea::placeholder {
  color: rgba(245, 240, 225, 0.25);
}

.field-group input:focus,
.field-group textarea:focus,
.field-group select:focus {
  border-color: rgba(217, 160, 40, 0.5);
  background: rgba(245, 240, 225, 0.05);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.06);
}

.field-group select option {
  background: #14261a;
  color: #f5f0e1;
}

.image-upload {
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 15px;
  border: 1px dashed rgba(217, 160, 40, 0.3);
  border-radius: 12px;
  background: rgba(217, 160, 40, 0.035);
  color: rgba(245, 240, 225, 0.7);
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.image-upload:hover {
  border-color: rgba(217, 160, 40, 0.6);
  background: rgba(217, 160, 40, 0.065);
}

.upload-icon {
  width: 39px;
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.1);
  color: #f3d27a;
}

.image-preview {
  width: 100%;
  height: 100px;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 12px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-actions,
.delete-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 5px;
}

.cancel-button {
  height: 42px;
  padding: 0 18px;
  border: 1px solid rgba(245, 240, 225, 0.12);
  border-radius: 10px;
  background: rgba(245, 240, 225, 0.03);
  color: rgba(245, 240, 225, 0.58);
  font-size: 10px;
  font-weight: 600;
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.cancel-button:hover:not(:disabled) {
  color: #f5f0e1;
  border-color: rgba(245, 240, 225, 0.22);
  background: rgba(245, 240, 225, 0.06);
}

.confirm-create-button {
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 19px;
  border-radius: 10px;
  background: #d9a028;
  color: #14261a;
  font-size: 10px;
  font-weight: 700;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
}

.confirm-create-button:hover:not(:disabled) {
  background: #f3d27a;
  transform: translateY(-1px);
}

.delete-modal {
  max-width: 430px;
  padding: 31px;
  text-align: center;
}

.delete-modal-icon {
  width: 59px;
  height: 59px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 1px solid rgba(239, 68, 68, 0.22);
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
}

.delete-modal h2 {
  margin-top: 20px;
  color: #f5f0e1;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.delete-description {
  margin-top: 11px;
  color: rgba(245, 240, 225, 0.48);
  font-size: 11px;
  line-height: 1.7;
}

.delete-description span {
  color: #f5f0e1;
  font-weight: 600;
}

.delete-warning {
  margin-top: 7px;
  color: rgba(248, 113, 113, 0.75);
  font-size: 9px;
}

.delete-divider {
  height: 1px;
  margin: 22px 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(245, 240, 225, 0.1),
    transparent
  );
}

.delete-actions {
  justify-content: center;
  padding-top: 0;
}

.confirm-delete-button {
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  color: #fca5a5;
  font-size: 10px;
  font-weight: 700;
  transition:
    color 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
}

.confirm-delete-button:hover:not(:disabled) {
  color: #ffffff;
  border-color: #dc2626;
  background: #dc2626;
}

.cancel-button:disabled,
.confirm-create-button:disabled,
.confirm-delete-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
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

@media (max-width: 1023px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .page-header {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 28px;
  }

  .create-button {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-image {
    height: 240px;
  }
}

@media (max-width: 520px) {
  .two-fields {
    grid-template-columns: 1fr;
  }

  .success-toast {
    top: 15px;
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .modal-overlay {
    padding: 14px;
  }

  .create-modal,
  .delete-modal {
    padding: 23px;
  }

  .modal-actions,
  .delete-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .confirm-create-button,
  .confirm-delete-button {
    width: 100%;
  }

  .product-image {
    height: 210px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .back-icon,
  .create-button,
  .product-card,
  .product-image img,
  .product-content h3,
  .delete-button,
  .card-accent,
  .search-wrapper input,
  .field-group input,
  .field-group textarea,
  .field-group select,
  .image-upload,
  .cancel-button,
  .confirm-create-button,
  .confirm-delete-button {
    transition: none !important;
  }

  .back-link:hover,
  .create-button:hover,
  .product-card:hover,
  .product-card:hover .product-image img,
  .confirm-create-button:hover {
    transform: none !important;
  }
}
</style>