import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { Page, PageHeader } from '@/components/Page';
import { FileUpload } from '@/components/FileUpload';
import { CITY_NAMES, EVENT_CATEGORIES } from '@/lib/constants';
import { createEvent } from '@/lib/db';
import { uploadFile } from '@/lib/api';
import { friendlyError } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, errorCls, inputCls, labelCls } from '@/lib/ui';

export default function EventNew() {
  const { user, profile, authorInfo } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [image, setImage] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { city: profile?.city || '', category: 'social', capacity: 0 } });

  const onSubmit = async (v) => {
    try {
      let imageUrl = '';
      if (image) imageUrl = (await uploadFile(image, user.uid)).url;
      const ref = await createEvent({
        title: v.title.trim(),
        description: v.description.trim(),
        date: Timestamp.fromDate(new Date(v.date)),
        location: { city: v.city, address: v.address.trim(), lat: null, lng: null }, // TODO: geocode when Maps API key is configured
        category: v.category,
        organizer: { ...authorInfo, contact: v.contact?.trim() || user.email },
        imageUrl,
        capacity: Number(v.capacity) || 0,
      });
      qc.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event published!');
      navigate(`/events/${ref.id}`);
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <Page className="max-w-3xl" testId="event-new-page">
      <PageHeader eyebrow="New event" title="Organise something" subtitle="Give people the details they need to show up." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-line bg-panel p-6 shadow-card sm:p-8" data-testid="event-form">
        <div>
          <label className={labelCls}>Title</label>
          <input data-testid="event-title-input" className={inputCls} placeholder="Malaysian Night Toulouse 2026" {...register('title', { required: 'Title is required', maxLength: { value: 120, message: 'Keep it under 120 characters' } })} />
          {errors.title && <p className={errorCls}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea data-testid="event-description-input" rows={5} className={inputCls} placeholder="What's happening, who is it for, what to bring…" {...register('description', { required: 'Description is required' })} />
          {errors.description && <p className={errorCls}>{errors.description.message}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Date & time</label>
            <input type="datetime-local" data-testid="event-date-input" className={inputCls} {...register('date', { required: 'Pick a date' })} />
            {errors.date && <p className={errorCls}>{errors.date.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select data-testid="event-category-input" className={inputCls} {...register('category')}>
              {EVENT_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>City</label>
            <select data-testid="event-city-input" className={inputCls} {...register('city', { required: 'Choose a city' })}>
              <option value="">Select a city</option>
              {CITY_NAMES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.city && <p className={errorCls}>{errors.city.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Address</label>
            <input data-testid="event-address-input" className={inputCls} placeholder="12 Rue Alsace-Lorraine" {...register('address', { required: 'Address is required' })} />
            {errors.address && <p className={errorCls}>{errors.address.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Capacity <span className="text-ink-muted">(0 = unlimited)</span></label>
            <input type="number" min={0} data-testid="event-capacity-input" className={inputCls} {...register('capacity')} />
          </div>
          <div>
            <label className={labelCls}>Contact <span className="text-ink-muted">(optional)</span></label>
            <input data-testid="event-contact-input" className={inputCls} placeholder={user.email} {...register('contact')} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Cover image <span className="text-ink-muted">(optional)</span></label>
          <FileUpload onChange={setImage} testId="event-image-input" />
        </div>
        <button data-testid="event-submit-button" disabled={isSubmitting} className={`${btnPrimary} w-full sm:w-auto`}>
          {isSubmitting ? 'Publishing…' : 'Publish event'}
        </button>
      </form>
    </Page>
  );
}
