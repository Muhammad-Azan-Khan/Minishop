<script setup lang="ts">

useHead({
  title: "MiniShop | Register",
});

import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowLeft,
  User,
} from "lucide-vue-next";
import { registerUser } from "~/composables/api";

const router = useRouter();

const showPassword = ref(false);
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agree = ref(false);
const loading = ref(false);
const errorMessage = ref("");

async function handleSignup() {
  errorMessage.value = "";

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (!agree.value) {
    errorMessage.value = "You must agree to the Terms & Conditions";
    return;
  }

  loading.value = true;

  try {
    await registerUser({
      name: fullName.value,
      email: email.value,
      password: password.value,
    });

    router.push("/login");
  } catch (err: any) {
    errorMessage.value =
      err?.data?.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="signup-page min-h-screen bg-paper">
    <div class="grid min-h-screen lg:grid-cols-2">
      <section class="visual-panel hidden lg:flex">
        <div class="visual-grid"></div>
        <div class="visual-glow visual-glow-one"></div>
        <div class="visual-glow visual-glow-two"></div>

        <NuxtLink
          to="/login"
          class="back-button"
          aria-label="Back to login"
        >
          <ArrowLeft :size="20" />
        </NuxtLink>

        <div class="visual-content">
          <div class="brand">
            <div class="brand-logo">
              <MiniShopLogo class="h-full w-full" />
            </div>

            <div>
              <h1 class="brand-name">
                MiniShop
              </h1>

              <p class="brand-tagline">
                Everything you need.
              </p>
            </div>
          </div>

          <div class="visual-main">
            <div class="trust-label">
              <span class="trust-dot"></span>
              <span>Trusted by thousands of shoppers</span>
            </div>

            <h2 class="visual-heading">
              Shop
              <span class="visual-heading-accent">
                Smarter.
              </span>

              <br />

              Live Better.
            </h2>

            <p class="visual-description">
              Discover premium electronics, fashion, beauty, groceries, home
              essentials and much more. Enjoy fast delivery, secure payments,
              and hassle-free shopping from one place.
            </p>
          </div>

          <div class="benefits-grid">
            <div class="benefit-item">
              <div class="benefit-icon">
                <Truck :size="21" />
              </div>

              <div>
                <h3 class="benefit-title">
                  Fast Delivery
                </h3>

                <p class="benefit-description">
                  Nationwide shipping
                </p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <ShieldCheck :size="21" />
              </div>

              <div>
                <h3 class="benefit-title">
                  Secure Payments
                </h3>

                <p class="benefit-description">
                  100% protected
                </p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <ShoppingBag :size="21" />
              </div>

              <div>
                <h3 class="benefit-title">
                  Premium Products
                </h3>

                <p class="benefit-description">
                  Best quality brands
                </p>
              </div>
            </div>

            <div class="benefit-item">
              <div class="benefit-icon">
                <Headphones :size="21" />
              </div>

              <div>
                <h3 class="benefit-title">
                  24/7 Support
                </h3>

                <p class="benefit-description">
                  Always here to help
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="form-panel">
        <div class="form-grid"></div>
        <div class="form-glow"></div>

        <NuxtLink
          to="/login"
          class="mobile-back-button lg:hidden"
          aria-label="Back to login"
        >
          <ArrowLeft
            :size="19"
            class="mobile-back-icon"
          />
        </NuxtLink>

        <div class="signup-container">
          <div class="mobile-brand lg:hidden">
            <div class="mobile-brand-logo">
              <MiniShopLogo class="h-full w-full" />
            </div>

            <span>MiniShop</span>
          </div>

          <div class="signup-heading">
            <div class="signup-label">
              <span class="signup-label-line"></span>
              <span>Join MiniShop</span>
            </div>

            <h2>
              Create your
              <span>account.</span>
            </h2>

            <p>
              Sign up to get started with MiniShop.
            </p>
          </div>

          <div
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </div>

          <form
            class="signup-form"
            @submit.prevent="handleSignup"
          >
            <div class="field-group">
              <label>
                Full Name
              </label>

              <div class="input-wrapper">
                <User
                  class="input-icon"
                  :size="18"
                />

                <input
                  v-model="fullName"
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div class="field-group">
              <label>
                Email Address
              </label>

              <div class="input-wrapper">
                <Mail
                  class="input-icon"
                  :size="18"
                />

                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div class="field-group">
              <label>
                Password
              </label>

              <div class="input-wrapper">
                <Lock
                  class="input-icon"
                  :size="18"
                />

                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
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
                    :size="19"
                  />

                  <EyeOff
                    v-else
                    :size="19"
                  />
                </button>
              </div>
            </div>

            <div class="field-group">
              <label>
                Confirm Password
              </label>

              <div class="input-wrapper">
                <Lock
                  class="input-icon"
                  :size="18"
                />

                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  class="password-input"
                />
              </div>
            </div>

            <label class="terms-label">
              <input
                v-model="agree"
                type="checkbox"
              />

              <span>
                I agree to the

                <NuxtLink to="/terms">
                  Terms & Conditions
                </NuxtLink>
              </span>
            </label>

            <button
              type="submit"
              :disabled="loading"
              class="signup-button group"
            >
              <span>
                {{ loading ? "Creating account..." : "Create Account" }}
              </span>

              <ArrowRight
                v-if="!loading"
                :size="18"
                class="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>

          <div class="separator">
            <span></span>

            <p>OR</p>

            <span></span>
          </div>

          <button class="google-button">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
            />

            <span>
              Continue with Google
            </span>
          </button>

          <p class="login-text">
            Already have an account?

            <NuxtLink to="/login">
              Login
            </NuxtLink>
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  position: relative;
}

.visual-panel {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #14261a;
}

.visual-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      to right,
      rgba(245, 240, 225, 0.035) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(245, 240, 225, 0.035) 1px,
      transparent 1px
    );
  background-size: 52px 52px;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    135deg,
    black,
    transparent 85%
  );
  mask-image: linear-gradient(
    135deg,
    black,
    transparent 85%
  );
}

