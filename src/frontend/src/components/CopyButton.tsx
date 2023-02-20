import type React from 'react';
import { useRef } from 'react';

import ReactTooltip from 'react-tooltip';

interface copyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  copyText: string;
}

export default function CopyButton({
  copyText,
  text,
  ...buttonProps
}: copyButtonProps) {
  const button = useRef<HTMLButtonElement & { dataset: { tip: string } }>(null);

  function copyToClipboard() {
    const copy = async () => {
      // button hasn't been initialised
      if (button.current === null) return;

      try {
        await navigator.clipboard.writeText(copyText);
        button.current.dataset.tip = 'Copied!';
        ReactTooltip.show(button.current);
      } catch (ex) {
        button.current.dataset.tip = 'Error copying';
        ReactTooltip.show(button.current);
      }
    };

    void copy();
  }

  return (
    <button
      {...buttonProps}
      ref={button}
      data-event="click"
      type="button"
      onClick={copyToClipboard}
    >
      {text}
    </button>
  );
}
