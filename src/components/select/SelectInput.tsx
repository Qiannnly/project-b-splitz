import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Options } from "../../shared/types";

interface SelectListProps {
  options: Options[];
  onChange: (value: string) => void;
  text: string;
}

const SelectInput = ({ onChange, options, text }: SelectListProps) => {
  return (
    <>
      <Select onValueChange={(value) => onChange(value)}>
        <SelectTrigger>
          <SelectValue placeholder={text} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ value, id }) => (
              <SelectItem value={id} key={id}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectInput;
