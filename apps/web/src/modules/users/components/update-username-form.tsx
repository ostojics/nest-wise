import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import FormError from '@/components/form-error';
import {useValidateUpdateUsername} from '../hooks/use-validate-update-username';
import {useUpdateUsername} from '../hooks/use-update-username';
import {UpdateUsernameDTO} from '@nest-wise/contracts';
import {Loader2} from 'lucide-react';
import {useEffect} from 'react';

interface UpdateUsernameFormProps {
  currentUsername?: string;
}

const UpdateUsernameForm = ({currentUsername}: UpdateUsernameFormProps) => {
  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useValidateUpdateUsername();

  const updateUsernameMutation = useUpdateUsername();

  // Set initial username value
  useEffect(() => {
    if (currentUsername) {
      setValue('username', currentUsername);
    }
  }, [currentUsername, setValue]);

  const handleUpdateUsername = (data: UpdateUsernameDTO) => {
    updateUsernameMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Korisničko ime</CardTitle>
        <CardDescription>Izmenite vaše korisničko ime</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleUpdateUsername)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Novo korisničko ime</Label>
              <Input {...register('username', {required: true})} id="username" placeholder="korisničko_ime" />
              {errors.username && <FormError error={errors.username.message ?? ''} />}
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={updateUsernameMutation.isPending}>
              {updateUsernameMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sačuvaj'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdateUsernameForm;
