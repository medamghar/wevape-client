export const calculatePromotionalPrice = (
    variants: Variant[],
    quantities: Record<string, number>
  ): { 
    subtotal: number;
    discount: number;
    total: number;
    freeItems: number;
  } => {
    let subtotal = 0;
    let discount = 0;
    let freeItems = 0;
  
    Object.entries(quantities).forEach(([variantId, quantity]) => {
      const variant = variants.find(v => v.id === variantId);
      if (variant && variant.isAvailable) {
        const basePrice = variant.wholesalePrice * quantity;
        subtotal += basePrice;
        
        // Calculate free items (1 per pack)
        const freeItemsForVariant = quantity;
        freeItems += freeItemsForVariant;
        
        // Calculate discount based on free items
        const discountPerItem = variant.wholesalePrice / variant.itemsPerPack;
        discount += freeItemsForVariant * discountPerItem;
      }
    });
  
    return {
      subtotal,
      discount,
      total: subtotal - discount,
      freeItems
    };
  };