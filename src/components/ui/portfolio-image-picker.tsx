import { useEffect, useState } from 'react';
import { PortfolioService, type PortfolioImage } from '@/lib/supabase';
import Image from 'next/image';
import { Button } from './button';

export default function PortfolioImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    PortfolioService.getImages().then(setImages);
  }, []);

  return (
    <div>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        {value ? 'Change Image' : 'Choose Image'}
      </Button>
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <Image src={value} alt="Selected" width={48} height={48} className="rounded border" />
          <Button type="button" size="sm" variant="ghost" onClick={() => onChange('')}>Remove</Button>
        </div>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold">Select Portfolio Image</h3>
            <div className="grid grid-cols-3 gap-4">
              {images.map(img => (
                <div key={img.id} className="cursor-pointer" onClick={() => { onChange(img.image_url); setOpen(false); }}>
                  <Image src={img.image_url} alt={img.title} width={100} height={100} className="rounded border" />
                </div>
              ))}
            </div>
            <Button type="button" className="mt-4 w-full" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
