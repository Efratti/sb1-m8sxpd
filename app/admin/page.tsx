"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Event } from '@prisma/client';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    if (session?.user.role !== 'ADMIN') {
      redirect('/');
    }

    fetch('/api/events')
      .then((res) => res.json())
      .then(setEvents);
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          startDate: new Date(formData.startDate),
          endDate: formData.endDate ? new Date(formData.endDate) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create event');

      const newEvent = await res.json();
      setEvents([newEvent, ...events]);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        latitude: '',
        longitude: '',
      });

      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                required
              />
            </div>
          </div>

          <Button type="submit">Create Event</Button>
        </form>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Existing Events</h2>
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="p-6">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(event.startDate).toLocaleDateString()}
              </p>
              <p className="mt-2">{event.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}