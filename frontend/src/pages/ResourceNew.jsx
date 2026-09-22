import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Page, PageHeader } from '@/components/Page';
import { FileUpload } from '@/components/FileUpload';
import { RESOURCE_CATEGORIES } from '@/lib/constants';
import { createResource } from '@/lib/db';
import { uploadFile } from '@/lib/api';
import { friendlyError } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, errorCls, inputCls, labelCls } from '@/lib/ui';

export default function ResourceNew() {
  const { user, authorInfo, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [file, setFile] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { category: 'living' } });

  const onSubmit = async (v) => {
    if (!file && !v.externalLink?.trim()) return toast.error('Add a link or upload a file');
    try {
      let fileUrl = null;
      let fileType = null;
      if (file) {
        const up = await uploadFile(file, user.uid);
        fileUrl = up.url;
        fileType = up.fileType;
      }
      await createResource({
        title: v.title.trim(),
        description: v.description.trim(),
        category: v.category,
        externalLink: v.externalLink?.trim() || null,
        fileUrl,
        fileType,
        uploadedBy: authorInfo,
        tags: v.tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 8),
      }, isAdmin);
      qc.invalidateQueries({ queryKey: ['resources'] });
      toast.success(isAdmin ? 'Resource published' : 'Submitted! It will appear once approved.');
      navigate('/resources');
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <Page className="max-w-3xl" testId="resource-new-page">
      <PageHeader eyebrow="Submit a resource" title="Share what helped you" subtitle="A template, a guide, a list — anything that saves the next student an afternoon." />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-line bg-panel p-6 shadow-card sm:p-8" data-testid="resource-form">
        <div>
          <label className={labelCls}>Title</label>
          <input data-testid="resource-title-input" className={inputCls} placeholder="Halal restaurants in Lyon (2026 list)" {...register('title', { required: 'Title is required' })} />
          {errors.title && <p className={errorCls}>{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea data-testid="resource-description-input" rows={4} className={inputCls} placeholder="What is it and when is it useful?" {...register('description', { required: 'Description is required' })} />
          {errors.description && <p className={errorCls}>{errors.description.message}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Category</label>
            <select data-testid="resource-category-input" className={inputCls} {...register('category')}>
              {RESOURCE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tags <span className="text-ink-muted">(comma-separated)</span></label>
            <input data-testid="resource-tags-input" className={inputCls} placeholder="housing, caf, toulouse" {...register('tags')} />
          </div>
        </div>
        <div>
          <label className={labelCls}>External link <span className="text-ink-muted">(optional)</span></label>
          <input type="url" data-testid="resource-link-input" className={inputCls} placeholder="https://" {...register('externalLink', { pattern: { value: /^https?:\/\/.+/, message: 'Must start with http:// or https://' } })} />
          {errors.externalLink && <p className={errorCls}>{errors.externalLink.message}</p>}
        </div>
        <div>
          <label className={labelCls}>File <span className="text-ink-muted">(optional — PDF, DOCX or image)</span></label>
          <FileUpload onChange={setFile} accept=".pdf,.doc,.docx,image/*" label="Upload a file" hint="PDF, DOCX, PNG or JPG up to 10 MB" testId="resource-file-input" />
        </div>
        {!isAdmin && <p className="rounded-lg bg-warning/10 px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300" data-testid="pending-notice">Submissions are reviewed before appearing publicly. You can see yours in the library with a "Pending" badge.</p>}
        <button data-testid="resource-submit-button" disabled={isSubmitting} className={`${btnPrimary} w-full sm:w-auto`}>{isSubmitting ? 'Submitting…' : 'Submit resource'}</button>
      </form>
    </Page>
  );
}
