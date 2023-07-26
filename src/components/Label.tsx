interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  text: string;
  id: string;
}

export default function Label({ id, text, ...props }: LabelProps) {
  return (
    <label
      htmlFor={id}
      {...props}
      className={`after:content-[":"] ${props.className ?? ''}`}
    >
      {text}
    </label>
  );
}
