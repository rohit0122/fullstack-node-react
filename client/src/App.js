import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./Home"
import Edit from "./Edit"
import Contact from "./Contact"
import Layout from "./components/Layout";
import Home2 from "./Home2";
import Home3 from "./Home3";

function App() {
 return (
   <div className="App">
     <BrowserRouter>
       <Routes>
         <Route element={<Layout />} >
           <Route path="/" element={<Home />} />
           <Route path="edit" element={<Edit />} />
           <Route path="contact" element={<Contact />} />
           <Route path="home2" element={<Home2 />} />
           <Route path="home3" element={<Home3 />} />
         </Route>
       </Routes>
     </BrowserRouter>
   </div>
 )
}

export default App;