<template>
  <div>
    <h1 class="text-xl font-bold py-4 mb-8">{{category?.name}}</h1>

    <div class="flex flex-wrap max-w-[80rem] w-[90%] gap-y-6 gap-x-4 mx-auto justify-center">
      <div 
        v-for="product in products"
        :key="product.slug"
        class="relative max-w-[20rem] h-[32rem] flex-[1_1_18rem] bg-white rounded-xl overflow-hidden hover:shadow-[0_0_15px_gray] dark:hover:shadow-[0_0_15px_#4B5563] hover:-mt-3 hover:mb-3 transition-all duration-700"
        >
          <div v-if="product?.stock === 0" class="absolute z-10 top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
              <p class="text-white text-2xl font-bold bg-gray-700 p-4 rounded-2xl">Sold Out</p>
          </div>
          <div class="group max-w-[32rem] h-[35rem] mt-0 bg-transparent hover:bg-white hover:scale-[1.035] transition duration-500 relative overflow-hidden">
            <div class="w-full h-full">
              <img :src="getImageUrl(product?.image)" id="img" class="w-full h-full object-cover">
              <div v-if="product?.stock > 0" class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center opacity-0 group-hover:opacity-100 transition duration-500">
                <p class="text-white text-2xl font-bold bg-gray-700 p-4 rounded-2xl">{{product.stock}} In Stock</p>
              </div>
              <div class="absolute bottom-[60%] left-0 right-0 opacity-0 text-center group-hover:opacity-100 transition duration-500">
                  <div @click="addToCart(product)">
                    <p class="flex justify-center items-center h-[3.5rem] leading-[3.5rem] text-[2.5rem] w-[40%] mx-auto bg-white border border-black rounded-full text-black hover:text-white hover:bg-[rgb(55,55,55)] transition duration-500 mb-2" ><Icon name="solar:cart-plus-bold" /></p>
                  </div>
                  <NuxtLink 
                    :to="`/${route.params.slug}/${product.slug}`"
                  >
                    <p class="flex justify-center items-center h-[3.5rem] leading-[3.5rem] text-[2.5rem] w-[40%] mx-auto bg-white border border-black rounded-full text-black hover:text-white hover:bg-[rgb(55,55,55)] transition duration-500" ><Icon name="mdi:eye" /></p>
                  </NuxtLink>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 w-full px-[5%] h-[27.5%] mt-4 pt-3 bg-[rgb(217,211,211)] rounded-md">
            <div class="h-[3.75rem]">
                <NuxtLink 
                  :to="`/${route.params.slug}/${product?.slug}`"
                  class="text-black text-left text-[1.2rem] font-medium hover:text-[darkblue] transition duration-500"  
                >
                  {{ product?.name }}
                </NuxtLink>
            </div>
            <h1 id="price" class="border-t-[0.1rem] border-t-[rgba(0,0,0,0.1)] text-[2rem] text-center font-bold p-2 mt-3 cursor-default text-black">
                $ {{ product?.price }}
            </h1>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Product } from '~/types/products';
  import type { Category } from '~/types/categories';
  import { useCartStore } from '~/store/cartStore';

  const category = ref<Category | null>(null);
  const products = ref<Product[] | null>(null);
  const route = useRoute();
  const config = useRuntimeConfig();

  const addToCart = (product: Product) => {
    const cart = useCartStore();
    cart.addToCart(product.slug, 1);
  };

  function getImageUrl(image: string | undefined) {
    if (!image) return '';
    return config.public.API_BASE_URL + image;
  }
  onMounted(async () => {
    try {
      const slug = route.params.slug;
      const categoryResponce = await useApi<Category>(`/categories/${slug}`, {
        method: 'GET'
      });
      const response = await useApi<Product[]>(`/products?categorySlug=${slug}&limit=24&order=name&direction=asc`, {
        method: 'GET',
      });

      category.value = categoryResponce;
      products.value = response;
    } catch (err) {
      console.error('Failed to fetch product:', err);
    }
  });
</script>
