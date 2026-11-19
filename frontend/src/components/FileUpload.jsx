import { useEffect, useState } from 'react';
import { ImagePlus, X, FileText } from 'lucide-react';

export const FileUpload = ({ accept = 'image/*', multiple = false, onChange, label = 'Add image', hint = 'PNG, JPG or WEBP up to 10 MB', testId = 'file-input' }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((f) => (f.type.startsWith('image/') ? URL.createObjectURL(f) : null));
    setPreviews(urls);
    return () => urls.forEach((u) => u && URL.revokeObjectURL(u));
  }, [files]);

  const update = (next) => {
    setFiles(next);
    onChange?.(multiple ? next : next[0] || null);
  };

  return (
    <div>
      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface px-4 py-8 text-center transition-colors hover:border-my-blue/50 hover:bg-my-blue/5 focus-within:border-my-blue focus-within:ring-2 focus-within:ring-my-blue focus-within:ring-offset-2 focus-within:ring-offset-panel dark:hover:border-my-yellow/50 dark:focus-within:border-my-yellow dark:focus-within:ring-my-yellow"
        data-testid={`${testId}-dropzone`}
      >
        <ImagePlus size={24} className="text-ink-muted" />
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-xs text-ink-muted">{hint}</span>
        <input
          type="file"
          data-testid={testId}
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => update(multiple ? [...files, ...Array.from(e.target.files)].slice(0, 4) : Array.from(e.target.files).slice(0, 1))}
        />
      </label>
      {files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3" data-testid={`${testId}-previews`}>
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="relative">
              {previews[i] ? (
                <img src={previews[i]} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-line" />
              ) : (
                <div className="flex h-20 w-32 flex-col items-center justify-center gap-1 rounded-lg bg-surface px-2 text-center ring-1 ring-line">
                  <FileText size={18} className="text-my-blue dark:text-my-yellow" />
                  <span className="w-full truncate text-[10px] text-ink-muted">{f.name}</span>
                </div>
              )}
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => update(files.filter((_, j) => j !== i))}
                className="absolute -right-3.5 -top-3.5 flex h-11 w-11 items-center justify-center transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-my-blue dark:focus-visible:ring-my-yellow rounded-full"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-white shadow">
                  <X size={14} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
