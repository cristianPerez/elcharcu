export type ProductAccent = 'forest' | 'terracota' | 'sage';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: string;
  readonly unit: string;
  readonly accent: ProductAccent;
}