.visual-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.visual-glow-one {
  width: 500px;
  height: 500px;
  top: -250px;
  left: -200px;
  background: rgba(217, 160, 40, 0.14);
}

.visual-glow-two {
  width: 500px;
  height: 500px;
  right: -280px;
  bottom: -220px;
  background: rgba(217, 160, 40, 0.08);
}

.back-button {
  position: absolute;
  z-index: 20;
  top: 28px;
  left: 28px;
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(245, 240, 225, 0.13);
  border-radius: 50%;
  background: rgba(245, 240, 225, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(245, 240, 225, 0.75);
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;
}

.back-button:hover {
  color: #f3d27a;
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(217, 160, 40, 0.09);
  transform: translateX(-3px);
}

.visual-content {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 38px 60px 48px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-left: 44px;
}

.brand-logo {
  width: 51px;
  height: 51px;
  flex-shrink: 0;
  transition: transform 0.35s ease;
}

.brand:hover .brand-logo {
  transform: rotate(-3deg) scale(1.05);
}

.brand-name {
  color: #f5f0e1;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.brand-tagline {
  margin-top: 6px;
  color: rgba(245, 240, 225, 0.46);
  font-size: 11px;
  letter-spacing: 0.08em;
}

.visual-main {
  max-width: 590px;
}

.trust-label {
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 13px;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 999px;
  background: rgba(245, 240, 225, 0.04);
  color: rgba(245, 240, 225, 0.63);
  font-size: 11px;
  letter-spacing: 0.03em;
}

.trust-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d9a028;
  box-shadow: 0 0 9px rgba(217, 160, 40, 0.65);
}

.visual-heading {
  margin-top: 25px;
  color: #f5f0e1;
  font-size: clamp(3.4rem, 5vw, 5.4rem);
  font-weight: 500;
  line-height: 0.94;
  letter-spacing: -0.045em;
}

.visual-heading-accent {
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

.visual-description {
  max-width: 540px;
  margin-top: 26px;
  color: rgba(245, 240, 225, 0.6);
  font-size: 14px;
  line-height: 1.8;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(245, 240, 225, 0.1);
  border-left: 1px solid rgba(245, 240, 225, 0.1);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 17px;
  border-right: 1px solid rgba(245, 240, 225, 0.1);
  border-bottom: 1px solid rgba(245, 240, 225, 0.1);
  background: rgba(245, 240, 225, 0.018);
  transition: background 0.3s ease;
}

.benefit-item:hover {
  background: rgba(217, 160, 40, 0.055);
}

.benefit-icon {
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.2);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.08);
  color: #f3d27a;
}

.benefit-title {
  color: #f5f0e1;
  font-size: 12px;
  font-weight: 600;
}

.benefit-description {
  margin-top: 3px;
  color: rgba(245, 240, 225, 0.4);
  font-size: 10px;
}

.form-panel {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 28px 40px;
  background: #f5f0e1;
}

.form-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      to right,
      rgba(20, 38, 26, 0.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(20, 38, 26, 0.025) 1px,
      transparent 1px
    );
  background-size: 52px 52px;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom right,
    transparent,
    black,
    transparent
  );
  mask-image: linear-gradient(
    to bottom right,
    transparent,
    black,
    transparent
  );
}

.form-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  right: -300px;
  top: -250px;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.1);
  filter: blur(100px);
  pointer-events: none;
}

.signup-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
}

.signup-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 11px;
  color: #b67c0c;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.signup-label-line {
  width: 24px;
  height: 1px;
  background: #d9a028;
}

.signup-heading h2 {
  color: #14261a;
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.035em;
}

.signup-heading h2 span {
  color: #c88d19;
}

.signup-heading > p {
  margin-top: 7px;
  color: rgba(20, 38, 26, 0.55);
  font-size: 12px;
  line-height: 1.6;
}

