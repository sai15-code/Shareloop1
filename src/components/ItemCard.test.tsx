import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ItemCard } from './ItemCard';
import type { ItemListing } from '../types';

const item: ItemListing = {
  id: 'test-listing-1',
  title: 'Community bookshelf',
  category: 'Furniture',
  subCategory: 'Bookshelves',
  condition: 'Gently Used',
  conditionDescription: 'Good condition',
  handoverProtocol: 'Porch Pickup',
  neighborhood: 'North Park',
  timeAgo: 'Just now',
  description: 'A sturdy bookshelf ready for a new home.',
  image: 'https://example.test/bookshelf.jpg',
  altText: 'Wooden bookshelf',
  donor: {
    name: 'A neighbor',
    avatar: 'https://example.test/avatar.jpg',
    rehomedCount: 2,
    badge: 'verified',
  },
};

describe('ItemCard', () => {
  afterEach(cleanup);

  it('shows listing details and keeps listings with unavailable distance visible', () => {
    render(<ItemCard item={item} onDetailsClick={vi.fn()} onClaimClick={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Community bookshelf' })).toBeTruthy();
    expect(screen.getByText(/Distance unavailable/)).toBeTruthy();
    expect(screen.getByText(/North Park/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Claim/ })).toBeTruthy();
  });

  it('opens details and starts a claim from their corresponding actions', () => {
    const onDetailsClick = vi.fn();
    const onClaimClick = vi.fn();
    render(<ItemCard item={item} onDetailsClick={onDetailsClick} onClaimClick={onClaimClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    fireEvent.click(screen.getByRole('button', { name: /Claim/ }));

    expect(onDetailsClick).toHaveBeenCalledOnce();
    expect(onDetailsClick).toHaveBeenCalledWith(item);
    expect(onClaimClick).toHaveBeenCalledOnce();
    expect(onClaimClick).toHaveBeenCalledWith(item);
  });
});
