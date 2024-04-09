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
                <th>Level</th>
                <th>Minutes</th>
                <th>Miles</th>
                <th>Long Run</th>
            </thead>
            <tbody>
            {data.map((d, i) => (
                <tr key={i}>
                    <td>{d.LevelNo}</td>
                    <td>{d.Minutes}</td>
                    <td>{d.Miles}</td>
                    <td>{d.Miles * .25}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
}
