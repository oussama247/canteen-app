import React, { useState } from 'react';
import { X, CreditCard, Plus, History, Euro } from 'lucide-react';
import { User, Transaction } from '../types';

interface MealCardModalProps {
  user: User;
  onClose: () => void;
  onRecharge: (amount: number) => void;
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'payment',
    amount: -4.2,
    description: 'Poulet aux herbes de Provence',
    date: '2025-01-12T12:30:00Z'
  },
  {
    id: '2',
    type: 'recharge',
    amount: 50.0,
    description: 'Rechargement carte',
    date: '2025-01-10T09:15:00Z'
  },
  {
    id: '3',
    type: 'payment',
    amount: -5.5,
    description: 'Bœuf bourguignon',
    date: '2025-01-09T12:45:00Z'
  }
];

function luhnCheck(value: string) {
  const sanitized = value.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sanitized.length >= 12 && sum % 10 === 0;
}

export function MealCardModal({ user, onClose, onRecharge }: MealCardModalProps) {
  const [rechargeAmount, setRechargeAmount] = useState<number>(20);
  const [showRecharge, setShowRecharge] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleRecharge = () => {
    setError(null);

    const digitsOnly = cardNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 16) {
      setError('Numéro de carte invalide — veuillez saisir 16 chiffres (format 4 4 4 4).');
      return;
    }
  const safeExpiry = (expiry || '').trim();
  const m = safeExpiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

    if (!m) {
      setError("Date d'expiration invalide (format MM/YY).");
      return;
    }
    const month = parseInt(m[1], 10);
    const year = 2000 + parseInt(m[2], 10);
    const expDate = new Date(year, month - 1, 1);
    const now = new Date();
    if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
      setError("La carte est expirée.");
      return;
    }

    if (!/^[0-9]{3,4}$/.test(cvv)) {
      setError('CVV invalide.');
      return;
    }

    if (rechargeAmount < 5 || rechargeAmount > 500) {
      setError('Le montant doit être entre 5€ et 500€.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const last4 = cardNumber.replace(/\D/g, '').slice(-4).padStart(4, '*');
      const description = `Rechargement carte via ****${last4}`;

      const newTx: Transaction = {
        id: String(Date.now()),
        type: 'recharge',
        amount: rechargeAmount,
        description,
        date: new Date().toISOString()
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsProcessing(false);
      setShowRecharge(false);

      onRecharge(rechargeAmount);

      setCardNumber('');
      setCvv('');
      setError(null);
    }, 1200);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ma Carte Repas</h2>
              <p className="text-sm text-gray-600">Solde et transactions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Solde actuel</h3>
              <Euro className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold">{user.cardBalance.toFixed(2)}€</div>
            <p className="text-green-100 text-sm mt-2">Carte étudiante - {user.name}</p>
          </div>

          {!showRecharge ? (
            <button
              onClick={() => setShowRecharge(true)}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-6"
            >
              <Plus className="w-5 h-5" />
              <span>Recharger ma carte</span>
            </button>
          ) : (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-900 mb-3">Montant & Informations de carte</h4>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[10, 20, 50].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(amount)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rechargeAmount === amount
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {amount}€
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Numéro de carte</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 16))}
                  placeholder="1234567890123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  aria-label="Numéro de carte (simulation)"
                />
                <p className="text-xs text-gray-500 mt-1">Entrée côté client seulement — pas de vérification réelle.</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Titulaire</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    aria-label="Titulaire de la carte"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Date expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, '').slice(0, 5))}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    aria-label="Date d'expiration"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    aria-label="CVV"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="5"
                  max="500"
                />
                <button
                  onClick={handleRecharge}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
                >
                  {isProcessing ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>

              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

              <button
                onClick={() => {
                  setShowRecharge(false);
                  setError(null);
                }}
                className="w-full mt-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Annuler
              </button>

              <p className="text-xs text-gray-500 mt-3">Remarque : ceci est une simulation locale. Aucune donnée n'est envoyée ou vérifiée côté serveur.</p>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <History className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Historique des transactions</h3>
            </div>

            <div className="space-y-3">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{formatDate(transaction.date)}</p>
                  </div>
                  <span
                    className={`font-bold ${
                      transaction.type === 'recharge' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'recharge' ? '+' : ''}{transaction.amount.toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
