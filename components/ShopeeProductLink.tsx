export default function ShopeeProductLink({ href, productId, label, children }: {
  href: string;
  productId: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      aria-label={label}
      data-affiliate-partner="shopee"
      data-affiliate-placement="productcard"
      data-product-id={productId}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sea-600 focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}
