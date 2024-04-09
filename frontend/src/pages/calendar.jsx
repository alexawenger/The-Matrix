import React, { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, getDay, endOfMonth, startOfMonth } from 'date-fns';
import NavBar from '../components/navbar';
import Header from '../components/header';

export default function Calendar() {
  const [entries, setEntries] = useState([]);
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/getEntries')
      .then((res) => res.json())
      .then((entries) => {
        // Transform data to map it by date for easier access when rendering the calendar
        const entriesByDate = data.reduce((acc, entry) => {
          const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
          const currentEntry = acc[dateKey] || { minutes: 0, miles: 0 };
          
          // Assuming entries contain 'minutes' and 'miles', adjust as needed
          currentEntry.minutes += entry.minutes;
          currentEntry.miles += entry.miles;
          acc[dateKey] = currentEntry;
          
          return acc;
        }, {});

        // Create the calendar structure
        const startDate = startOfWeek(startOfMonth(new Date()));
        const endDate = endOfMonth(new Date());

        const days = [];
        for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
          const dateKey = format(day, 'yyyy-MM-dd');
          days.push({
            date: day,
            ...entriesByDate[dateKey],
          });
        }

        setCalendar(days);
      })
      .catch((err) => console.log(err));
  }, []);

  const renderWeek = (week) => {
    let weekTotalMinutes = 0;
    let weekTotalMiles = 0;

    const days = week.map((day) => {
      weekTotalMinutes += day.minutes || 0;
      weekTotalMiles += day.miles || 0;

      return (
        <td key={day.date}>
          {format(day.date, 'd')}<br />
          Minutes: {day.minutes || 0}<br />
          Miles: {day.miles || 0}
        </td>
      );
    });

    days.push(
      <td key='total'>
        Total<br />
        Minutes: {weekTotalMinutes}<br />
        Miles: {weekTotalMiles}
      </td>
    );

    return <tr>{days}</tr>;
  };

  const renderCalendar = () => {
    const weeks = [];
    for (let weekStart = startOfWeek(startOfMonth(new Date())); weekStart < endOfMonth(new Date()); weekStart = addDays(weekStart, 7)) {
      const week = calendar.slice(getDay(weekStart), getDay(weekStart) + 7);
      weeks.push(renderWeek(week));
    }
    return weeks;
  };

  return (
    <div>
      <Header />
      <NavBar />
      <table>
        <thead>
          <tr>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Weekly Total</th>
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
    </div>
  );
}
