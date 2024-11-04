import piggyBankImage from "../assets/piggyBank.png";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center ml-4 md:ml-8 gap-2">
        <img
          src={piggyBankImage}
          alt="piggy-bank-icon"
          className="h-12 w-18 mt-6"
        />

        <p className="tracking-tight text-3xl mt-8 font-bold ">B-Splitz</p>
      </div>
      <section className="flex h-fit space-y-8 items-center justify-center mt-2 mx-12">
        <div>
          <h1 className="tracking-tighter mt-24 mb-2 text-4xl font-bold text-center md:text-6xl md:mb-4  md:mx-80">
            Split transactions with ease
          </h1>
          <p className="text-2xl text-center text-gray-600 mx-20">
            Simplify outing expenses.
          </p>
          <div className="mt-10 text-center ">
            <Button onClick={() => navigate("signup")}>Start Splitting</Button>
          </div>
        </div>

        {/* <div className="flex items-center justify-center">
          <img
            src={piggyBankImage}
            alt="piggy-bank-icon"
            className="h-48 w-66 object-contain mb-10 "
          />
        </div> */}
      </section>
    </>
  );
};

export default Hero;
