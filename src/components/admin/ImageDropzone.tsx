import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';

interface ImageDropzoneProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  urlPlaceholder?: string;
  previewShape?: 'rect' | 'square';
  showUrlInput?: boolean;
  maxSizeMB?: number;
}

const ImageDropzone = ({
  value,
  onChange,
  placeholder = 'Drop an image here or click to browse',
  urlPlaceholder = 'Or paste image URL',
  previewShape = 'rect',
  showUrlInput = true,
  maxSizeMB = 5,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleClick = () => inputRef.current?.click();

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
  };

  const previewClass = previewShape === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative flex ${previewClass} w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors`}
        style={{
          borderColor: isDragging ? 'var(--admin-purple)' : 'var(--admin-border)',
          background: isDragging ? 'var(--admin-purple-light)' : 'var(--admin-bg)',
        }}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-800">
                <FiUpload size={12} /> Replace
              </span>
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
              >
                <FiX size={12} /> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 text-center">
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: isDragging ? 'rgba(139, 123, 232, 0.2)' : 'var(--admin-border)' }}
            >
              <FiImage size={22} style={{ color: isDragging ? 'var(--admin-purple)' : 'var(--admin-text-muted)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
              {isDragging ? 'Drop to upload' : placeholder}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--admin-text-muted)' }}>
              PNG, JPG, GIF, WEBP up to {maxSizeMB}MB
            </p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}

      {showUrlInput && (
        <input
          type="text"
          value={value.startsWith('data:') ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input px-4 py-3 text-sm"
          placeholder={urlPlaceholder}
        />
      )}
    </div>
  );
};

export default ImageDropzone;
