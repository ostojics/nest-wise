import {useRouter} from '@tanstack/react-router';
import {Button} from '@/components/ui/button';

export function DefaultErrorComponent() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Došlo je do greške</h1>
        <p className="text-muted-foreground">Izvinjavamo se, ali nešto nije funkcionisalo kako treba.</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={() => router.navigate({to: '/'})}>
            Početna stranica
          </Button>
        </div>
      </div>
    </div>
  );
}
