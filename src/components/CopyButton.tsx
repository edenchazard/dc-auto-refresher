import type React from 'react';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Buttons';

interface copyButtonProps extends ComponentProps<'button'> {
  copyText: string;
  text?: React.ReactNode;
}

export default function CopyButton({
  text,
  copyText,
  ...props
}: copyButtonProps) {
  const origlabel = text ?? (
    <>
      <FontAwesomeIcon icon={faCopy} /> Copy
    </>
  );
  const [tempLabel, setTempLabel] = useState<null | string>(null);

  // re-renders will cause this to reset to null.
  // we need to protect against when we cause a re-render by changing the label.
  const timeout = useRef<null | number>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, [timeout]);

  /**
   * Sets the temporary label for the specifed time, which updates the button
   * label, before unsetting it.
   * @param label Temporary label
   * @param original The label to return to after @param time miliseconds.
   */
  function updateLabel(label: string, time = 5000) {
    // clear if there's already an interval
    if (timeout.current) window.clearTimeout(timeout.current);

    setTempLabel(label);
    timeout.current = window.setTimeout(() => {
      setTempLabel(null);
    }, time);
  }

  function updateButton(label: string) {
    updateLabel(label, 3000);
  }

  function copyToClipboard() {
    void (async () => {
      try {
        await navigator.clipboard.writeText(copyText);
        updateButton('Copied!');
      } catch (ex) {
        updateButton('Error :(');
      }
    })();
  }

  return (
    <Button
      type="button"
      title="Copy share link"
      {...props}
      onClick={copyToClipboard}
      className={props.className}
    >
      {tempLabel ?? origlabel}
    </Button>
  );
}
