import { useEffect, useMemo, useState } from 'react';
import CardBrandLogo from './CardBrandLogo';
import {
  BRAND_CVC_LENGTH,
  BRAND_LENGTHS,
  detectBrand,
  formatCardNumber,
  passesLuhn,
} from './cardBrand';

const BRAND_NAMES = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  jcb: 'JCB',
  diners: 'Diners Club',
};

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CardPaymentSheet({ amount, month, onConfirm, onCancel }) {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [stage, setStage] = useState('ready'); // ready | processing | done
  const [error, setError] = useState('');

  const brand = useMemo(() => detectBrand(number), [number]);
  const requiredLength = brand ? BRAND_LENGTHS[brand] : 16;
  const cvcLength = brand ? BRAND_CVC_LENGTH[brand] : 3;

  const cleanedDigits = number.replace(/\D/g, '');
  const cardComplete = cleanedDigits.length === requiredLength;
  const expiryComplete = /^\d{2}\/\d{2}$/.test(expiry);
  const cvcComplete = cvc.length === cvcLength;
  const formValid = cardComplete && expiryComplete && cvcComplete && name.trim().length > 1;

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && stage === 'ready') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, stage]);

  function handleNumberChange(e) {
    const next = formatCardNumber(e.target.value, detectBrand(e.target.value));
    setNumber(next);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!formValid) {
      setError('Please complete all card fields.');
      return;
    }
    if (!passesLuhn(number)) {
      setError('This card number is not valid.');
      return;
    }
    setStage('processing');
    setTimeout(() => {
      setStage('done');
      setTimeout(() => onConfirm(), 700);
    }, 1100);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pay HomeLink</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">${amount.toFixed(2)}</p>
            <p className="text-xs text-gray-400">For dues - {month}</p>
          </div>
          <button
            onClick={onCancel}
            disabled={stage !== 'ready'}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl disabled:opacity-50"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs text-gray-500">Card number</label>
              <div className="flex items-center gap-1.5">
                {['visa', 'mastercard', 'amex', 'discover', 'jcb'].map((b) => (
                  <div
                    key={b}
                    className={`transition-all ${
                      brand && brand !== b ? 'opacity-25 grayscale' : 'opacity-100'
                    } ${brand === b ? 'scale-110' : ''}`}
                  >
                    <CardBrandLogo brand={b} className="w-8 h-5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={number}
                onChange={handleNumberChange}
                className="input-field pr-16 font-mono tracking-wide"
              />
              <div className="absolute top-1/2 right-2 -translate-y-1/2">
                <CardBrandLogo brand={brand} />
              </div>
            </div>
            {brand && (
              <p className="text-[11px] text-gray-500 mt-1">
                Detected: <span className="font-semibold text-gray-700">{BRAND_NAMES[brand]}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Name on card</label>
            <input
              type="text"
              autoComplete="cc-name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="12/27"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="input-field font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {brand === 'amex' ? 'CID' : 'CVC'}
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={brand === 'amex' ? '4 digits' : '3 digits'}
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, cvcLength))}
                className="input-field font-mono"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          {stage === 'ready' && (
            <button
              type="submit"
              disabled={!formValid}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg py-3 font-semibold transition-colors"
            >
              Pay ${amount.toFixed(2)}
            </button>
          )}
          {stage === 'processing' && (
            <button disabled className="w-full bg-gray-800 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </button>
          )}
          {stage === 'done' && (
            <button disabled className="w-full bg-green-600 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2">
              ✓ Payment authorized
            </button>
          )}

          <p className="text-[10px] text-gray-400 text-center">
            Demo only - no real charge will be made.
          </p>
        </form>
      </div>
    </div>
  );
}
