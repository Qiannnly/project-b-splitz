import {
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface FormFieldsProps {
  name: string;
  placeholder: string;
  type: string;
}

const FormFields = (data: FormFieldsProps) => {
  return (
    <FormField
      name={data.name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              placeholder={data.placeholder}
              type={data.type || "text"}
              {...field}
              className=" focus-visible:ring-0 border border-gray-500 shadow-md"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFields;
