import piggyBankImage from "../assets/piggyBank.png";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
      <p className="text-8xl text-left mt-8 font-bold ml-12">B-Splitz</p>

      <section className="h-fit space-y-8 items-center justify-center mt-10 mx-12">
        <div>
          <h1 className="mb-8 text-5xl font-semibold text-center lg:text-6xl lg:mb-4  lg:mx-80">
            Split transactions with ease
          </h1>
          <p className="text-2xl text-center text-gray-600 mx-20">
            Simplify outing expenses.
          </p>
          <div className="mt-10 text-center ">
            <Button onClick={() => navigate("signup")}>Start Splitting</Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={piggyBankImage}
            alt="piggy-bank-icon"
            className="h-48 w-66 object-contain mb-10 "
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
