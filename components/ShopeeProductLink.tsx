export default function ShopeeProductLink({ href, productId, name, children }: {
  href: string;
  productId: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={`View ${name} on Shopee`}
      data-affiliate-partner="shopee"
      data-affiliate-placement="productcard"
      data-product-id={productId}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sea-600 focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}
