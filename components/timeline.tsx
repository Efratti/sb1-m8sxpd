"use client";

import { useEffect, useState } from 'react';
import { Event } from '@prisma/client';
import { Card } from './ui/card';
import { formatDate } from '@/lib/utils';

export function Timeline() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="p-6">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(event.startDate)}
          </p>
          <p className="mt-2">{event.description}</p>
          <div className="mt-2 text-sm text-muted-foreground">
            Location: {event.latitude}, {event.longitude}
          </div>
        </Card>
      ))}
    </div>
  );
}