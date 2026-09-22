<script setup lang="ts">
useHead({
  title: "MiniShop | Privacy & Security",
});

import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-vue-next";
import { changePassword } from "~/composables/api";

const email = ref("");
const oldPassword = ref("");
const newPassword = ref("");
const showOldPassword = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const authStore = useAuthStore();

if (!authStore.isLoggedIn) {
  await navigateTo("/login");
}

async function resetPassword() {
  successMessage.value = "";
  errorMessage.value = "";

  if (
    email.value.trim().toLowerCase() !==
    (authStore.user?.email ?? "").trim().toLowerCase()
  ) {
    errorMessage.value = "The entered email is incorrect!";
    return;
  }

  loading.value = true;

  try {
    const response = await changePassword({
      email: email.value,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    successMessage.value = response.message;
    oldPassword.value = "";
    newPassword.value = "";
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message || "Unable to reset password.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <AdminNavbar v-if="authStore.user?.role === 'ADMIN'" />
    <UsersNavbar v-else />

    <main class="security-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        <NuxtLink
          :to="
            authStore.user?.role === 'ADMIN'
              ? '/adminaccount'
              : '/account'
          "
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
            <span>Account</span>
          </div>

          <h1>Privacy & Security</h1>

          <p>Reset your account password.</p>
        </div>

        <div class="header-divider"></div>

        <div class="security-card">
          <div class="security-intro">
            <div class="security-icon">
              <ShieldCheck :size="28" />
            </div>

            <div>
              <h2>Privacy & Security</h2>
              <p>Reset your account password.</p>
            </div>
          </div>

          <div class="form-divider"></div>

          <form
            class="security-form"
            @submit.prevent="resetPassword"
          >
            <div class="form-group">
              <label>Email Address</label>

              <div class="input-wrapper">
                <Mail
                  :size="17"
                  class="input-icon"
                />

                <input
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Old Password</label>

              <div class="input-wrapper">
                <Lock
                  :size="17"
                  class="input-icon"
                />

                <input
                  v-model="oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  placeholder="Enter your old password"
                  class="password-input"
                />

                <button
                  type="button"
                  class="password-toggle"
                  aria-label="Toggle old password visibility"
                  @click="showOldPassword = !showOldPassword"
                >
                  <Eye
                    v-if="!showOldPassword"
                    :size="18"
                  />

                  <EyeOff
                    v-else
                    :size="18"
                  />
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>New Password</label>

              <div class="input-wrapper">
                <Lock
                  :size="17"
                  class="input-icon"
                />

                <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Enter new password"
                  class="password-input"
                />

                <button
                  type="button"
                  class="password-toggle"
                  aria-label="Toggle new password visibility"
                  @click="showPassword = !showPassword"
                >
                  <Eye
                    v-if="!showPassword"
                    :size="18"
                  />

                  <EyeOff
                    v-else
                    :size="18"
                  />
                </button>
              </div>
            </div>

            <Transition name="message">
              <div
                v-if="successMessage"
                class="message-box success-message"
              >
                <div class="message-icon success-message-icon">
                  ✓
                </div>

                <span>{{ successMessage }}</span>
              </div>
            </Transition>

            <Transition name="message">
              <div
                v-if="errorMessage"
                class="message-box error-message"
              >
                <div class="message-icon error-message-icon">
                  !
                </div>

                <span>{{ errorMessage }}</span>
              </div>
            </Transition>

            <button
              type="submit"
              :disabled="loading"
              class="submit-button"
            >
              <span>
                {{ loading ? "Updating..." : "Reset Password" }}
              </span>

              <ArrowRight
                v-if="!loading"
                :size="18"
                class="submit-arrow"
              />
            </button>
          </form>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.security-page {
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
  width: 450px;
  height: 450px;
  bottom: -200px;
  left: -300px;
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

.security-card {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 32px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 20px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow:
    0 22px 55px rgba(0, 0, 0, 0.13),
    0 0 40px rgba(217, 160, 40, 0.02);
}

.security-intro {
  display: flex;
  align-items: center;
  gap: 15px;
}

.security-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(217, 160, 40, 0.25);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.09);
  color: #f3d27a;
  box-shadow: 0 0 25px rgba(217, 160, 40, 0.05);
}

.security-intro h2 {
  color: #f5f0e1;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.security-intro p {
  margin-top: 4px;
  color: rgba(245, 240, 225, 0.4);
  font-size: 10px;
}

.form-divider {
  width: 100%;
  height: 1px;
  margin: 25px 0;
  background: linear-gradient(
    90deg,
    rgba(245, 240, 225, 0.08),
    rgba(217, 160, 40, 0.16),
    transparent
  );
}

.security-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: rgba(245, 240, 225, 0.62);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  height: 50px;
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

.input-wrapper input.password-input {
  padding-right: 48px;
}

.input-wrapper input::placeholder {
  color: rgba(245, 240, 225, 0.25);
}

.input-wrapper input:hover {
  border-color: rgba(245, 240, 225, 0.17);
}

.input-wrapper input:focus {
  border-color: rgba(217, 160, 40, 0.55);
  background: rgba(245, 240, 225, 0.05);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.055);
}

.input-icon {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 16px;
  color: rgba(217, 160, 40, 0.7);
  transform: translateY(-50%);
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(245, 240, 225, 0.35);
  transform: translateY(-50%);
  transition: color 0.25s ease;
}

.password-toggle:hover {
  color: #f3d27a;
}

.message-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 45px;
  padding: 10px 13px;
  border-radius: 10px;
  font-size: 10px;
  line-height: 1.5;
}

.message-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
}

.success-message {
  border: 1px solid rgba(217, 160, 40, 0.18);
  background: rgba(217, 160, 40, 0.06);
  color: rgba(245, 240, 225, 0.7);
}

.success-message-icon {
  background: #d9a028;
  color: #14261a;
}

.error-message {
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
}

.error-message-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.submit-button {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
  border: 1px solid rgba(217, 160, 40, 0.35);
  border-radius: 11px;
  background: #d9a028;
  color: #14261a;
  font-size: 11px;
  font-weight: 700;
  transition:
    background 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: #f3d27a;
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(217, 160, 40, 0.12);
}

.submit-button:hover:not(:disabled) .submit-arrow {
  transform: translateX(4px);
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.submit-arrow {
  transition: transform 0.3s ease;
}

.message-enter-active,
.message-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .page-header {
    margin-top: 28px;
  }

  .security-card {
    padding: 25px;
  }
}

@media (max-width: 480px) {
  .security-card {
    padding: 20px;
    border-radius: 16px;
  }

  .security-icon {
    width: 46px;
    height: 46px;
  }

  .security-intro h2 {
    font-size: 18px;
  }

  .input-wrapper input {
    height: 48px;
  }

  .submit-button {
    height: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .back-icon,
  .input-wrapper input,
  .password-toggle,
  .submit-button,
  .submit-arrow {
    transition: none !important;
  }

  .back-link:hover,
  .submit-button:hover {
    transform: none !important;
  }
}
</style>