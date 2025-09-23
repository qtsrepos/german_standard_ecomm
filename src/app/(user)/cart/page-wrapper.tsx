import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('./cart-page'), {
  ssr: false,
  loading: () => (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
});

export default function CartPageWrapper() {
  return <CartPage />;
}
