import "./App.css";

function App() {
  return (
    <>
      <h2 className="text-7xl text-center font-semibold italic text-white bg-red-500">
        BUTTON 01
      </h2>

      <div className="bg-lime-200 mt-5 text-center p-20 ">
        <button className="bg-black text-white font-serif px-4 py-3 cursor-pointer hover:bg-gray-800 hover:scale-105 hover:shadow-lg transition-all duration-200">
          Click Me
        </button>
      </div>
    </>
  );
}

export default App;
