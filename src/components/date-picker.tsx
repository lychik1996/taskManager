'use client';

import { CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export default function DatePicker({
  onChange,
  value,
  className,
  placeholder = 'Select date',
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          onTouchStart={(e) => e.preventDefault()}
          className={cn(
            'w-full justify-start text-left font-normal px-3',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 -4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange(date as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
