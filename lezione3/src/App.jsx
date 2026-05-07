import "./App.css";

import Home from "./pages/Home";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import DettaglioProdotto from "./pages/DettaglioProdotto";
import { Routes, Route, } from "react-router-dom";
import Layout from "./components/Layout";

function App() {



  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home/>}></Route>
          <Route path="/stats" element={<Stats />}></Route>
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/dettaglioProdotto/:id" element={<DettaglioProdotto/>}></Route>
        </Route>
      </Routes>
      {/* il contenitore che legge url corrente */}

      


    </>
  );
}

export default App;
