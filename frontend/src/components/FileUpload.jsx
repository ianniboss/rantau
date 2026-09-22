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
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-surface px-4 py-8 text-center transition-colors hover:border-my-blue/50 hover:bg-my-blue/5 dark:hover:border-my-yellow/50"
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
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-white shadow"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
