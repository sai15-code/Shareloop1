import React, { useState, useRef } from 'react';
import { ItemListing, CategoryType, ConditionType, HandoverType } from '../types';
import { USER_PROFILE } from '../data/mockData';
import { CustomSelect, Option } from './CustomSelect';

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (newItem: ItemListing) => void | Promise<void>;
}

const CATEGORY_OPTIONS: Option<CategoryType>[] = [
  { id: 'Furniture', label: 'Furniture' },
  { id: 'Electronics', label: 'Electronics' },
  { id: 'Kitchen & Dining', label: 'Kitchen & Dining' },
  { id: 'Clothing & Shoes', label: 'Clothing & Shoes' },
  { id: 'Tools & Hardware', label: 'Tools & Hardware' },
  { id: 'Books & Media', label: 'Books & Media' }
];

const CONDITION_OPTIONS: Option<ConditionType>[] = [
  { id: 'Like New (Flawless)', label: 'Like New (Flawless)' },
  { id: 'Brand New (In Box)', label: 'Brand New (In Box)' },
  { id: 'Gently Used', label: 'Gently Used' },
  { id: 'Functional / Needs TLC', label: 'Functional / Needs TLC' }
];

const PROTOCOL_OPTIONS: Option<HandoverType>[] = [
  { id: 'Porch Pickup', label: 'Porch Pickup (Contactless)', icon: 'deck' },
  { id: 'Public Meetup', label: 'Public Meetup', icon: 'groups' },
  { id: 'Curbside Alert', label: 'Curbside Alert', icon: 'signpost' }
];

const NEIGHBORHOOD_CHOICES: Option[] = [
  { id: 'Seattle Central', label: 'Seattle Central' },
  { id: 'Capitol Hill', label: 'Capitol Hill' },
  { id: 'Fremont', label: 'Fremont' },
  { id: 'Ballard', label: 'Ballard' },
  { id: 'Queen Anne', label: 'Queen Anne' },
  { id: 'Downtown', label: 'Downtown' },
  { id: 'Wallingford', label: 'Wallingford' },
  { id: 'Beacon Hill', label: 'Beacon Hill' }
];

const PRESET_PHOTOS = [
  {
    label: 'Wood Furniture',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Electronics / Desk',
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Apparel / Fleece',
    url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Kitchenware',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: 'Tools & Hardware',
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
  }
];

