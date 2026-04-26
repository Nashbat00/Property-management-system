import { useEffect, useState } from 'react';

// Visual replica of the Apple Pay payment sheet.
// No real card is charged - this is for demonstration only.
export default function ApplePaySheet({ amount, month, onConfirm, onCancel }) {
  const [stage, setStage] = useState('ready'); // ready | confirming | done

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-neutral-900 text-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 12.04c-.03-3.16 2.58-4.68 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.94-.2-3.79 1.14-4.78 1.14-.99 0-2.51-1.11-4.13-1.08-2.12.03-4.08 1.23-5.17 3.13-2.21 3.83-.56 9.5 1.59 12.61 1.05 1.52 2.3 3.23 3.94 3.17 1.59-.06 2.18-1.03 4.1-1.03 1.92 0 2.46 1.03 4.13.99 1.71-.03 2.79-1.55 3.83-3.08 1.21-1.77 1.71-3.49 1.74-3.58-.04-.02-3.34-1.28-3.38-5.04zM14.4 3.07c.88-1.07 1.47-2.55 1.31-4.03-1.27.05-2.81.85-3.71 1.91-.81.94-1.52 2.45-1.33 3.9 1.42.11 2.85-.72 3.73-1.78z" />
            </svg>
            <span>Pay</span>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-neutral-300"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 mt-4 space-y-3">
          <button className="w-full bg-neutral-800 rounded-xl px-4 py-3 flex items-center gap-3 text-left">
            <div className="w-12 h-8 bg-amber-200 rounded-md flex items-center justify-center text-[10px] font-bold text-neutral-800">
              VISA
            </div>
            <span className="flex-1 font-medium">D360 Beige Debit (Visa)</span>
            <span className="text-neutral-400">•••• 3810</span>
          </button>

          <button className="w-full bg-neutral-800 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="font-medium">Change Payment Method</span>
            <span className="text-neutral-500">›</span>
          </button>
        </div>

        <div className="px-5 mt-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-neutral-400">Pay Demo (Card is not charged)</p>
              <p className="text-2xl font-bold mt-1">${amount.toFixed(2)}</p>
              <p className="text-xs text-neutral-500 mt-1">For dues - {month}</p>
            </div>
            <span className="text-neutral-500 mb-1">›</span>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-5 px-5 py-6 flex flex-col items-center">
          {stage === 'ready' && (
            <>
              <button
                onClick={handleConfirm}
                className="w-14 h-14 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-colors"
                aria-label="Confirm with Side Button"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M16 6 L7 12 L16 18" />
                </svg>
              </button>
              <p className="text-sm mt-2 text-neutral-300">Confirm with Side Button</p>
            </>
          )}
          {stage === 'confirming' && (
            <>
              <div className="w-14 h-14 rounded-full border-2 border-blue-400 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm mt-2 text-neutral-300">Authorizing...</p>
            </>
          )}
          {stage === 'done' && (
            <>
              <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl">
                ✓
              </div>
              <p className="text-sm mt-2 text-neutral-300">Done</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
