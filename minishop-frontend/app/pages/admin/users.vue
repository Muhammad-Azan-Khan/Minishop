<script setup lang="ts">
useHead({
  title: "MiniShop | Users",
});

import {
  ArrowLeft,
  Trash2,
  User,
  Mail,
  Shield,
  Calendar,
} from "lucide-vue-next";
import type { User as UserType } from "~/types/user";
import {
  getAllUsersAdmin,
  deleteUserAdmin,
} from "~/composables/api";

const authStore = useAuthStore();
const router = useRouter();

if (!authStore.isLoggedIn || !authStore.isAdmin) {
  router.push("/login");
}

const users = ref<UserType[]>([]);
const loading = ref(true);

const pageSize = 10;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(users.value.length / pageSize)),
);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return users.value.slice(start, start + pageSize);
});

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount;
  }
});

const showDeleteModal = ref(false);
const userToDelete = ref<UserType | null>(null);
const showSuccess = ref(false);
const successMessage = ref("");
const deleting = ref(false);

const fetchUsers = async () => {
  try {
    users.value = await getAllUsersAdmin();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loading.value = false;
  }
};

const openDeleteModal = (user: UserType) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;

  deleting.value = true;

  try {
    await deleteUserAdmin(userToDelete.value.id);

    users.value = users.value.filter(
      (user) => user.id !== userToDelete.value!.id,
    );

    closeDeleteModal();

    successMessage.value = "User deleted successfully.";
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchUsers();
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

    <main class="users-page bg-forest">
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

          <h1>Users Management</h1>

          <p>
            View and manage all registered users.
          </p>
        </div>

        <div class="header-divider"></div>

        <div
          v-if="loading"
          class="loading-state"
        >
          <div class="loading-spinner"></div>
          <p>Loading users...</p>
        </div>

        <div
          v-else
          class="users-list"
        >
          <div
            v-for="user in paginatedUsers"
            :key="user.id"
            class="user-card"
          >
            <div class="user-main">
              <div class="avatar">
                <User :size="21" />
              </div>

              <div class="user-information">
                <h2>
                  {{ user.name }}
                </h2>

                <div class="email-row">
                  <Mail :size="14" />
                  <span>{{ user.email }}</span>
                </div>
              </div>
            </div>

            <div class="user-details">
              <div class="detail-item">
                <span class="detail-icon">
                  <Shield :size="15" />
                </span>

                <div>
                  <p class="detail-label">Role</p>

                  <span class="role-badge">
                    {{ user.role }}
                  </span>
                </div>
              </div>

              <div class="detail-item">
                <span class="detail-icon">
                  <Calendar :size="15" />
                </span>

                <div>
                  <p class="detail-label">Joined</p>

                  <p class="detail-value">
                    {{
                      new Date(
                        user.createdAt,
                      ).toLocaleDateString()
                    }}
                  </p>
                </div>
              </div>
            </div>

            <button
              class="delete-user-button"
              @click="openDeleteModal(user)"
            >
              <Trash2 :size="16" />
              <span>Delete User</span>
            </button>

            <div class="card-accent"></div>
          </div>
        </div>

        <CatalogPagination
          v-if="!loading && users.length > 0"
          v-model="currentPage"
          :total-pages="totalPages"
        />
      </div>
    </main>

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
            Delete User?
          </h2>

          <p class="delete-description">
            Are you sure you want to permanently delete
            <span>{{ userToDelete?.name }}</span>?
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
              @click="deleteUser"
            >
              <Trash2
                v-if="!deleting"
                :size="16"
              />

              <span>
                {{ deleting ? "Deleting..." : "Delete User" }}
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
.users-page {
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

.users-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.user-card {
  position: relative;
  display: grid;
  grid-template-columns:
    minmax(260px, 1.4fr)
    minmax(300px, 1fr)
    auto;
  align-items: center;
  gap: 30px;
  overflow: hidden;
  padding: 21px 23px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 16px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  border-color: rgba(217, 160, 40, 0.24);
  background: rgba(245, 240, 225, 0.048);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.12),
    0 0 25px rgba(217, 160, 40, 0.02);
}

.user-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(217, 160, 40, 0.2);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.07);
  color: #f3d27a;
  transition:
    transform 0.35s ease,
    background 0.35s ease;
}

.user-card:hover .avatar {
  transform: scale(1.06);
  background: rgba(217, 160, 40, 0.11);
}

.user-information {
  min-width: 0;
}

.user-information h2 {
  overflow: hidden;
  color: #f5f0e1;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.email-row {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 7px;
  color: rgba(245, 240, 225, 0.38);
  font-size: 10px;
}

.email-row svg {
  flex-shrink: 0;
  color: #d9a028;
}

.email-row span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 25px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-icon {
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(217, 160, 40, 0.14);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.05);
  color: #f3d27a;
}

.detail-label {
  margin-bottom: 4px;
  color: rgba(245, 240, 225, 0.28);
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.detail-value {
  color: rgba(245, 240, 225, 0.65);
  font-size: 10px;
  font-weight: 500;
}

.role-badge {
  min-height: 23px;
  display: inline-flex;
  align-items: center;
  padding: 0 9px;
  border: 1px solid rgba(217, 160, 40, 0.17);
  border-radius: 999px;
  background: rgba(217, 160, 40, 0.07);
  color: #f3d27a;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.delete-user-button {
  height: 39px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 15px;
  border: 1px solid rgba(239, 68, 68, 0.16);
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.055);
  color: rgba(252, 165, 165, 0.85);
  font-size: 9px;
  font-weight: 600;
  white-space: nowrap;
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.delete-user-button:hover {
  color: #fee2e2;
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.13);
}

.card-accent {
  position: absolute;
  right: 23px;
  bottom: 0;
  left: 23px;
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

.user-card:hover .card-accent {
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

.delete-modal {
  width: 100%;
  max-width: 430px;
  padding: 31px;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.11);
  border-radius: 20px;
  background: #14261a;
  text-align: center;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(217, 160, 40, 0.035);
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
  display: flex;
  justify-content: center;
  gap: 10px;
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
  .user-card {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .user-details {
    grid-column: 1 / -1;
    grid-row: 2;
    padding-top: 17px;
    border-top: 1px solid rgba(245, 240, 225, 0.07);
  }

  .delete-user-button {
    grid-column: 2;
    grid-row: 1;
  }
}

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .page-header {
    margin-top: 28px;
  }

  .user-card {
    display: flex;
    align-items: stretch;
    flex-direction: column;
    gap: 18px;
    padding: 20px;
  }

  .user-details {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-top: 17px;
    border-top: 1px solid rgba(245, 240, 225, 0.07);
  }

  .delete-user-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .success-toast {
    top: 15px;
    right: 15px;
    left: 15px;
    max-width: none;
  }

  .user-details {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .modal-overlay {
    padding: 14px;
  }

  .delete-modal {
    padding: 23px;
  }

  .delete-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .confirm-delete-button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .back-icon,
  .user-card,
  .avatar,
  .delete-user-button,
  .card-accent,
  .cancel-button,
  .confirm-delete-button {
    transition: none !important;
  }

  .back-link:hover,
  .user-card:hover,
  .user-card:hover .avatar {
    transform: none !important;
  }
}
</style>