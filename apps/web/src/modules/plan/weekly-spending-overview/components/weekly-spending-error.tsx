import {CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

export default function WeeklySpendingError() {
  return (
    <>
      <CardHeader>
        <CardTitle>Potrošnja za tekuću sedmicu</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border bg-card p-6 text-center text-muted-foreground">
          Nije moguće učitati podatke o potrošnji.
        </div>
      </CardContent>
    </>
  );
}
