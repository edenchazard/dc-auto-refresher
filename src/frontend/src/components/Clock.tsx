import { useEffect, useState } from 'react';

// using 100ms instead of 1000ms almost eliminates any
// milisecond differences between this clock and the
// client's clock
const updateInterval = 100;

function formatTimestamp(ms: number): string {
    const dateObj = new Date(ms);
    // get hours, mins and seconds
    return [ dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds() ]
        // add leading zeroes if we need to
        .map(value => (value < 10) ? "0" + value : value.toString())
        .join(':');
}

function formatUTCTimestamp(ms: number): string{
    const dateObj = new Date(ms);
    return [ dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds() ]
    // add leading zeroes if we need to
    .map(value => (value < 10) ? "0" + value : value.toString())
    .join(':');
}

export function Clock(){
    const [time, setTime] = useState<number>(Date.now);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now), updateInterval);

        // clean up
        return () => clearInterval(interval);
    }, []);

    return <span>{formatTimestamp(time)}</span>;
}

// returns difference between two dates in ms
function differenceBetweenTwoDates(from: Date, to: Date){
    return to.valueOf() - from.valueOf();
}
interface CountDownProps {
    to: Date,
    whenDone?: Function
}
export function CountDown({ to, whenDone }: CountDownProps){
    const [time, setTime] = useState<number>(differenceBetweenTwoDates(new Date(), to));

    useEffect(() => {
        const interval = setInterval(() => {
            const difference = differenceBetweenTwoDates(new Date(), to);

            if(difference <= 0){
                // end the timer
                clearInterval(interval);

                // if specified, call a function when the countdown reaches 0
                whenDone && whenDone();
                return;
            }
    
            setTime(difference);
        }, updateInterval);

        return () => clearInterval(interval);
    }, [to]);

    return <span>{formatUTCTimestamp(time)}</span>;
}