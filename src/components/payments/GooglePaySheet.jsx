import { useEffect, useState } from 'react';

// Visual replica of the Google Pay payment sheet.
// No real card is charged - this is for demonstration only.
export default function GooglePaySheet({ amount, month, onConfirm, onCancel }) {
  const [stage, setStage] = useState('ready');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  function handleConfirm() {
    if (stage !== 'ready') return;
    setStage('confirming');
    setTimeout(() => {
      setStage('done');
      setTimeout(() => onConfirm(), 700);
    }, 1100);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M12.5 11v3h7c-.3 1.7-2 5-7 5-4.2 0-7.6-3.5-7.6-7.8s3.4-7.8 7.6-7.8c2.4 0 4 1 4.9 1.9l3.3-3.2C18.7 0 15.9-1 12.5-1 5.6-1 0 4.6 0 11.5S5.6 24 12.5 24c7.2 0 12-5 12-12.1 0-.8-.1-1.4-.2-2H12.5z"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900">
              <span className="text-[#4285F4]">G</span> Pay
            </span>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 text-xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pay HomeLink</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${amount.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Test mode - no card will be charged</p>
        </div>

        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500 mb-2">PAYMENT METHOD</p>
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">VISA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
              <p className="text-xs text-gray-500">Test card</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-500 mb-1">FOR</p>
          <p className="text-sm text-gray-800">Monthly dues - {month}</p>
        </div>

        <div className="px-5 py-4">
          {stage === 'ready' && (
            <button
              onClick={handleConfirm}
              className="w-full bg-black text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M12.5 11v3h7c-.3 1.7-2 5-7 5-4.2 0-7.6-3.5-7.6-7.8s3.4-7.8 7.6-7.8c2.4 0 4 1 4.9 1.9l3.3-3.2C18.7 0 15.9-1 12.5-1 5.6-1 0 4.6 0 11.5S5.6 24 12.5 24c7.2 0 12-5 12-12.1 0-.8-.1-1.4-.2-2H12.5z"/>
              </svg>
              Pay
            </button>
          )}
          {stage === 'confirming' && (
            <button disabled className="w-full bg-gray-200 text-gray-600 rounded-full py-3 font-semibold flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              Processing...
            </button>
          )}
          {stage === 'done' && (
            <button disabled className="w-full bg-green-600 text-white rounded-full py-3 font-semibold flex items-center justify-center gap-2">
              ✓ Payment authorized
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
