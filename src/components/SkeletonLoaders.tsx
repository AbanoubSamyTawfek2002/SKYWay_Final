import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const SkeletonHotelCard = () => (
  <Card className="overflow-hidden rounded-[40px] border-none shadow-xl bg-card">
    <div className="aspect-[4/5] bg-muted animate-pulse" />
    <CardContent className="p-8 space-y-4">
      <div className="h-4 w-1/3 bg-muted animate-pulse rounded-full" />
      <div className="h-8 w-2/3 bg-muted animate-pulse rounded-xl" />
      <div className="h-4 w-full bg-muted animate-pulse rounded-full" />
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 w-20 bg-muted animate-pulse rounded-xl" />
        <div className="h-10 w-24 bg-muted animate-pulse rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const SkeletonFlightCard = () => (
  <Card className="overflow-hidden border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] bg-card rounded-[40px] p-0">
    <div className="flex flex-col lg:flex-row items-stretch">
      <div className="lg:w-1/4 h-48 lg:h-auto min-h-[192px] bg-muted animate-pulse" />
      <div className="lg:w-2/4 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 flex-1">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="flex-1 w-full flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="flex-1 px-8">
            <div className="h-1 bg-muted animate-pulse w-full rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-4 w-12 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </div>
      <div className="lg:w-1/4 p-6 flex flex-col justify-end bg-muted/20 items-end">
        <div className="h-8 w-20 bg-muted animate-pulse rounded-full mb-4" />
        <div className="h-12 w-full bg-muted animate-pulse rounded-full max-w-[200px]" />
      </div>
    </div>
  </Card>
);
