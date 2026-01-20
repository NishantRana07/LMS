'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  hasEvent: boolean
}

interface CalendarWidgetProps {
  onDateSelect?: (date: Date) => void
  events?: Array<{ date: string; title: string; color: string }>
}

export function CalendarWidget({ onDateSelect, events = [] }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = []
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const today = new Date()
    const isCurrentMonth =
      today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()

    // Previous month days
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const hasEvent = events.some((e) => e.date.startsWith(dateStr))

      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: isCurrentMonth && i === today.getDate(),
        hasEvent,
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false,
      })
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && onDateSelect) {
      const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date)
      onDateSelect(selected)
    }
  }

  const days = getCalendarDays()
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(day)}
            className={`
              aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center relative
              ${!day.isCurrentMonth ? 'text-muted-foreground bg-muted/30' : 'text-foreground'}
              ${day.isToday ? 'bg-primary text-primary-foreground font-bold' : ''}
              ${day.isCurrentMonth && !day.isToday ? 'hover:bg-secondary cursor-pointer' : ''}
              ${day.hasEvent && !day.isToday ? 'ring-2 ring-accent' : ''}
            `}
          >
            {day.date}
            {day.hasEvent && !day.isToday && <div className="absolute bottom-1 w-1 h-1 bg-accent rounded-full" />}
          </button>
        ))}
      </div>
    </div>
  )
}
