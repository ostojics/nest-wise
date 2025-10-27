import TextBanner from '@/components/text-banner';
import {Button} from '@/components/ui/button';

export default function ScheduledTransactionsError() {
  return (
    <section className="p-4 space-y-4">
      <TextBanner
        aria-label="Zakazane transakcije"
        text="Zakazane transakcije omogućavaju automatsko kreiranje ponavljajućih transakcija. Podesite frekvenciju i iznos, a transakcije će biti kreirane po vašem rasporedu."
      />
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Greška pri učitavanju</h3>
          <p className="text-sm text-muted-foreground mt-2">Došlo je do greške pri učitavanju zakazanih transakcija.</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Pokušaj ponovo
        </Button>
      </div>
    </section>
  );
}
