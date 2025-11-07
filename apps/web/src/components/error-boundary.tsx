import {useRouter} from '@tanstack/react-router';
import {Button} from '@/components/ui/button';

export function DefaultErrorComponent({reset}: {error: Error; reset: () => void}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-2xl font-bold">Došlo je do greške</h1>
        <p className="text-muted-foreground">
          Izvinjavamo se, ali nešto nije funkcionisalo kako treba. Pokušajte ponovo ili se vratite na početnu stranicu.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => reset()}>Pokušaj ponovo</Button>
          <Button variant="outline" onClick={() => router.navigate({to: '/'})}>
            Početna
          </Button>
        </div>
      </div>
    </div>
  );
}
