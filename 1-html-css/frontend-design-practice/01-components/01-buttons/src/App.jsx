import "./App.css";
import "./index.css";

import Btn01 from "../components/btn01";
import Btn02 from "../components/btn02";
import Btn03 from "../components/Btn03";
import Btn04 from "../components/Btn04";
import Btn05 from "../components/Btn05";

function App() {
  return (
    <>
      <div className="bg-amber-200">
        <Btn01 />
        <Btn02 />
        <Btn03 />
        <Btn04 />
        <Btn05 />
      </div>
    </>
  );
}

export default App;
