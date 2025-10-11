import { Share2 } from "lucide-react";
const Btn12 = () => {
  return (
    <div className="py-4 mt-2">
      <button className="bg-white text-black mx-auto flex items-center px-4 py-2 cursor-pointer gap-2 hover:bg-neutral-700 hover:border-white hover:text-white rounded-xl shadow-[2px_2px_5px_#fff] border-2 hover:-translate-y-1 transition-all duration-300">
        <Share2 />
        Share
      </button>
    </div>
  );
};
export default Btn12;
