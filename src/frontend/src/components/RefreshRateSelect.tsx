interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
  value: number;
  onChanged: (value: number) => void;
}
export default function RefreshRateSelect({
  onChanged,
  value,
  ...props
}: SelectProps) {
  const options = [250, 500, 1000, 2000, 4000].map((opt) => ({
    label: `${opt / 1000}s`,
    value: opt,
  }));

  options.push({ label: 'Adaptive', value: 0 });

  return (
    <select
      value={value}
      onChange={(e) => {
        onChanged(parseInt(e.target.value));
      }}
      {...props}
    >
      {options.map((opt, index) => {
        return (
          <option
            key={index}
            value={opt.value}
          >
            {opt.label}
          </option>
        );
      })}
    </select>
  );
}
