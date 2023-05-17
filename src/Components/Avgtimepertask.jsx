import React from 'react';
import '../App.css';

export default function Avgtimepertask(props){
    // console.log(props);
    let avgtime = 0;
    for(let i=0; i<props.avgtime.length; i++){
        avgtime += props.avgtime[i];
    }
    avgtime = avgtime/props.avgtime.length;

    function formatTime(time) {
        const date = new Date(time * 1000);
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    return(
        <div className='avgtime'>
            <h3 className='avgtimeclassname'>{props.id}</h3>
            <h3 className='avgtimetook'>{formatTime(avgtime)}</h3>
        </div>
    );
}