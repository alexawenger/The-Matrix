// This is the calendar page of the website, which renders all the entries for the month with weekly sums


import React, { useEffect, useState } from 'react';
import '../index.css';
import { format, startOfWeek, addDays, startOfMonth, parseISO } from 'date-fns';
import NavBar from '../components/navbar';
import Header from '../components/header';

export default function Calendar() {
  const [entries, setEntries] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetch('http://localhost:8081/getEntries')
      .then((res) => res.json())
      .then((data) => {
        data = data.map((entry) => ({
          ...entry,
          Date: entry.Date.split("T")[0],
        }));

        const normalizedEntries = data.map((entry) => ({
          ...entry,
          type: entry.Activity_Type,
          minutes: entry.Total_Minutes,
          miles: entry.Total_Miles,
        }));

        const startDate = startOfWeek(startOfMonth(currentDate), {
          weekStartsOn: 0,
        });
        const endDate = addDays(startDate, 34); // 5 weeks displayed

        const days = [];
        for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
          const dateKey = format(day, "yyyy-MM-dd");
          const entryDetails =
            normalizedEntries.find((entry) => entry.Date === dateKey) || {};
          days.push({
            date: day,
            ...entryDetails,
          });
        }

        setCalendar(days);
      })
      .catch((err) => console.error(err));
  }, [currentDate]);

  const renderDay = (day) => {
    return (
      <div className="day-box">
        <div className="date-workout">
          <span className="date-box">{format(day.date, 'd')}</span>
          <span className="workout">{day.type ? ( " - " + day.type) : " " || ''}</span>
        </div>
        <div className="stats">
          <div className="minutes">{day.minutes || 0} mins</div>
          <div className="miles">{day.miles || 0} miles</div>
        </div>
      </div>
    );
  };

  const renderWeek = (weekDates, weekIndex) => {
    let totalMinutes = 0;
    let totalMiles = 0;
  
    const days = weekDates.map((day, index) => {
      // Summing up the totals
      totalMinutes += day.minutes || 0;
      totalMiles += day.miles || 0;
  
      // Append weekIndex to ensure uniqueness across weeks
      const dayKey = `${format(day.date, 'yyyy-MM-dd')}-w${weekIndex}`;
  
      return (
        <td className='day-cell' key={dayKey}>
          {renderDay(day)}
        </td>
      );
    });
  
    // Create a total cell
    const totalsCell = (
      <td className='week-totals'>
        <div className='minutes'> {totalMinutes} mins</div>
        <div className='miles'> {totalMiles} miles</div>
      </td>
    );
  
    // Include the totals cell in the row
    return [...days, totalsCell];  // Add the total column to the row
  };
  
  
  
  const renderCalendar = () => {
    const weeks = [];
    let week = [];
  
    calendar.forEach((day, index) => {
      week.push(day);
      if (week.length === 7 || index === calendar.length - 1) { // Check if the week is complete or it's the end of the array
        const weekKey = `${format(week[0].date, 'yyyy-MM-dd')}-${format(week[week.length - 1].date, 'yyyy-MM-dd')}`;  // More unique key
        weeks.push(<tr key={weekKey}>{renderWeek(week)}</tr>); // Push the complete week
        week = []; // Reset the week
      }
    });
  
    return (
      <tbody>
        {weeks}
      </tbody>
    );
  };
  
  return (
    <div>
      <Header />
      <NavBar />
      <h2 className='calendar-head'>{format(currentDate, 'MMMM yyyy')}</h2>
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
        {renderCalendar()}
      </table>
    </div>
  );
  
}
