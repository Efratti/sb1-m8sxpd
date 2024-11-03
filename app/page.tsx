import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Timeline } from '@/components/timeline';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg"></div>
  ),
});

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold mb-4">Interactive Event Map</h1>
        <Card className="p-0 overflow-hidden">
          <Suspense fallback={<div>Loading map...</div>}>
            <Map className="w-full h-[500px]" />
          </Suspense>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Events</h2>
        <Timeline />
      </section>
    </div>
  );
}