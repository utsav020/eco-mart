export interface CartItem {
  reduce(arg0: (acc: number, item: { price: number; quantity: number; }) => number, arg1: number): unknown;
  cart_id: number;
  quantity: number;
  productName: string;
  productVariantName?: string | null;
  salePrice?: number | null;
  weights?: string | null;
  image_url?: string | null;
}
