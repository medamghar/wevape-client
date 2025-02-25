export interface Product {
    id: string;
    name: string;
    price: number;
    photos: Photo[];
  }
  interface Photo {
    url: string;
  }
  export interface ProductImage {
    id: string;
    url: string;
    alt: string;
  }
  
  export interface Variant {
    id: string;
    name: string;
    image: string;
    price: number;
    itemsPerPack: number;
    wholesalePrice: number;
    quantityAvailable: number;
    isAvailable: boolean;
    colorCode?: string;
    minimumOrderQuantity:number
  }
  
  export interface ProductStats {
    rating: number;
    reviewCount: number;
    soldCount: number;
  }
  
  export interface CartItem {
    variantId: string;
    quantity: number;
  }