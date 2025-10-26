import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {DatePicker} from '@/components/date-picker';
import {ScheduleRuleFormData, useValidateScheduleRule} from '../../hooks/use-validate-schedule-rule';
import {useScheduleDialogContext} from '../../context/schedule-dialog.context';
import {useCreateScheduledTransaction} from '../../hooks/use-scheduled-transactions';
import {cn, dateAtNoon} from '@/lib/utils';
import {CreateScheduledTransactionRuleHouseholdDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';

const dayOfWeekLabels = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];

export default function Step2Rule() {
  const {setCurrentStep, transactionDetails, resetDialog} = useScheduleDialogContext();

  const createMutation = useCreateScheduledTransaction();

  const {
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useValidateScheduleRule();

  const watchedFrequency = watch('frequencyType');
  const watchedDayOfWeek = watch('dayOfWeek');
  const watchedDayOfMonth = watch('dayOfMonth');
  const watchedStartDate = watch('startDate');

  const onSubmit = async (data: ScheduleRuleFormData) => {
    if (!transactionDetails) {
      return;
    }

    const payload: CreateScheduledTransactionRuleHouseholdDTO = {
      accountId: transactionDetails.accountId,
      categoryId: transactionDetails.categoryId,
      type: transactionDetails.type,
      amount: transactionDetails.amount,
      description: transactionDetails.description,
      frequencyType: data.frequencyType,
      dayOfWeek: data.dayOfWeek,
      dayOfMonth: data.dayOfMonth,
      startDate: data.startDate,
    };

    await createMutation.mutateAsync(payload);
    resetDialog();
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleDayOfWeekSelect = (day: number) => {
    setValue('dayOfWeek', day);
  };

  const handleDayOfMonthSelect = (day: number) => {
    setValue('dayOfMonth', day);
  };

  const handleChangeFrequency = (value: 'weekly' | 'monthly') => {
    const DEFAULT_WEEKDAY = 1; // Monday
    const DEFAULT_MONTH_DAY = 1;

    const applyWeeklyDefaults = () => {
      setValue('dayOfMonth', null);
      if (watchedDayOfWeek == null) {
        setValue('dayOfWeek', DEFAULT_WEEKDAY);
      }
    };

    const applyMonthlyDefaults = () => {
      setValue('dayOfWeek', null);
      if (watchedDayOfMonth == null) {
        setValue('dayOfMonth', DEFAULT_MONTH_DAY);
      }
    };

    setValue('frequencyType', value);

    if (value === 'weekly') {
      applyWeeklyDefaults();
    } else {
      applyMonthlyDefaults();
    }
  };

  const isSubmitting = createMutation.isPending;

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="frequencyType">
          Frekvencija <span className="text-red-500">*</span>
        </Label>
        <Select value={watchedFrequency} onValueChange={handleChangeFrequency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Izaberi frekvenciju" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Nedeljno</SelectItem>
            <SelectItem value="monthly">Mesečno</SelectItem>
          </SelectContent>
        </Select>
        {errors.frequencyType && <p className="text-sm text-red-500">{errors.frequencyType.message}</p>}
      </div>

      {watchedFrequency === 'weekly' && (
        <div className="space-y-2">
          <Label>
            Dan u nedelji <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {dayOfWeekLabels.map((label, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDayOfWeekSelect(index)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  watchedDayOfWeek === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.dayOfWeek && <p className="text-sm text-red-500">{errors.dayOfWeek.message}</p>}
        </div>
      )}

      {watchedFrequency === 'monthly' && (
        <div className="space-y-2">
          <Label>
            Dan u mesecu <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length: 31}, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayOfMonthSelect(day)}
                className={cn(
                  'aspect-square p-2 rounded-md text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  watchedDayOfMonth === day
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                )}
              >
                {day}
              </button>
            ))}
          </div>
          {errors.dayOfMonth && <p className="text-sm text-red-500">{errors.dayOfMonth.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="startDate">
          Datum početka <span className="text-red-500">*</span>
        </Label>
        <DatePicker
          value={watchedStartDate ? new Date(watchedStartDate) : undefined}
          onChange={(date: Date | undefined) => {
            if (date) {
              setValue('startDate', dateAtNoon(date).toISOString());
            }
          }}
        />
        {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
      </div>

      <div className="flex justify-between gap-2 pt-4">
        <Button type="button" variant="outline" onClick={handleBack}>
          Nazad
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sačuvaj'}
        </Button>
      </div>
    </form>
  );
}