.error-message {
  margin-top: 12px;
  padding: 9px 13px;
  border: 1px solid rgba(185, 28, 28, 0.16);
  border-radius: 10px;
  background: rgba(185, 28, 28, 0.05);
  color: #b91c1c;
  font-size: 11px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 19px;
}

.field-group label {
  display: block;
  margin-bottom: 5px;
  color: #14261a;
  font-size: 11px;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  height: 45px;
  padding: 0 16px 0 44px;
  border: 1px solid rgba(20, 38, 26, 0.13);
  border-radius: 11px;
  outline: none;
  background: rgba(255, 255, 255, 0.6);
  color: #14261a;
  font-size: 12px;
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease;
}

.input-wrapper input::placeholder {
  color: rgba(20, 38, 26, 0.35);
}

.input-wrapper input:focus {
  border-color: rgba(217, 160, 40, 0.7);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 3px rgba(217, 160, 40, 0.08);
}

.input-wrapper .password-input {
  padding-right: 48px;
}

.input-icon {
  position: absolute;
  z-index: 2;
  left: 15px;
  top: 50%;
  color: rgba(20, 38, 26, 0.38);
  transform: translateY(-50%);
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: #c88d19;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(20, 38, 26, 0.38);
  transform: translateY(-50%);
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #c88d19;
}

.terms-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(20, 38, 26, 0.52);
  font-size: 10px;
  line-height: 1.5;
  cursor: pointer;
}

.terms-label input {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  accent-color: #d9a028;
}

.terms-label a {
  color: #b67c0c;
  font-weight: 700;
  transition: color 0.3s ease;
}

.terms-label a:hover {
  color: #8d5f08;
}

.signup-button {
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  border-radius: 11px;
  background: linear-gradient(
    100deg,
    #d9a028,
    #f3d27a,
    #d9a028
  );
  background-size: 200% auto;
  color: #14261a;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(217, 160, 40, 0.18);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background-position 0.4s ease;
}

.signup-button:hover:not(:disabled) {
  transform: translateY(-2px);
  background-position: 100% center;
  box-shadow: 0 12px 28px rgba(217, 160, 40, 0.28);
}

.signup-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.separator {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 14px 0;
}

.separator span {
  flex: 1;
  height: 1px;
  background: rgba(20, 38, 26, 0.1);
}

.separator p {
  color: rgba(20, 38, 26, 0.35);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
}

.google-button {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  border: 1px solid rgba(20, 38, 26, 0.12);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.5);
  color: #14261a;
  font-size: 12px;
  font-weight: 600;
  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    transform 0.3s ease;
}

.google-button:hover {
  border-color: rgba(217, 160, 40, 0.4);
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.google-button img {
  width: 18px;
  height: 18px;
}

.login-text {
  margin-top: 13px;
  text-align: center;
  color: rgba(20, 38, 26, 0.5);
  font-size: 11px;
}

.login-text a {
  margin-left: 4px;
  color: #b67c0c;
  font-weight: 700;
  transition: color 0.3s ease;
}

.login-text a:hover {
  color: #8d5f08;
}

.mobile-back-button {
  position: absolute;
  z-index: 20;
  top: 20px;
  left: 20px;
  width: 42px;
  height: 42px;
  padding: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(217, 160, 40, 0.18);
  border-radius: 50%;
  background: #14261a;
  color: #f5f0e1;
  line-height: 0;
  box-shadow: 0 6px 18px rgba(20, 38, 26, 0.15);
}

.mobile-back-icon {
  display: block;
  flex-shrink: 0;
}

.mobile-brand {
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-bottom: 22px;
  color: #14261a;
  font-size: 19px;
  font-weight: 700;
}

.mobile-brand-logo {
  width: 35px;
  height: 35px;
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

@media (max-width: 1200px) {
  .visual-content {
    padding-left: 45px;
    padding-right: 45px;
  }

  .visual-heading {
    font-size: 4rem;
  }
}

@media (max-width: 1023px) {
  .form-panel {
    padding: 80px 24px 40px;
  }

  .signup-container {
    max-width: 440px;
  }

  .mobile-back-button {
    display: flex;
  }

  .mobile-brand {
    display: flex;
  }
}

@media (max-width: 640px) {
  .form-panel {
    align-items: flex-start;
    padding: 76px 20px 35px;
  }

  .form-grid {
    background-size: 38px 38px;
  }

  .signup-heading h2 {
    font-size: 2.25rem;
  }

  .mobile-brand {
    margin-bottom: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-button,
  .brand-logo,
  .benefit-item,
  .input-wrapper input,
  .input-icon,
  .password-toggle,
  .terms-label a,
  .signup-button,
  .google-button,
  .login-text a {
    transition: none !important;
  }

  .visual-heading-accent {
    animation: none;
  }

  .back-button:hover,
  .brand:hover .brand-logo,
  .signup-button:hover,
  .google-button:hover {
    transform: none !important;
  }
}
</style>