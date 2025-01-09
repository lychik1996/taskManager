'use client';

import { CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { useState } from 'react';

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
  const [isOpen, setIsopen] = useState(false);
  return (
    
    <div className='relative'>
      
        <Button
          variant="outline"
          size="lg"
          className={cn(
            'w-full justify-start text-left font-normal px-3',
            !value && 'text-muted-foreground',
            className
          )}
          onClick={(e)=>{
            e.preventDefault();
            setIsopen(prev=>!prev)
          }}
        >
          <CalendarIcon className="mr-2 h-4 -4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      
      {isOpen && (
        <div className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange(date as Date)}
          initialFocus
        />
      </div>
      )}
    </div>
  );
}
