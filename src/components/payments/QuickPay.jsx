import { useState } from 'react';
import ApplePaySheet from './ApplePaySheet';
import GooglePaySheet from './GooglePaySheet';

function ApplePayButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 bg-black text-white rounded-lg h-12 flex items-center justify-center gap-2 font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 12.04c-.03-3.16 2.58-4.68 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.94-.2-3.79 1.14-4.78 1.14-.99 0-2.51-1.11-4.13-1.08-2.12.03-4.08 1.23-5.17 3.13-2.21 3.83-.56 9.5 1.59 12.61 1.05 1.52 2.3 3.23 3.94 3.17 1.59-.06 2.18-1.03 4.1-1.03 1.92 0 2.46 1.03 4.13.99 1.71-.03 2.79-1.55 3.83-3.08 1.21-1.77 1.71-3.49 1.74-3.58-.04-.02-3.34-1.28-3.38-5.04zM14.4 3.07c.88-1.07 1.47-2.55 1.31-4.03-1.27.05-2.81.85-3.71 1.91-.81.94-1.52 2.45-1.33 3.9 1.42.11 2.85-.72 3.73-1.78z" />
      </svg>
      <span>Pay</span>
    </button>
  );
}

function GooglePayButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 bg-black text-white rounded-lg h-12 flex items-center justify-center gap-2 font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span>Pay</span>
    </button>
  );
}

function CardButton({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 bg-primary-600 text-white rounded-lg h-12 flex items-center justify-center gap-2 font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
      <span>Pay with Card</span>
    </button>
  );
}

export default function QuickPay({ amount, month, onPay }) {
  const [activeSheet, setActiveSheet] = useState(null); // 'apple' | 'google' | null
  const [success, setSuccess] = useState('');

  function complete(brand) {
    setActiveSheet(null);
    onPay(brand);
    setSuccess(brand);
    setTimeout(() => setSuccess(''), 4000);
  }

  function handleCard() {
    onPay('card');
    setSuccess('card');
    setTimeout(() => setSuccess(''), 4000);
  }

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-1">Quick Pay</h3>
      <p className="text-xs text-gray-500 mb-3">
        Pay <span className="font-semibold">${amount}</span> for {month} using your preferred method.
      </p>

      {success && (
        <div className="mb-3 p-2 rounded bg-green-50 text-green-700 text-sm border border-green-100">
          Payment authorized via{' '}
          {success === 'apple' ? 'Apple Pay' : success === 'google' ? 'Google Pay' : 'Card'}.
          Awaiting manager confirmation.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <ApplePayButton onClick={() => setActiveSheet('apple')} disabled={Boolean(activeSheet)} />
        <GooglePayButton onClick={() => setActiveSheet('google')} disabled={Boolean(activeSheet)} />
        <CardButton onClick={handleCard} disabled={Boolean(activeSheet)} />
      </div>

      <p className="text-[11px] text-gray-400 mt-2">
        Demo only - no real card will be charged.
      </p>

      {activeSheet === 'apple' && (
        <ApplePaySheet
          amount={amount}
          month={month}
          onConfirm={() => complete('apple')}
          onCancel={() => setActiveSheet(null)}
        />
      )}
      {activeSheet === 'google' && (
        <GooglePaySheet
          amount={amount}
          month={month}
          onConfirm={() => complete('google')}
          onCancel={() => setActiveSheet(null)}
        />
      )}
    </div>
  );
}
