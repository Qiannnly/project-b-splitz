type SplitOptionButtonsProps = {
  splitOption: string;
  setSplitOption: (value: string) => void;
};

const SplitOptionButtons = ({
  splitOption,
  setSplitOption,
}: SplitOptionButtonsProps) => {
  return (
    <>
      <div className="space-x-10 justify-center items-center flex">
        <p
          onClick={() => setSplitOption("evenly")}
          className={`cursor-pointer ${
            splitOption === "evenly" && "underline underline-offset-4"
          } "hover:underline hover:underline-offset-4"`}
        >
          Split evenly
        </p>
        <p
          onClick={() => setSplitOption("between")}
          className={`cursor-pointer ${
            splitOption === "between" && "underline underline-offset-4"
          } "hover:underline hover:underline-offset-4 hover:cursor-pointer"`}
        >
          Split between
        </p>
      </div>
    </>
  );
};

export default SplitOptionButtons;
