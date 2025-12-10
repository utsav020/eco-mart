export interface OrderItem {
//   productName: ReactNode;
  order_id: number;
  total_amount: string;
  payment_method: string;
  order_status: string;
  created_at: string;
  items: {
    product_description: string;
    product_id: number;
    quantity: number;
    price: string;
    productName: string;
    productVariantName: string | null;
    image_url: string | null;
  }[];
}


export interface OrderDetails {
  status: string;
  order_id: number;
  user: {
    user_id: number;
    name: string;
    email: string;
    phoneNo: string;
    address: string;
    city: string;
    pincode: string;
  };
  total_amount: string;
  payment_method: string;
  order_status: string;
  order_date: string;
  items: {
    order_item_id: number;
    product_id: number;
    product_variant_id: number | null;
    productName: string;
    categoryName: string;
    productVariantName: string | null;
    weights: string;
    regularPrice: string;
    salePrice: string;
    quantity: number;
    price: string;
    subtotal: string;
  }[];
}

