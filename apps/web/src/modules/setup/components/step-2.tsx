import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Brain, Loader2} from 'lucide-react';
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
    <div className="flex flex-col w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Tailor Maya Finance to Your Life (and Loved Ones!)</CardTitle>
          <CardDescription>Define your financial home for smart, shared insights powered by AI</CardDescription>
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
                  <SelectTrigger id="currency" className="w-full">
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
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full hidden sm:flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white-900 mb-1 flex items-center gap-2">
                      Intelligent Finance Management
                    </h4>
                    <p className="text-xs text-gray-400">
                      Once set up, our AI assistant will help you effortlessly categorize expenses and provide
                      personalized insights. Get ready for smarter spending and saving, tailored to your unique
                      financial flow.
                    </p>
                  </div>
                </div>
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
