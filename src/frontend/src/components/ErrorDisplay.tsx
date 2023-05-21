import React, { useEffect, useState } from 'react';

export enum ErrorType {
  error = 1,
  information,
}

export type ErrorMessage = null | {
  type: ErrorType;
  message: string;
  noHide?: boolean;
};

function determineClass(type: number) {
  switch (type) {
    case ErrorType.error:
      return 'text-red-500';
    case ErrorType.information:
      return 'text-amber-500';
    default:
      return '';
  }
}

interface ErrorDisplayProps extends React.HTMLProps<HTMLDivElement> {
  error: ErrorMessage;
  hideAfter?: number;
  done: (value: any) => void;
}
export function ErrorDisplay({
  error,
  hideAfter = 5000,
  done,
  ...props
}: ErrorDisplayProps) {
  const [, setVisible] = useState(false);

  useEffect(() => {
    // hide error after x miliseconds if nohide disabled
    if (error === null) return;

    if (error.noHide !== true) {
      setVisible(true);
      const timeout = setTimeout(() => {
        done(null);
      }, hideAfter);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [error, hideAfter, done]);

  if (error === null) {
    return null;
  }

  return (
    <div className={props.className + ' ' + determineClass(error.type)}>
      {error.message}
    </div>
  );
}
