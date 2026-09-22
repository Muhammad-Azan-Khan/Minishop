import type { Cart } from "~/types/cart";
import { getCart } from "~/composables/api";

export const useCartStore = defineStore("cart", () => {
  const itemCount = ref(0);
  const loading = ref(false);

  function syncCart(cart: Cart | null | undefined) {
    itemCount.value = cart?.items.reduce(
      (total, item) => total + item.quantity,
      0,
    ) ?? 0;
  }

  async function refreshCartCount() {
    if (loading.value) return;

    loading.value = true;

    try {
      syncCart(await getCart());
    } catch {
      itemCount.value = 0;
    } finally {
      loading.value = false;
    }
  }

  function clearCart() {
    itemCount.value = 0;
  }

  return {
    itemCount,
    syncCart,
    refreshCartCount,
    clearCart,
  };
});
