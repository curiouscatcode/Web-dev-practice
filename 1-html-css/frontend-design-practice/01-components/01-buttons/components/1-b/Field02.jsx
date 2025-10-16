const Field02 = () => {
  return (
    <div className="mt-5 ml-1 relative">
      <label
        htmlFor="email"
        className="absolute left-5 -top-5  text-gray-500 text-sm transition-all duration-300 "
      >
        Email Address
      </label>
      <input
        className="bg-red-200 w-[30%] px-5 py-2.5 rounded-xl text-black focus-visible:scale-102 transition-all duration-300 focus:outline-indigo-300"
        type="email"
        placeholder="Enter mail Id "
      />
    </div>
  );
};
export default Field02;
