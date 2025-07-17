import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Loader2} from 'lucide-react';
import {useValidateStep2} from '../hooks/useValidateStep2';

const CURRENCIES = [
  {code: 'RSD', name: 'Serbian Dinar (RSD)'},
  {code: 'USD', name: 'US Dollar ($)'},
  {code: 'EUR', name: 'Euro (€)'},
  {code: 'GBP', name: 'British Pound (£)'},
  {code: 'JPY', name: 'Japanese Yen (¥)'},
  {code: 'CAD', name: 'Canadian Dollar (C$)'},
  {code: 'AUD', name: 'Australian Dollar (A$)'},
  {code: 'CHF', name: 'Swiss Franc (CHF)'},
  {code: 'CNY', name: 'Chinese Yuan (¥)'},
  {code: 'INR', name: 'Indian Rupee (₹)'},
  {code: 'BRL', name: 'Brazilian Real (R$)'},
  {code: 'RUB', name: 'Russian Ruble (₽)'},
  {code: 'KRW', name: 'South Korean Won (₩)'},
  {code: 'MXN', name: 'Mexican Peso (MX$)'},
  {code: 'SEK', name: 'Swedish Krona (kr)'},
  {code: 'NOK', name: 'Norwegian Krone (kr)'},
  {code: 'DKK', name: 'Danish Krone (kr)'},
  {code: 'NZD', name: 'New Zealand Dollar (NZ$)'},
  {code: 'SGD', name: 'Singapore Dollar (S$)'},
  {code: 'HKD', name: 'Hong Kong Dollar (HK$)'},
  {code: 'ZAR', name: 'South African Rand (R)'},
];

const Step2 = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useValidateStep2();
  // const {userData} = useSetupContext();

  const handleHouseholdSetup = () => {
    alert('Form submitted successfully! (No action taken - placeholder functionality)');
  };

  const handleCurrencyChange = (value: string) => {
    setValue('currencyCode', value);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Now, let's create your household</CardTitle>
          <CardDescription>Set up your household details and choose your primary currency</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleHouseholdSetup)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Household Name</Label>
                <Input
                  {...register('name', {required: true})}
                  id="name"
                  placeholder="e.g., My Family Budget, Shared Expenses"
                  autoComplete="organization"
                />
                {errors.name && <FormError error={errors.name.message ?? ''} />}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="currency">Primary Currency</Label>
                <Select onValueChange={handleCurrencyChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currencyCode && <FormError error={errors.currencyCode.message ?? ''} />}
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Household'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step2;
