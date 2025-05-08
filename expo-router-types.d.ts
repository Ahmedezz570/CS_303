import type { PathFor } from "expo-router/build/types";

declare global {
  // Añadir todas las rutas de tu aplicación aquí
  // Esto garantiza que TypeScript reconozca estas rutas como válidas
  namespace ReactNavigation {
    interface RootParamList {
      // Rutas principales
      "/": undefined;
      "/index": undefined;
      "/Login": undefined;
      "/Register": undefined;
      "/ForgetPass": undefined;
      "/Onboarding": { fromRegister?: boolean; userId?: string };
      "/CategorySelection": { userId?: string };
      "/About": undefined;
      "/cart": undefined;
      "/CartData": undefined;
      "/DisplayCategories": { title?: string; filter?: string };
      "/Search": undefined;
      "/singlepage": { id: string };
      "/Review": { productId: string };
      "/context": undefined;
      "/data": undefined;
      "/images": undefined;

      // Tabs
      "/(tabs)": undefined;
      "/(tabs)/home": undefined;
      "/(tabs)/products": undefined;
      "/(tabs)/profile": undefined;
      "/(tabs)/chatBot": undefined;
      "/(tabs)/notifications": undefined;

      // Profile Tabs
      "/(ProfileTabs)/About": undefined;
      "/(ProfileTabs)/address": undefined;
      "/(ProfileTabs)/editprofile": undefined;
      "/(ProfileTabs)/help": undefined;
      "/(ProfileTabs)/orders": undefined;
      "/(ProfileTabs)/Wishlist": undefined;

      // Admin Tabs
      "/Admintabs": undefined;
      "/Admintabs/AddProduct": undefined;
      "/Admintabs/Admin": undefined;
      "/Admintabs/Order": undefined;
      "/Admintabs/Preview": undefined;
      "/Admintabs/Users": undefined;

      // Categories
      "/Categories/[type]": { type: string };
      "/Categories/SeeAllCategories": undefined;
    }
  }
}

// Para asegurarnos de que este archivo sea tratado como un módulo
export {};