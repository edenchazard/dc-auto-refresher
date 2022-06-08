import { useEffect, useState } from 'react';

function formatTime(ms: number): string{
    const
        dateObj = new Date(ms),
        // get hours, mins and seconds
        parts = [
            dateObj.getHours(),
            dateObj.getMinutes(),
            dateObj.getSeconds()
        ];

        // add leading zeroes if we need to
        const [hours, minutes, seconds] = parts.map(value => (value < 10) ? "0" + value : value);

    return `${hours}:${minutes}:${seconds}`;
}

export default function Clock(){
    const [unixTime, setUnixTime] = useState(Date.now);

    useEffect(() => {
        // using 100ms instead of 1000ms almost eliminates any
        // milisecond differences between this clock and the
        // client's clock
        const interval = setInterval(() => setUnixTime(Date.now), 100);

        // clean up
        return () => clearInterval(interval);
    }, []);

    return <span>{formatTime(unixTime)}</span>;
}