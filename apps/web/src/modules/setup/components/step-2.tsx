import FormError from '@/components/form-error';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Brain, Loader2} from 'lucide-react';
import {useValidateStep2} from '../hooks/use-validate-step2';
import {useSetupContext} from '../hooks/use-setup';
import {useSetupMutation} from '../hooks/use-setup-mutation';
import {CreateHouseholdDTO, SetupDTO} from '@nest-wise/contracts';
import {CURRENCIES} from '../currencies';

const Step2 = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useValidateStep2();
  const {userData, licenseKey} = useSetupContext();
  const mutation = useSetupMutation();

  const handleHouseholdSetup = (data: CreateHouseholdDTO) => {
    if (!userData || !licenseKey) return;

    const dto: SetupDTO = {
      licenseKey,
      user: userData,
      household: data,
    };

    mutation.mutate(dto);
  };

  const handleCurrencyChange = (value: string) => {
    setValue('currencyCode', value);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Prilagodite NestWise svom domaćinstvu</CardTitle>
          <CardDescription>Definišite svoje domaćinstvo za pametne i zajedničke uvide uz pomoć AI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleHouseholdSetup)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Naziv domaćinstva</Label>
                <Input
                  {...register('name', {required: true})}
                  id="name"
                  placeholder="npr. Porodični budžet, Zajednički troškovi"
                  autoComplete="organization"
                />
                {errors.name && <FormError error={errors.name.message ?? ''} />}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="currency">Glavna valuta</Label>
                <Select onValueChange={handleCurrencyChange}>
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue placeholder="Izaberi valutu" />
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
              <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full hidden sm:flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white-900 mb-1 flex items-center gap-2">
                      Inteligentno upravljanje finansijama
                    </h4>
                    <p className="text-xs text-gray-400">
                      Kada završite podešavanje, naš AI asistent će vam pomoći da lako kategorizujete troškove i
                      dobijete personalizovane uvide. Budite spremni za pametnije trošenje i štednju, prilagođene vašem
                      finansijskom toku.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isSubmitting || !licenseKey}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Kreiraj domaćinstvo'}
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
