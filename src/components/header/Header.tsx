type HeaderProps = {
  header: string;
};

const Header = ({ header }: HeaderProps) => {
  return (
    <>
      <div className=" flex justify-center items-center mt-32 mb-8 lg:mt-36 lg:mb-5">
        <h2 className="font-semibold text-center text-3xl lg:text-4xl">
          {header}
        </h2>
      </div>
    </>
  );
};

export default Header;
