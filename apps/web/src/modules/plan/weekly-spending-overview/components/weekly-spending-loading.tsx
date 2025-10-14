import {CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';
import {Skeleton} from '@/components/ui/skeleton';

export default function WeeklySpendingLoading() {
  return (
    <>
      <CardHeader>
        <CardTitle>Potrošnja za tekuću sedmicu</CardTitle>
        <CardDescription>Pregled dnevne potrošnje i transakcija</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({length: 7}).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Separator />
        <Skeleton className="h-40" />
      </CardContent>
    </>
  );
}
