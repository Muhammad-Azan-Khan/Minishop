<script setup lang="ts">
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-vue-next";
import { resetForgottenPassword } from "~/composables/api";

const router = useRouter();

const email = ref("");
const newPassword = ref("");
const showPassword = ref(false);
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function handleResetPassword() {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await resetForgottenPassword({
      email: email.value,
      newPassword: newPassword.value,
    });

    successMessage.value = response.message;

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message || "Unable to reset password.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="reset-page min-h-screen bg-forest font-body">
    <div class="page-grid"></div>
    <div class="page-glow page-glow-one"></div>
    <div class="page-glow page-glow-two"></div>

    <div class="reset-wrapper">
      <NuxtLink
        to="/login"
        class="back-button"
        aria-label="Back to login"
      >
        <ArrowLeft
          :size="19"
          class="back-icon"
        />
      </NuxtLink>

      <div class="brand">
        <div class="brand-logo">
          <MiniShopLogo class="h-full w-full" />
        </div>

        <div class="brand-text">
          <span>MINISHOP</span>
        </div>
      </div>

      <div class="reset-card">
        <div class="card-glow"></div>

        <div class="reset-header">
          <div class="header-label">
            <span class="header-line"></span>
            <span>Account Recovery</span>
          </div>

          <h1>Reset Password</h1>

          <p>
            Enter your email and choose a new password.
          </p>
        </div>

        <Transition name="message">
          <div
            v-if="successMessage"
            class="message-box success-message"
          >
            <div class="message-icon success-icon">
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
            <div class="message-icon error-icon">
              !
            </div>

            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <form
          class="reset-form"
          @submit.prevent="handleResetPassword"
        >
          <div class="form-group">
            <label>Email</label>

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
                aria-label="Toggle password visibility"
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

          <button
            type="submit"
            :disabled="loading"
            class="submit-button"
          >
            <span>
              {{ loading ? "Resetting..." : "Reset Password" }}
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
  </div>
</template>

<style scoped>
.reset-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 48px 24px;
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
  -webkit-mask-image: radial-gradient(
    circle at center,
    black,
    transparent 80%
  );
  mask-image: radial-gradient(
    circle at center,
    black,
    transparent 80%
  );
}

.page-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.page-glow-one {
  width: 520px;
  height: 520px;
  top: -280px;
  right: -250px;
  background: rgba(217, 160, 40, 0.09);
}

.page-glow-two {
  width: 500px;
  height: 500px;
  bottom: -300px;
  left: -250px;
  background: rgba(217, 160, 40, 0.055);
}

.reset-wrapper {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 480px;
}

.back-button {
  position: absolute;
  z-index: 20;
  top: 0;
  left: 0;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.12);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.045);
  color: #f5f0e1;
  line-height: 0;
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;
}

.back-button:hover {
  color: #f3d27a;
  border-color: rgba(217, 160, 40, 0.35);
  background: rgba(217, 160, 40, 0.08);
  transform: translateX(-3px);
}

.back-icon {
  display: block;
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 26px;
}

.brand-logo {
  width: 38px;
  height: 38px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-text span {
  color: #f5f0e1;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.reset-card {
  position: relative;
  overflow: hidden;
  padding: 37px;
  border: 1px solid rgba(245, 240, 225, 0.11);
  border-radius: 22px;
  background: rgba(245, 240, 225, 0.035);
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.22),
    0 0 50px rgba(217, 160, 40, 0.025);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-glow {
  position: absolute;
  top: -150px;
  right: -140px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.07);
  filter: blur(80px);
  pointer-events: none;
}

.reset-header {
  position: relative;
  z-index: 2;
}

.header-label {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 13px;
  color: #d9a028;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}

.header-line {
  width: 22px;
  height: 1px;
  background: #d9a028;
}

.reset-header h1 {
  color: #f5f0e1;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.035em;
}

.reset-header p {
  margin-top: 10px;
  color: rgba(245, 240, 225, 0.43);
  font-size: 11px;
  line-height: 1.65;
}

.reset-form {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 19px;
  margin-top: 28px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: rgba(245, 240, 225, 0.6);
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
  color: rgba(245, 240, 225, 0.24);
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
  color: rgba(217, 160, 40, 0.72);
  transform: translateY(-50%);
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 15px;
  width: 24px;
  height: 24px;
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
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  margin-top: 21px;
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
  border: 1px solid rgba(217, 160, 40, 0.2);
  background: rgba(217, 160, 40, 0.065);
  color: rgba(245, 240, 225, 0.72);
}

.success-icon {
  background: #d9a028;
  color: #14261a;
}

.error-message {
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: rgba(239, 68, 68, 0.07);
  color: #fca5a5;
}

.error-icon {
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
  margin-top: 3px;
  border: 1px solid rgba(217, 160, 40, 0.4);
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
  box-shadow: 0 12px 28px rgba(217, 160, 40, 0.14);
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

@media (max-width: 640px) {
  .reset-page {
    align-items: flex-start;
    padding: 25px 18px 40px;
  }

  .page-grid {
    background-size: 38px 38px;
  }

  .reset-wrapper {
    padding-top: 65px;
  }

  .back-button {
    top: 0;
  }

  .brand {
    margin-bottom: 20px;
  }

  .reset-card {
    padding: 27px 22px;
    border-radius: 18px;
  }

  .reset-header h1 {
    font-size: 29px;
  }
}

@media (max-width: 380px) {
  .reset-page {
    padding-right: 14px;
    padding-left: 14px;
  }

  .reset-card {
    padding: 24px 18px;
  }

  .brand-logo {
    width: 34px;
    height: 34px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-button,
  .input-wrapper input,
  .password-toggle,
  .submit-button,
  .submit-arrow {
    transition: none !important;
  }

  .back-button:hover,
  .submit-button:hover {
    transform: none !important;
  }
}
</style>