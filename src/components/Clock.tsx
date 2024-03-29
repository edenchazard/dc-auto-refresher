import { useEffect, useState } from 'react';

import TimingService from '../app/timing-service';

// Receives an array of 'parts' of a time and formats with leading zeroes
const fmtTimeArray = (arr: number[]) => {
  return arr.map((part) => part.toString().padStart(2, '0')).join(':');
};

// returns difference between two dates in ms
function differenceBetweenTwoDates(from: Date, to: Date) {
  return to.valueOf() - from.valueOf();
}

function daysDifference(from: Date, to: Date) {
  const difference = differenceBetweenTwoDates(from, to);
  return Math.ceil(difference / (1000 * 3600 * 24));
}

function formatTime(ms: number): string {
  const dateObj = new Date(ms);
  // get hours, mins and seconds
  return fmtTimeArray([
    dateObj.getHours(),
    dateObj.getMinutes(),
    dateObj.getSeconds(),
  ]);
}
/* 
function formatTimeUTC(ms: number): string {
  const dateObj = new Date(ms);
  return fmtTimeArray([
    dateObj.getUTCHours(),
    dateObj.getUTCMinutes(),
    dateObj.getUTCSeconds(),
  ]);
} */

function getTimeParts(ms: number) {
  const dateObj = new Date(ms);
  return {
    hour: dateObj.getUTCHours(),
    minutes: dateObj.getUTCMinutes(),
    seconds: dateObj.getUTCSeconds(),
  };
}

function formatForCountdown(tod: Date): string {
  const today = new Date();
  const days = daysDifference(today, tod) - 1;
  const timeParts = getTimeParts(differenceBetweenTwoDates(today, tod));
  const parts = [timeParts.hour, timeParts.minutes, timeParts.seconds];
  return (days > 0 ? `${days}d ` : '') + fmtTimeArray(parts);
}

export function Clock() {
  const [time, setTime] = useState<number>(Date.now);

  useEffect(() => {
    const subscription = function clockSub() {
      setTime(Date.now);
    };
    TimingService.subscribe(subscription);

    // clean up
    return () => {
      TimingService.unsubscribe(subscription);
    };
  }, []);

  return <>{formatTime(time)}</>;
}

interface CountDownProps {
  to: Date;
  whenDone?: () => void;
}
export function CountDown({ to, whenDone }: CountDownProps) {
  const [, setTime] = useState<number>(
    differenceBetweenTwoDates(new Date(), to),
  );

  useEffect(() => {
    const subscription = function countdownSub() {
      const difference = differenceBetweenTwoDates(new Date(), to);

      if (difference <= 0) {
        // end the subscription
        TimingService.unsubscribe(subscription);

        // if specified, call a function when the countdown reaches 0
        whenDone?.();
        return;
      }

      setTime(difference);
    };

    TimingService.subscribe(subscription);

    return () => {
      TimingService.unsubscribe(subscription);
    };
  }, [to, whenDone]);

  return <>{formatForCountdown(to)}</>;
}
