import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import FormError from '@/components/form-error';
import {useGetHouseholdById} from '@/modules/households/hooks/use-get-household-by-id';
import {useValidateEditHousehold} from '@/modules/households/hooks/use-validate-edit-household';
import {useGetMe} from '@/modules/auth/hooks/use-get-me';
import {queryKeys} from '@/modules/api/query-keys';
import {updateHousehold} from '@/modules/api/households-api';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {Loader2} from 'lucide-react';
import {useEffect} from 'react';

const SettingsPage = () => {
  const {data: me} = useGetMe();
  const {data: household} = useGetHouseholdById();
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({id, data}: {id: string; data: {name?: string}}) => updateHousehold(id, data),
    onSuccess: (_, {id}) => {
      void client.invalidateQueries({queryKey: queryKeys.households.single(id)});
      toast.success('Podešavanja sačuvana');
    },
    onError: () => {
      toast.error('Ažuriranje podešavanja nije uspelo');
    },
  });

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useValidateEditHousehold();

  useEffect(() => {
    if (household) {
      setValue('name', household.name);
    }
  }, [household, setValue]);

  const onSubmit = handleSubmit((data) => {
    if (!me?.householdId) return;

    mutation.mutate({id: me.householdId, data});
  });

  return (
    <section className="p-4">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Podešavanja</CardTitle>
          <CardDescription>Upravljajte osnovnim podešavanjima vašeg domaćinstva</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="household-name">Naziv domaćinstva</Label>
              <Input id="household-name" placeholder="npr. Porodični budžet" {...register('name', {required: true})} />
              {errors.name?.message && <FormError error={errors.name.message} />}
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sačuvaj'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default SettingsPage;
