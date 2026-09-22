<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  modelValue: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [page: number];
}>();

async function selectPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return;

  emit("update:modelValue", page);
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="mt-10 flex flex-wrap items-center justify-center gap-2"
    aria-label="Catalog pagination"
  >
    <button
      type="button"
      :disabled="modelValue === 1"
      class="inline-flex h-10 items-center gap-1 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink transition hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Previous page"
      @click="selectPage(modelValue - 1)"
    >
      <ChevronLeft :size="17" />
      Previous
    </button>

    <button
      v-for="page in totalPages"
      :key="page"
      type="button"
      :aria-current="page === modelValue ? 'page' : undefined"
      :class="[
        'h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition',
        page === modelValue
          ? 'border-forest bg-forest text-white'
          : 'border-line bg-white text-ink hover:border-amber hover:text-amber',
      ]"
      @click="selectPage(page)"
    >
      {{ page }}
    </button>

    <button
      type="button"
      :disabled="modelValue === totalPages"
      class="inline-flex h-10 items-center gap-1 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink transition hover:border-amber hover:text-amber disabled:cursor-not-allowed disabled:opacity-40"
      aria-label="Next page"
      @click="selectPage(modelValue + 1)"
    >
      Next
      <ChevronRight :size="17" />
    </button>
  </nav>
</template>
