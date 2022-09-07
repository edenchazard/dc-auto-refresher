import { useEffect, useState } from 'react';

import TimingService from "../app/timing-handler";

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

function formatTime(ms: number): string {
    const dateObj = new Date(ms);
    // get hours, mins and seconds
    return fmtTimeArray([
        dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()
    ]);
}

function formatTimeUTC(ms: number): string {
    const dateObj = new Date(ms);
    return fmtTimeArray([
        dateObj.getUTCHours(), dateObj.getUTCMinutes(), dateObj.getUTCSeconds()
    ]);
}

function formatForCountdown(tod: Date): string {
    const today = new Date();
    const days = daysDifference(today, tod) - 1;
    const dayString = days > 0 ? days + "d ": "";
    const timeString = formatTimeUTC(differenceBetweenTwoDates(today, tod));
    return dayString + timeString;
}

export function Clock(){
    const [time, setTime] = useState<number>(Date.now);

    useEffect(() => {
        const subscription = TimingService.subscribe(() => setTime(Date.now));

        // clean up
        return () => TimingService.unsubscribe(subscription);
    }, []);

    return <span>{formatTime(time)}</span>;
}

interface CountDownProps {
    to: Date,
    whenDone?: Function
}
export function CountDown({ to, whenDone }: CountDownProps){
    const [, setTime] = useState<number>(differenceBetweenTwoDates(new Date(), to));

    useEffect(() => {
        const subscription = TimingService.subscribe(() => {
            const difference = differenceBetweenTwoDates(new Date(), to);

            if(difference <= 0){
                // end the subscription
                TimingService.unsubscribe(subscription);

                // if specified, call a function when the countdown reaches 0
                whenDone && whenDone();
                return;
            }
    
            setTime(difference);
        });

        return () => TimingService.unsubscribe(subscription);
    }, [to, whenDone]);

    return <span>{formatForCountdown(to)}</span>;
}