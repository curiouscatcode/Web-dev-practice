import { Download } from "lucide-react";
const Btn11 = () => {
  return (
    <div className="py-4 mt-2">
      <button className="bg-black text-white mx-auto flex items-center px-4 py-3 cursor-pointer gap-2 hover:bg-neutral-700 rounded-xl shadow-[2px_2px_5px_#fff] border-2 ">
        <Download />
        Download
      </button>
    </div>
  );
};
export default Btn11;
