import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {AiTransactionSuggestion} from '@nest-wise/contracts';

interface CategoryFieldProps {
  suggestion: AiTransactionSuggestion | undefined;
  categories: {id: string; name: string}[] | undefined;
  value: string | null;
  onChange: (value: string | null) => void;
  error?: string;
}

export function CategoryField({suggestion, categories, value, onChange, error}: CategoryFieldProps) {
  const showNewCategoryBanner = suggestion?.newCategorySuggested && suggestion.suggestedCategory.newCategoryName;

  return (
    <div className="space-y-2">
      <Label htmlFor="categoryId">
        Kategorija <span className="text-red-500">*</span>
      </Label>

      {showNewCategoryBanner && (
        <div className="p-3 bg-success/10 border border-success/20 rounded-md">
          <p className="text-sm text-success">
            <strong>Nova kategorija:</strong> {suggestion.suggestedCategory.newCategoryName}
          </p>
          <p className="text-xs text-success/80 mt-1">
            Ova kategorija će biti automatski kreirana ako ne izaberete drugu
          </p>
        </div>
      )}

      <Select value={value ?? ''} onValueChange={(val) => onChange(val || null)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Izaberi kategoriju" />
        </SelectTrigger>
        <SelectContent>
          {(categories ?? []).length === 0 && (
            <span className="text-sm text-muted-foreground p-2">Nema dostupnih kategorija.</span>
          )}
          {(categories ?? []).map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
