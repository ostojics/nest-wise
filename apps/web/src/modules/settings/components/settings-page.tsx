import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Checkbox} from '@/components/ui/checkbox';
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
import {useGetUserPreferences} from '@/modules/user-preferences/hooks/use-get-user-preferences';
import {useUpdateUserPreferences} from '@/modules/user-preferences/hooks/use-update-user-preferences';
import {useValidateUserPreferences} from '@/modules/user-preferences/hooks/use-validate-user-preferences';

const SettingsPage = () => {
  const {data: me} = useGetMe();
  const {data: household} = useGetHouseholdById();
  const {data: userPreferences} = useGetUserPreferences();
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({id, data}: {id: string; data: {name?: string}}) => updateHousehold(id, data),
    onSuccess: (_, {id}) => {
      void client.invalidateQueries({queryKey: queryKeys.households.single(id)});
      toast.success('Podešavanja sačuvana');
    },
    onError: async (error) => {
      const {default: posthog} = await import('posthog-js');

      posthog.captureException(error, {
        context: {
          feature: 'settings_update',
        },
        meta: {
          householdId: me?.householdId,
          userId: me?.id,
        },
      });

      toast.error('Ažuriranje podešavanja nije uspelo');
    },
  });

  const userPreferencesMutation = useUpdateUserPreferences();

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useValidateEditHousehold();

  const {
    handleSubmit: handleSubmitPreferences,
    setValue: setPreferenceValue,
    watch: watchPreferences,
  } = useValidateUserPreferences();

  useEffect(() => {
    if (household) {
      setValue('name', household.name);
    }
  }, [household, setValue]);

  useEffect(() => {
    if (userPreferences) {
      setPreferenceValue('automaticLogout', userPreferences.automaticLogout);
    }
  }, [userPreferences, setPreferenceValue]);

  const onSubmit = handleSubmit((data) => {
    if (!me?.householdId) return;

    mutation.mutate({id: me.householdId, data});
  });

  const onSubmitPreferences = handleSubmitPreferences((data) => {
    userPreferencesMutation.mutate(data);
  });

  const automaticLogoutValue = watchPreferences('automaticLogout');

  return (
    <section className="p-4 space-y-6">
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

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Podešavanja korisnika</CardTitle>
          <CardDescription>Upravljajte ličnim podešavanjima vašeg naloga</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmitPreferences} className="space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="automatic-logout"
                  checked={automaticLogoutValue}
                  onCheckedChange={(checked) => {
                    setPreferenceValue('automaticLogout', checked === true);
                  }}
                />
                <div className="flex flex-col">
                  <Label htmlFor="automatic-logout" className="cursor-pointer">
                    Automatska odjava
                  </Label>
                  <p className="text-sm text-muted-foreground">Automatski se odjavite kada zatvorite aplikaciju</p>
                </div>
              </div>
            </div>
            <Button type="submit" disabled={userPreferencesMutation.isPending}>
              {userPreferencesMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sačuvaj'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default SettingsPage;
