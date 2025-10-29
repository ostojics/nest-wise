import {Skeleton} from '@/components/ui/skeleton';
import TextBanner from '@/components/text-banner';

export default function ScheduledTransactionsLoading() {
  return (
    <section className="p-4 space-y-4">
      <TextBanner
        aria-label="Zakazane transakcije"
        text="Zakazane transakcije omogućavaju automatsko kreiranje ponavljajućih transakcija. Podesite frekvenciju i iznos, a transakcije će biti kreirane po vašem rasporedu."
      />
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="rounded-md border bg-card">
        {Array.from({length: 3}).map((_, idx) => (
          <div key={idx} className="border-b last:border-b-0 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="shrink-0 text-right space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
