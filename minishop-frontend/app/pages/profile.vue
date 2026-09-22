<script setup lang="ts">
useHead({
  title: "MiniShop | Profile",
});

import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  BadgeCheck,
} from "lucide-vue-next";

const authStore = useAuthStore();

if (!authStore.isLoggedIn) {
  await navigateTo("/login");
}
</script>

<template>
  <div class="min-h-screen bg-forest font-body">
    <AdminNavbar v-if="authStore.user?.role === 'ADMIN'" />
    <UsersNavbar v-else />

    <main class="profile-page bg-forest">
      <div class="page-grid"></div>
      <div class="page-glow page-glow-one"></div>
      <div class="page-glow page-glow-two"></div>

      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <NuxtLink
          :to="authStore.user?.role === 'ADMIN' ? '/adminaccount' : '/account'"
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

          <h1>Personal Details</h1>

          <p>View your account information.</p>
        </div>

        <div class="header-divider"></div>

        <div class="profile-card">
          <div class="profile-hero">
            <div class="profile-hero-grid"></div>
            <div class="profile-hero-glow"></div>

            <div class="profile-identity">
              <div class="profile-avatar">
                {{
                  authStore.user?.email
                    ?.charAt(0)
                    .toUpperCase()
                }}
              </div>

              <div class="profile-email">
                {{ authStore.user?.email }}
              </div>

              <div class="profile-role">
                <Shield :size="12" />
                <span>
                  {{ authStore.isAdmin ? "Admin" : "Customer" }}
                </span>
              </div>
            </div>
          </div>

          <div class="profile-details">
            <div class="detail-card">
              <div class="detail-icon">
                <User :size="20" />
              </div>

              <div class="detail-content">
                <p>User ID</p>

                <h3>
                  {{ authStore.user?.userId }}
                </h3>
              </div>

              <span class="detail-number">01</span>
            </div>

            <div class="detail-card">
              <div class="detail-icon">
                <Mail :size="20" />
              </div>

              <div class="detail-content min-w-0">
                <p>Email Address</p>

                <h3 class="break-all">
                  {{ authStore.user?.email }}
                </h3>
              </div>

              <span class="detail-number">02</span>
            </div>

            <div class="detail-card">
              <div class="detail-icon">
                <Shield :size="20" />
              </div>

              <div class="detail-content">
                <p>Account Role</p>

                <h3 class="capitalize">
                  {{ authStore.user?.role }}
                </h3>
              </div>

              <span class="detail-number">03</span>
            </div>

            <div class="detail-card">
              <div class="detail-icon">
                <BadgeCheck :size="20" />
              </div>

              <div class="detail-content">
                <p>Account Status</p>

                <h3 class="status-active">
                  <span class="status-dot"></span>
                  Active
                </h3>
              </div>

              <span class="detail-number">04</span>
            </div>

            <div class="detail-card">
              <div class="detail-icon">
                <Calendar :size="20" />
              </div>

              <div class="detail-content">
                <p>Member Since</p>

                <h3>July 2026</h3>
              </div>

              <span class="detail-number">05</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.profile-page {
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

.profile-card {
  overflow: hidden;
  border: 1px solid rgba(245, 240, 225, 0.1);
  border-radius: 20px;
  background: rgba(245, 240, 225, 0.025);
  box-shadow:
    0 22px 55px rgba(0, 0, 0, 0.13),
    0 0 40px rgba(217, 160, 40, 0.02);
}

.profile-hero {
  position: relative;
  min-height: 290px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(245, 240, 225, 0.08);
  background: rgba(245, 240, 225, 0.025);
}

.profile-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(
      to right,
      rgba(245, 240, 225, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      rgba(245, 240, 225, 0.03) 1px,
      transparent 1px
    );
  background-size: 38px 38px;
  -webkit-mask-image: radial-gradient(
    circle at center,
    black,
    transparent 72%
  );
  mask-image: radial-gradient(
    circle at center,
    black,
    transparent 72%
  );
}

.profile-hero-glow {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.1);
  filter: blur(90px);
}

.profile-identity {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 35px 20px;
  text-align: center;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(217, 160, 40, 0.45);
  border-radius: 50%;
  background: #d9a028;
  color: #14261a;
  font-size: 34px;
  font-weight: 700;
  box-shadow:
    0 0 0 7px rgba(217, 160, 40, 0.06),
    0 18px 40px rgba(0, 0, 0, 0.18);
}

.profile-email {
  max-width: 100%;
  margin-top: 21px;
  overflow-wrap: anywhere;
  color: #f5f0e1;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.profile-role {
  min-height: 29px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 0 12px;
  border: 1px solid rgba(217, 160, 40, 0.2);
  border-radius: 999px;
  background: rgba(217, 160, 40, 0.07);
  color: #f3d27a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid rgba(245, 240, 225, 0.02);
  border-left: 1px solid rgba(245, 240, 225, 0.02);
}

.detail-card {
  position: relative;
  min-height: 145px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 25px;
  overflow: hidden;
  border-right: 1px solid rgba(245, 240, 225, 0.08);
  border-bottom: 1px solid rgba(245, 240, 225, 0.08);
  transition:
    background 0.3s ease,
    border-color 0.3s ease;
}

.detail-card:hover {
  border-color: rgba(217, 160, 40, 0.15);
  background: rgba(217, 160, 40, 0.035);
}

.detail-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(217, 160, 40, 0.18);
  border-radius: 50%;
  background: rgba(217, 160, 40, 0.065);
  color: #f3d27a;
  transition:
    transform 0.35s ease,
    background 0.35s ease;
}

.detail-card:hover .detail-icon {
  transform: scale(1.07) rotate(-4deg);
  background: rgba(217, 160, 40, 0.11);
}

.detail-content {
  min-width: 0;
}

.detail-content p {
  color: rgba(245, 240, 225, 0.32);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.detail-content h3 {
  margin-top: 6px;
  color: #f5f0e1;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.detail-number {
  position: absolute;
  top: 17px;
  right: 19px;
  color: rgba(245, 240, 225, 0.14);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.status-active {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #f5f0e1 !important;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d9a028;
  box-shadow: 0 0 8px rgba(217, 160, 40, 0.5);
}

@media (max-width: 767px) {
  .page-grid {
    background-size: 38px 38px;
  }

  .page-header {
    margin-top: 28px;
  }

  .profile-hero {
    min-height: 260px;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }

  .detail-card {
    min-height: 125px;
  }
}

@media (max-width: 480px) {
  .profile-card {
    border-radius: 16px;
  }

  .profile-avatar {
    width: 78px;
    height: 78px;
    font-size: 29px;
  }

  .profile-hero {
    min-height: 245px;
  }

  .detail-card {
    min-height: 115px;
    padding: 20px;
  }

  .detail-icon {
    width: 41px;
    height: 41px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .back-icon,
  .detail-card,
  .detail-icon {
    transition: none !important;
  }

  .back-link:hover,
  .detail-card:hover .detail-icon {
    transform: none !important;
  }
}
</style>