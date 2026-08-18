export type ProductAccent = 'forest' | 'terracota' | 'sage';

export interface Product {
  readonly id: string;
  readonly name: string;
  /**
   * Foto del producto, servida desde `public/`.
   *
   * Se reutilizan las que ya se generaron para las recetas en vez de crear
   * otras: son las mismas piezas, ya están optimizadas (430×180, ~15 KB) y
   * generar cuatro imágenes nuevas habría costado dinero para el mismo
   * resultado.
   */
  readonly image: string;
  readonly description: string;
  readonly price: string;
  readonly unit: string;
  readonly accent: ProductAccent;
}
