import React, { useEffect } from 'react'
import NavBar from '../components/navbar';
import Header from '../components/header';

export default function Levels () {
    const[data, setData] = React.useState([])

    useEffect(() => {
      fetch('http://localhost:8081/getLevels')
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    }, [])

  return (
    <div>
        <Header />
        <NavBar />      
        <table className='levels_table'>
            <thead> 
              <tr>
                <th>Level</th>
                <th>Weekly Minutes</th>
                <th>Runs per Week</th>
                <th>Normal Run</th>
                <th>Long Run</th>
                <th>7:00</th>
                <th>7:30</th>
                <th>8:00</th>
                <th>8:30</th>
                <th>9:00</th>
                <th>9:30</th>
                <th>10:00</th>
              </tr>
            </thead>
            <tbody className='levels_table'>
            {data.map((d, i) => (
                <tr key={i}>
                    <td>{d.LevelNo}</td>
                    <td>{d.Minutes}</td>
                    <td>{d.RunsPerWeek}</td>
                    <td>{d.NormalRun}</td>
                    <td>{d.LongRun}</td>
                    <td>{d.seven_mm}</td>
                    <td>{d.sevenThirty_mm}</td>
                    <td>{d.eight_mm}</td>
                    <td>{d.eightThirty_mm}</td>
                    <td>{d.nine_mm}</td>
                    <td>{d.nineThirty_mm}</td>
                    <td>{d.ten_mm}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
}