export const PostItemModal: React.FC<PostItemModalProps> = ({ isOpen, onClose, onAddItem }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Furniture');
  const [condition, setCondition] = useState<ConditionType>('Like New (Flawless)');
  const [protocol, setProtocol] = useState<HandoverType>('Porch Pickup');
  const [neighborhood, setNeighborhood] = useState('Seattle Central');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoSourceMode, setPhotoSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [dimensions, setDimensions] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Process chosen file
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, etc.)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        setUploadedFileName(file.name);
        setPhotoSourceMode('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!title.trim() || !description.trim()) return;
    if (imageUrl.startsWith('data:')) {
      setFormError('Device uploads need image storage, which is not configured yet. Choose a preset or use a public image URL.');
      return;
    }
    setFormError('');

    const finalImage = imageUrl.trim() || PRESET_PHOTOS[0].url;

    const newItem: ItemListing = {
      id: `item-${Date.now()}`,
      title,
      category,
      subCategory: category === 'Furniture' ? 'Furniture & Living' : category,
      condition,
      conditionDescription:
        condition === 'Like New (Flawless)' ? 'No visible marks or flaws' : 'Normal cosmetic wear',
      handoverProtocol: protocol,
      distance: 0.4,
      neighborhood,
      timeAgo: 'Just now',
      description,
      image: finalImage,
      altText: title,
      donor: {
        name: USER_PROFILE.name,
        avatar: USER_PROFILE.avatar,
        rehomedCount: USER_PROFILE.rehomedItems + 1,
        badge: 'verified'
      },
      dimensions: dimensions || 'Standard size',
      claimed: false,
      mapCoords: { x: 48, y: 46 }
    };

    setIsSubmitting(true);
    try {
      await onAddItem(newItem);
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to publish this listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-[#121215] border border-[#27272a] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#18181b]/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a78bfa] text-xl font-bold">
              add_circle
            </span>
            <h3 className="text-[17px] font-semibold text-[#fafafa]">
              Post an Item for Circulation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {formError && <p role="alert" className="text-sm text-amber-300 bg-amber-950/30 border border-amber-800 rounded-xl p-3">{formError}</p>}
          {/* Item Title */}
          <div>
            <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
              Item Title *
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={120}
              placeholder="e.g. Solid Birch Wood Side Table"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2.5 text-[14px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">Category</label>
              <CustomSelect
                value={category}
                onChange={(val) => setCategory(val as CategoryType)}
                options={CATEGORY_OPTIONS}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">Condition</label>
              <CustomSelect
                value={condition}
                onChange={(val) => setCondition(val as ConditionType)}
                options={CONDITION_OPTIONS}
              />
            </div>
          </div>

          {/* Handover & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
                Handover Protocol
              </label>
              <CustomSelect
                value={protocol}
                onChange={(val) => setProtocol(val as HandoverType)}
                options={PROTOCOL_OPTIONS}
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
                Neighborhood Hub
              </label>
              <CustomSelect
                value={neighborhood}
                onChange={(val) => setNeighborhood(val)}
                options={NEIGHBORHOOD_CHOICES}
                icon="location_on"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
              Description *
            </label>
            <textarea
              required
              minLength={10}
              maxLength={3000}
              rows={3}
              placeholder="Tell neighbors about the condition, story, or why you're passing it on..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-3 text-[13px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa] resize-none"
            />
          </div>

          {/* PHOTO UPLOAD & SELECTION SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-semibold text-[#a1a1aa]">
                Item Photo *
              </label>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#09090b] p-0.5 rounded-lg border border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setPhotoSourceMode('upload')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    photoSourceMode === 'upload'
                      ? 'bg-[#1e1e22] text-[#a78bfa]'
                      : 'text-[#a1a1aa] hover:text-[#fafafa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">upload</span>
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoSourceMode('preset')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    photoSourceMode === 'preset'
                      ? 'bg-[#1e1e22] text-[#a78bfa]'
                      : 'text-[#a1a1aa] hover:text-[#fafafa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">collections</span>
                  <span>Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoSourceMode('url')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    photoSourceMode === 'url'
                      ? 'bg-[#1e1e22] text-[#a78bfa]'
                      : 'text-[#a1a1aa] hover:text-[#fafafa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">link</span>
                  <span>URL</span>
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* MODE 1: Direct File Upload Zone */}
            {photoSourceMode === 'upload' && (
              <div>
                {imageUrl && uploadedFileName ? (
                  /* Uploaded Image Preview */
                  <div className="relative rounded-2xl overflow-hidden border border-[#a78bfa]/50 bg-[#18181b] p-3 flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Uploaded preview"
                      className="w-20 h-20 rounded-xl object-cover border border-[#27272a]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#34d399] font-semibold mb-0.5">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        <span>Photo Uploaded Successfully</span>
                      </div>
                      <p className="text-[13px] text-[#fafafa] font-medium truncate">
                        {uploadedFileName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Change Photo
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-3 py-1 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Drag & Drop File Upload Box */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isDragging
                        ? 'border-[#a78bfa] bg-[#7c3aed]/10 scale-[0.99]'
                        : 'border-[#27272a] hover:border-[#a78bfa]/60 bg-[#18181b]/50 hover:bg-[#18181b]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#1e1e22] text-[#a78bfa] flex items-center justify-center mb-2 shadow-inner">
                      <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                    </div>
                    <div className="text-[13px] font-semibold text-[#fafafa]">
                      Click to upload photo or drag &amp; drop
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                      Supports JPG, PNG, WebP or HEIC from your device
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: Presets Grid */}
            {photoSourceMode === 'preset' && (
              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_PHOTOS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setImageUrl(preset.url);
                        setUploadedFileName(null);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        imageUrl === preset.url
                          ? 'border-[#a78bfa] ring-2 ring-[#a78bfa]/50 scale-95'
                          : 'border-[#27272a] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#a1a1aa]">
                  Select a category preset photo if you don't have a photo on hand.
                </p>
              </div>
            )}

            {/* MODE 3: Image URL Input */}
            {photoSourceMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setUploadedFileName(null);
                  }}
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-[13px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
                />
                {imageUrl && (
                  <div className="flex items-center gap-2 p-2 bg-[#18181b] rounded-xl border border-[#27272a]">
                    <img
                      src={imageUrl}
                      alt="URL preview"
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <span className="text-[12px] text-[#a1a1aa] truncate">{imageUrl}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dimensions / Size */}
          <div>
            <label className="block text-[12px] font-semibold text-[#a1a1aa] mb-1">
              Dimensions / Size (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 36 in x 24 in, fits in compact hatchback"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-2 text-[13px] text-[#fafafa] focus:outline-none focus:border-[#a78bfa]"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#c4b5fd] disabled:opacity-50 text-[#09090b] text-[13px] font-bold transition-all shadow-[0_0_15px_rgba(167,139,250,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base font-bold">{isSubmitting ? 'hourglass_top' : 'send'}</span>
              <span>{isSubmitting ? 'Publishing…' : 'Publish Free Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
