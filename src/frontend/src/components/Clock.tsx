import { useEffect, useState } from 'react';

// using 100ms instead of 1000ms almost eliminates any
// milisecond differences between this clock and the
// client's clock
const updateInterval = 100;

// Receives an array of 'parts' of a time and formats with leading zeroes
const fmtTimeArray = (arr: number[]) => {
    return arr
        .map(value => (value < 10) ? "0" + value : value.toString())
        .join(':');
}

// returns difference between two dates in ms
function differenceBetweenTwoDates(from: Date, to: Date){
    return to.valueOf() - from.valueOf();
}

function daysDifference(from: Date, to: Date){
    const difference = differenceBetweenTwoDates(from, to);
    return Math.ceil(difference / (1000 * 3600 * 24));
}

function formatTimestamp(ms: number): string {
    const dateObj = new Date(ms);
    // get hours, mins and seconds
    return fmtTimeArray([
        dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()
    ]);
}

function formatUTCTimestamp(ms: number): string {
    const dateObj = new Date(ms);
    return fmtTimeArray([
        dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds()
    ]);
}

function formatForCountdown(tod: Date, ms: number): string {
    const timeString = formatUTCTimestamp(ms);
    const days = daysDifference(new Date(), tod) - 1;
    const dayString = days > 0 ? days + "d ": "";
    return dayString + timeString;
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
    }, [to, whenDone]);

    return <span title={to.toLocaleString()}>{formatForCountdown(to, time)}</span>;
}