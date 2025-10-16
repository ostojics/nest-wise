import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {IconPencil} from '@tabler/icons-react';
import {useState} from 'react';

interface SuggestedCategoryProps {
  value: string | null;
  onChange: (value: string | null) => void;
  error: string | null;
}

export function SuggestedCategory({value, onChange}: SuggestedCategoryProps) {
  const [isEditMode, setIsEditMode] = useState(false);

  if (isEditMode) {
    return (
      <div className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="suggestedCategoryName">Predložena kategorija</Label>
          <Input id="suggestedCategoryName" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </div>
        <Button size="sm" className="text-xs" onClick={() => setIsEditMode(false)}>
          Sačuvajte
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="p-3 bg-success/10 border border-success/20 rounded-md">
        <div className="flex items-center justify-between">
          <p className="text-sm text-success">
            <strong>Nova kategorija:</strong>
            <br /> {value}
          </p>
          <Button size="sm" variant="ghost" onClick={() => setIsEditMode(true)}>
            <IconPencil />
            <span className="sr-only">Izmeni</span>
          </Button>
        </div>
        <p className="text-xs text-success/80 mt-3">
          Ova kategorija će biti automatski kreirana ako ne izaberete drugu
        </p>
      </div>
    </div>
  );
}
