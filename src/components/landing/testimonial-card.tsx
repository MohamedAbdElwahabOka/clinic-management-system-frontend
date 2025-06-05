
"use client";

import * as React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  stars: number;
}

export function TestimonialCard({ quote, author, role, stars }: TestimonialCardProps) {
  return (
    <Card className="flex flex-col bg-card shadow-lg h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <blockquote className="text-lg text-foreground italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </CardContent>
      <CardFooter>
        <div>
          <p className="font-semibold text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
