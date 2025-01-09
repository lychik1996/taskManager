'use client';

import { CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from './ui/calendar';
import { useEffect, useRef, useState } from 'react';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export default function DatePickerV2({
  onChange,
  value,
  className,
  placeholder = 'Select date',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null >(null);
  const handleIsOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  useEffect(()=>{
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return()=>{
      document.removeEventListener('click',handleClickOutside);
    }
  },[])
  return (
    <div ref={calendarRef} className='relative'>
      <Button
        ref={buttonRef}
        variant="outline"
        size="lg"
        className={cn(
          'w-full justify-start text-left font-normal px-3',
          !value && 'text-muted-foreground',
          className
        )}
        type="button"
        onClick={(e) => handleIsOpen(e)}
      >
        <CalendarIcon className="mr-2 h-4 -4" />
        {value ? format(value, 'PPP') : <span>{placeholder}</span>}
      </Button>

      {isOpen && (
        
          <div className="w-auto p-0 z-[1000] absolute bg-white border-gray-300 border-1px rounded-lg shadow-md" 
          style={{
            top: calendarRef.current? `${calendarRef.current.offsetHeight}px` : '0',
            position: 'absolute',
          }}
          >
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
