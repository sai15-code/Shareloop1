import React, { useState } from 'react';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  radius: number;
  neighborhood: string;
  onSuccess: (term: string, notifyByEmail: boolean) => Promise<void>;
}

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ isOpen, onClose, radius, neighborhood, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState('Solid Wood Desk');
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      await onSuccess(searchTerm, notifyByEmail);
      setSubmitted(true);
      setTimeout(() => { onClose(); setSubmitted(false); }, 1600);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save alert'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#121215] border border-[#27272a] rounded-3xl p-6 text-left shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl">notifications_active</span>
            <h3 className="text-[16px] font-semibold text-[#fafafa]">Set Neighborhood Search Alert</h3>
          </div>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-[#fafafa] p-1 cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
                Notify me when someone posts:
              </label>
              <input
                type="text"
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2.5 text-[14px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
              />
            </div>

            <div className="p-3 bg-[#18181b] rounded-xl border border-[#27272a] text-[12px] text-[#a1a1aa]">
              Radius: <strong className="text-[#fafafa] font-semibold">{radius} miles</strong> around {neighborhood}.
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyByEmail}
                onChange={(e) => setNotifyByEmail(e.target.checked)}
                className="w-4 h-4 rounded bg-[#1e1e22] accent-[#a78bfa]"
              />
              <span className="text-[12px] text-[#fafafa]">Email me when notifications are available (delivery is not configured yet)</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#27272a] text-[#a1a1aa] text-[13px] hover:text-[#fafafa] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-semibold transition-all cursor-pointer"
              >
                {saving ? 'Saving…' : 'Save Alert'}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center text-[#34d399] font-medium text-[14px]">
            Alert saved for "{searchTerm}". Notification delivery is not configured yet.
          </div>
        )}
      </div>
    </div>
  );
};

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (req: string, category: string) => Promise<void>;
}

export const PostRequestModal: React.FC<PostRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [requestText, setRequestText] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;
    setError(''); setSaving(true);
    try { await onSuccess(requestText, category); setSubmitted(true); setTimeout(() => { onClose(); setSubmitted(false); }, 1600); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save request'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#121215] border border-[#27272a] rounded-3xl p-6 text-left shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl">campaign</span>
            <h3 className="text-[16px] font-semibold text-[#fafafa]">Post a "Looking For" Request</h3>
          </div>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-[#fafafa] p-1 cursor-pointer">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-3 py-2 text-[13px] text-[#fafafa]"
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Kitchen & Dining">Kitchen & Dining</option>
                <option value="Tools & Hardware">Tools & Hardware</option>
                <option value="Clothing & Shoes">Clothing & Shoes</option>
                <option value="Books & Media">Books & Media</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
                What are you looking for?
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Looking for a solid wood desk or drafting table for home study before buying new..."
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-[13px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa] resize-none"
              />
            </div>

            <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
              This request will be saved to your account. Automatic neighbor notifications are not configured yet.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#27272a] text-[#a1a1aa] text-[13px] hover:text-[#fafafa] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] text-[#09090b] text-[13px] font-semibold transition-all cursor-pointer"
              >
                {saving ? 'Saving…' : 'Save Request'}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center text-[#34d399] font-medium text-[14px]">
            Request saved. Neighbors are not notified automatically yet.
          </div>
        )}
      </div>
    </div>
  );
};
