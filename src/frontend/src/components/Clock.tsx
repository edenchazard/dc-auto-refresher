import { useEffect, useState } from 'react';

function formatTimestamp(ms: number): string{
    const
        dateObj = new Date(ms),
        // get hours, mins and seconds
        [hours, minutes, seconds] = [
            dateObj.getHours(),
            dateObj.getMinutes(),
            dateObj.getSeconds()
        ] // add leading zeroes if we need to
            .map(value => (value < 10) ? "0" + value : value.toString());

    return `${hours}:${minutes}:${seconds}`;
}

export default function Clock(){
    const [time, setTime] = useState<number>(Date.now);

    useEffect(() => {
        // using 100ms instead of 1000ms almost eliminates any
        // milisecond differences between this clock and the
        // client's clock
        const interval = setInterval(() => setTime(Date.now), 100);

        // clean up
        return () => clearInterval(interval);
    }, []);

    return <span>{formatTimestamp(time)}</span>;
}