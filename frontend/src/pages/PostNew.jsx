import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Page, PageHeader } from '@/components/Page';
import { FileUpload } from '@/components/FileUpload';
import { CITY_NAMES, POST_CATEGORIES } from '@/lib/constants';
import { createPost } from '@/lib/db';
import { uploadFile } from '@/lib/api';
import { friendlyError } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, errorCls, inputCls, labelCls } from '@/lib/ui';

export default function PostNew() {
  const { user, profile, authorInfo } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [images, setImages] = useState([]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { category: 'general', city: profile?.city || '' } });

  const onSubmit = async (v) => {
    try {
      const imageUrls = (await Promise.all(images.map((f) => uploadFile(f, user.uid)))).map((r) => r.url);
      const ref = await createPost({ title: v.title.trim(), content: v.content.trim(), category: v.category, city: v.city, author: authorInfo, imageUrls });
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created');
      navigate(`/community/${ref.id}`);
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <Page className="max-w-3xl" testId="post-new-page">
      <PageHeader eyebrow="New post" title="Start a thread" subtitle="Be specific — city, dates, prices — and you'll get better replies." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-line bg-panel p-6 shadow-card sm:p-8" data-testid="post-form">
        <div>
          <label className={labelCls}>Title</label>
          <input data-testid="post-title-input" className={inputCls} placeholder="Looking for a flatmate near Rangueil (Sept)" {...register('title', { required: 'Title is required', maxLength: { value: 140, message: 'Max 140 characters' } })} />
          {errors.title && <p className={errorCls}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Content</label>
          <textarea data-testid="post-content-input" rows={7} className={inputCls} placeholder="Details, budget, contact preferences…" {...register('content', { required: 'Content is required' })} />
          {errors.content && <p className={errorCls}>{errors.content.message}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Category</label>
            <select data-testid="post-category-input" className={inputCls} {...register('category')}>
              {POST_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>City</label>
            <select data-testid="post-city-input" className={inputCls} {...register('city', { required: 'Choose a city' })}>
              <option value="">Select a city</option>
              {CITY_NAMES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.city && <p className={errorCls}>{errors.city.message}</p>}
          </div>
        </div>
        <div>
          <label className={labelCls}>Images <span className="text-ink-muted">(optional, up to 4)</span></label>
          <FileUpload multiple onChange={setImages} label="Add images" testId="post-image-input" />
        </div>
        <button data-testid="post-submit-button" disabled={isSubmitting} className={`${btnPrimary} w-full sm:w-auto`}>{isSubmitting ? 'Posting…' : 'Publish post'}</button>
      </form>
    </Page>
  );
}
