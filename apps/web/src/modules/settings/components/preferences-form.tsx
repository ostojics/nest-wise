import {Button} from '@/components/ui/button';
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {useGetUserPreferences} from '@/modules/user-preferences/hooks/use-get-user-preferences';
import {useUpdateUserPreferences} from '@/modules/user-preferences/hooks/use-update-user-preferences';
import {useValidateUserPreferences} from '@/modules/user-preferences/hooks/use-validate-user-preferences';
import {Loader2} from 'lucide-react';
import {useEffect} from 'react';

const PreferencesForm = () => {
  const {
    handleSubmit: handleSubmitPreferences,
    setValue: setPreferenceValue,
    watch: watchPreferences,
  } = useValidateUserPreferences();
  const {data: userPreferences} = useGetUserPreferences();
  const userPreferencesMutation = useUpdateUserPreferences();

  const onSubmitPreferences = handleSubmitPreferences((data) => {
    userPreferencesMutation.mutate(data);
  });

  const automaticLogoutValue = watchPreferences('automaticLogout');

  useEffect(() => {
    if (userPreferences) {
      setPreferenceValue('automaticLogout', userPreferences.automaticLogout);
    }
  }, [userPreferences, setPreferenceValue]);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Preference</CardTitle>
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
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Automatski se odjavite kada zatvorite aplikaciju ili usled neaktivnosti
          </p>
          <Button type="submit" disabled={userPreferencesMutation.isPending}>
            {userPreferencesMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sačuvaj'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PreferencesForm;
