import { Input } from "../ui/input";

type InputProps = {
  Icon: React.ElementType;
  value: string | null;
};

const ProfileInput = ({ Icon, value }: InputProps) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4 my-6">
        {Icon && <Icon size={"32px"} className="pt-1" />}
        <Input defaultValue={value || undefined} />
      </div>
    </>
  );
};

export default ProfileInput;
