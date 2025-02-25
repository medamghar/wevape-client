import { ProductImage, ProductStats, Variant } from "../types/types";

export const productImages: ProductImage[] = [
    {
      id: '1',
      url: 'https://lovape.ma/cdn/shop/products/WAKASOLO2WATERMELONCHILL2.5KPUFFS5.jpg',
      alt: 'Vape Product 1'
    },
    {
      id: '2',
      url: 'https://lovape.ma/cdn/shop/products/WAKASOLO2WATERMELONCHILL2.5KPUFFS5.jpg',
      alt: 'Vape Product 2'
    },
    {
      id: '3',
      url: 'https://lovape.ma/cdn/shop/products/WAKASOLO2WATERMELONCHILL2.5KPUFFS5.jpg',
      alt: 'Vape Product 3'
    },
    {
      id: '4',
      url: 'https://lovape.ma/cdn/shop/products/WAKASOLO2WATERMELONCHILL2.5KPUFFS5.jpg',
      alt: 'Vape Product 4'
    }
  ];
  
  export const variants= [
    {
      id: '1',
      name: 'Abricot',
      image: 'https://lovape.ma/cdn/shop/products/WAKASOLO2WATERMELONCHILL2.5KPUFFS5.jpg',
      price: 180.0,
      itemsPerPack: 10,
      wholesalePrice: 150.0,
      quantityAvailable: 50,
      isAvailable: true,
      minimumOrderQuantity:4
    },
    {
      id: '2',
      name: 'Noir',
      image: 'https://lovape.ma/cdn/shop/products/sample2.jpg',
      price: 200.0,
      itemsPerPack: 10,
      wholesalePrice: 170.0,
      quantityAvailable: 0,
      isAvailable: false,
      minimumOrderQuantity:4
    },
    {
      id: '3',
      name: 'Bleu',
      image: 'https://lovape.ma/cdn/shop/products/sample3.jpg',
      price: 220.0,
      itemsPerPack: 10,
      wholesalePrice: 190.0,
      quantityAvailable: 20,
      isAvailable: true,
      minimumOrderQuantity:4
    },
    {
      id: '4',
      name: 'Vert',
      image: 'https://lovape.ma/cdn/shop/products/sample4.jpg',
      price: 190.0,
      itemsPerPack: 10,
      wholesalePrice: 160.0,
      quantityAvailable: 10,
      isAvailable: true,
      minimumOrderQuantity:4
    }
  ];
  
  export const productStats: ProductStats = {
    rating: 4.9,
    reviewCount: 2300,
    soldCount: 2900,
  };