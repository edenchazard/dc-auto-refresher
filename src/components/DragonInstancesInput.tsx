import type React from 'react';

interface DragonInstancesInputProps extends React.HTMLProps<HTMLInputElement> {
  instances: number;
  setInstances: (value: number) => void;
}
export default function DragonInstancesInput({
  instances,
  setInstances,
  ...props
}: DragonInstancesInputProps) {
  return (
    <input
      className={props.className}
      type="number"
      value={instances}
      min="0"
      max="50"
      size={2}
      placeholder="instances"
      onChange={(e) => {
        setInstances(Math.abs(parseInt(e.target.value)));
      }}
      {...props}
    />
  );
}
