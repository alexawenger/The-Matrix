import React, { useEffect, useState } from 'react';
import '../index.css';
import { format, startOfWeek, addDays, startOfMonth } from 'date-fns';
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
        const normalizedEntries = data.map(entry => ({
          ...entry,
          date: entry.Date.split('T')[0],
          type: entry.Activity_Type,
          minutes: entry.Total_Minutes,
          miles: entry.Total_Miles,
        }));

        const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
        const endDate = addDays(startDate, 34); // 5 weeks displayed

        const days = [];
        for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
          const dateKey = format(day, 'yyyy-MM-dd');
          const entryDetails = normalizedEntries.find(entry => entry.date === dateKey) || {};
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
          <span className="workout">{day.type || ''}</span>
        </div>
        <div className="stats">
          <div className="minutes">{day.minutes || 0} mins</div>
          <div className="miles">{day.miles || 0} miles</div>
        </div>
      </div>
    );
  };

  const renderWeek = (weekDates) => {
    const days = weekDates.map((day) => (
      <td className='day-cell' key={format(day.date, 'yyyy-MM-dd')}>
        {renderDay(day)}
      </td>
    ));
  
    return days;  // return only <td> elements
  };
  
  
  const renderCalendar = () => {
    const weeks = [];
    let week = [];
  
    calendar.forEach((day, index) => {
      week.push(day);
      if (week.length === 7 || index === calendar.length - 1) { // Check if the week is complete or it's the end of the array
        const weekKey = format(week[0].date, 'yyyy-wo');  // Correctly formatted week key
        weeks.push(<tr key={weekKey}>{renderWeek(week)}</tr>); // Ensure weeks are directly within <tbody> or <table>
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
