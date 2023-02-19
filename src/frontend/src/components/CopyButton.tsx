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
  const button = useRef(null);

  async function copy(event) {
    const el: HTMLButtonElement = event.target;
    try {
      await navigator.clipboard.writeText(copyText);
      el.dataset.tip = 'Copied!';
      ReactTooltip.show(button.current);
    } catch (ex) {
      el.dataset.tip = 'Error copying';
      ReactTooltip.show(button.current);
    }
  }

  return (
    <button
      {...buttonProps}
      ref={button}
      data-event="click"
      type="button"
      onClick={copy}
    >
      {text}
    </button>
  );
}
