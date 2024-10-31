const Logo = () => {
  return (
    <>
      <div className="flex flex-col p-20 bg-red-100 rounded-lg">
        <div className="flex ">
          <div>
            <span className="w-9 h-9 text-3xl rounded-tr-3xl rounded-bl-3xl bg-pink-600 text-transparent">
              logo
            </span>
            <span className="w-9 h-9 text-3xl rounded-tl-3xl rounded-br-3xl bg-blue-600 text-transparent">
              logo
            </span>
          </div>
        </div>
        <div>
          <span className="w-9 h-9 text-3xl rounded-tl-3xl rounded-br-3xl bg-orange-600 text-transparent">
            logo
          </span>
          <span className="w-9 h-9 text-3xl rounded-bl-3xl rounded-tr-3xl bg-purple-600 text-transparent">
            logo
          </span>
        </div>
      </div>
    </>
  );
};

export default Logo;
