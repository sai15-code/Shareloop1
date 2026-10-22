import React, { useState } from 'react';
import { ItemListing } from '../types';

export interface OwnerClaim {
  id: string;
  status: string;
  claimantName: string;
  pickupWindow?: { start: string; end: string };
  note?: string;
  listingId: string;
  listingTitle: string;
}

interface MyListingsViewProps {
  listings: ItemListing[];
  claims: OwnerClaim[];
  onUpdate: (id: string, changes: { title: string; description: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClaimStatus: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
  onBack: () => void;
}

export const MyListingsView: React.FC<MyListingsViewProps> = ({ listings, claims, onUpdate, onDelete, onClaimStatus, onBack }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = async (id: string, action: () => Promise<void>) => {
    setBusyId(id); setError('');
    try { await action(); } catch (e) { setError(e instanceof Error ? e.message : 'Action failed'); }
    finally { setBusyId(null); }
  };

  return <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 text-left">
    <button onClick={onBack} className="mb-6 text-sm text-[#a78bfa]">← Back to Explore Listings</button>
    <h1 className="text-2xl font-semibold mb-2">My Listings</h1>
    <p className="text-sm text-[#a1a1aa] mb-6">Manage items you posted and review claims from neighbors.</p>
    {error && <p role="alert" className="mb-4 text-sm text-red-300">{error}</p>}
    <h2 className="text-lg font-semibold mb-3">Incoming claims</h2>
    {claims.length === 0 ? <p className="text-sm text-[#a1a1aa] mb-8">No claims on your listings.</p> : <div className="space-y-3 mb-8">{claims.map((claim) => <article key={claim.id} className="rounded-2xl border border-[#27272a] bg-[#121215] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">{claim.listingTitle}</h3><p className="text-sm text-[#a1a1aa]">Claim from {claim.claimantName} · {claim.status}</p>{claim.pickupWindow && <p className="text-xs text-[#a1a1aa] mt-1">{new Date(claim.pickupWindow.start).toLocaleString()} – {new Date(claim.pickupWindow.end).toLocaleString()}</p>}{claim.note && <p className="text-sm mt-2">{claim.note}</p>}</div>
      {claim.status === 'pending' && <div className="flex gap-2"><button disabled={busyId === claim.id} onClick={() => run(claim.id, () => onClaimStatus(claim.id, 'rejected'))} className="rounded-lg border border-[#3f3f46] px-3 py-2 text-sm">Reject</button><button disabled={busyId === claim.id} onClick={() => run(claim.id, () => onClaimStatus(claim.id, 'accepted'))} className="rounded-lg bg-[#a78bfa] px-3 py-2 text-sm text-black">Accept</button></div>}</div>
    </article>)}</div>}
    <h2 className="text-lg font-semibold mb-3">Your items</h2>
    {listings.length === 0 ? <p className="text-sm text-[#a1a1aa]">You have not posted any items yet.</p> : <div className="space-y-3">{listings.map((item) => <article key={item.id} className="rounded-2xl border border-[#27272a] bg-[#121215] p-4">
      {editingId === item.id ? <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void run(item.id, async () => { await onUpdate(item.id, { title: String(form.get('title')), description: String(form.get('description')) }); setEditingId(null); }); }}><input name="title" required minLength={3} maxLength={120} defaultValue={item.title} className="w-full rounded-lg bg-[#18181b] p-2"/><textarea name="description" required minLength={10} maxLength={3000} defaultValue={item.description} className="w-full rounded-lg bg-[#18181b] p-2"/><button disabled={busyId === item.id} className="rounded-lg bg-[#a78bfa] px-3 py-2 text-sm text-black">Save</button> <button type="button" onClick={() => setEditingId(null)} className="px-3 py-2 text-sm">Cancel</button></form> : <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-[#a1a1aa]">{item.neighborhood} · {item.category} · {item.claimed ? 'Claimed' : 'Available'}</p><p className="mt-1 text-sm">{item.description}</p></div><div className="flex gap-2"><button disabled={item.claimed || busyId === item.id} onClick={() => setEditingId(item.id)} className="rounded-lg border border-[#3f3f46] px-3 py-2 text-sm disabled:opacity-40">Edit</button><button disabled={item.claimed || busyId === item.id} onClick={() => { if (window.confirm(`Delete “${item.title}”?`)) void run(item.id, () => onDelete(item.id)); }} className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-300 disabled:opacity-40">Delete</button></div></div>}
    </article>)}</div>}
  </div>;
};
