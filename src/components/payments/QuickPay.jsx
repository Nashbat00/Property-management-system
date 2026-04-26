import { useState } from 'react';

function PaymentBrandButton({ brand, onClick, disabled }) {
  const styles = {
    apple: 'bg-black text-white hover:bg-gray-800',
    google: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    card: 'bg-primary-600 text-white hover:bg-primary-700',
  };
  const labels = {
    apple: ' Pay',
    google: 'G Pay',
    card: 'Pay with Card',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${styles[brand]}`}
    >
      {labels[brand]}
    </button>
  );
}

export default function QuickPay({ amount, month, onPay }) {
  const [processing, setProcessing] = useState('');
  const [success, setSuccess] = useState('');

  function handlePay(brand) {
    setProcessing(brand);
    setSuccess('');
    // Simulate payment processing delay
    setTimeout(() => {
      onPay(brand);
      setProcessing('');
      setSuccess(brand);
      setTimeout(() => setSuccess(''), 3000);
    }, 900);
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-1">Quick Pay</h3>
      <p className="text-xs text-gray-500 mb-3">
        Pay <span className="font-semibold">${amount}</span> for {month} using your preferred method.
      </p>

      {success && (
        <div className="mb-3 p-2 rounded bg-green-50 text-green-700 text-sm border border-green-100">
          Payment sent via {success === 'apple' ? 'Apple Pay' : success === 'google' ? 'Google Pay' : 'Card'}. Awaiting manager confirmation.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <PaymentBrandButton brand="apple" onClick={() => handlePay('apple')} disabled={Boolean(processing)} />
        <PaymentBrandButton brand="google" onClick={() => handlePay('google')} disabled={Boolean(processing)} />
        <PaymentBrandButton brand="card" onClick={() => handlePay('card')} disabled={Boolean(processing)} />
      </div>

      {processing && (
        <p className="text-xs text-gray-500 mt-2">Processing {processing} payment...</p>
      )}
    </div>
  );
}
