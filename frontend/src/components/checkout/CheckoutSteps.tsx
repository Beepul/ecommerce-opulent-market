import { useNavigate } from "react-router-dom";


interface CheckoutStepsProps {
  active: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ active }) => {
  const navigate = useNavigate()

  const handleNavigate = (n:number,to:string) => {
    if(n <= active){
      navigate(to)
    }else{
      return
    }
  }
  return (
    <div className="max-w-fit mx-auto flex items-center py-12 sm:flex-row flex-col gap-2 sm:gap-0">
        <span onClick={() => handleNavigate(1,'/checkout')} className={`${active >= 1 ? 'bg-primary text-white cursor-pointer' : 'bg-trasparent border-[2px] sm:border-[3px] border-primary text-primary font-semibold'}  md:py-2 py-1 md:px-8 md:text-base sm:text-sm text-[12px] px-4 rounded-[32px] text-center`}>1.Shipping</span>
        <div className="lg:min-w-[90px] md:min-w-[40px] sm:min-w-[25px] min-w-[100%] sm:h-[4px] h-[2px] bg-primary"></div>
        <span onClick={() => handleNavigate(2,'/payment')} className={`${active >= 2 ? 'bg-primary text-white cursor-pointer' : 'bg-trasparent  border-[2px] sm:border-[3px] border-primary text-primary font-semibold'}  md:py-2 py-1 md:px-8 md:text-base sm:text-sm text-[12px] px-4 rounded-[32px] text-center`}>2.Payment</span>
        <div className="lg:min-w-[90px] md:min-w-[40px] sm:min-w-[25px] min-w-[100%] sm:h-[4px] h-[2px] bg-primary"></div>
        <span onClick={() => handleNavigate(3,'/checkout-success')} className={`${active >= 3 ? 'bg-primary text-white cursor-pointer' : 'bg-trasparent  border-[2px] sm:border-[3px] border-primary text-primary font-semibold'}  md:py-2 py-1 md:px-8 md:text-base sm:text-sm text-[12px] px-4 rounded-[32px] text-center`}>3.Success</span>
    </div>
  );
};

export default CheckoutSteps;