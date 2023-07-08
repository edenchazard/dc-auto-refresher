import React, { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  styles?: {
    normal: string;
    hover: string;
    disabled: string;
    focus: string;
  };
}

export function Button({ ...props }: Partial<ButtonProps>) {
  /*   const { normal, focus, hover, disabled } = {
    ...props.styles,
    ...{
      normal: 'bg-indigo-400',
      hover: 'bg-blue-400',
      focus: 'bg-yellow-200',
      disabled: 'bg-neutral-500',
    },
  }; */

  return (
    <button
      type={'button'}
      {...props}
      className={`button rounded px-2 py-1 ${props.className ?? ''}`}
    >
      {props.children}
    </button>
  );
}

interface ToggleButtonProps extends ButtonProps {
  pressed: boolean;
}
export function ToggleButton({ pressed, ...props }: ToggleButtonProps) {
  return (
    <Button
      aria-pressed={pressed}
      {...props}
    >
      {props.children}
    </Button>
  );
}
