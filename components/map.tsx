"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '@prisma/client';
import { Card } from './ui/card';
import { formatDate } from '@/lib/utils';

interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={`${className} bg-muted animate-pulse`}></div>;
  }

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.latitude, event.longitude]}
        >
          <Popup>
            <Card className="p-4">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(event.startDate)}
              </p>
              <p className="mt-2">{event.description}</p>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}