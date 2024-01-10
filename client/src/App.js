import { Routes, Route, BrowserRouter } from "react-router-dom"
import Home from "./Home"
import Edit from "./Edit"
import Contact from "./Contact"
import Layout from "./components/Layout";
import Home2 from "./Home2";
import Home3 from "./Home3";

function App(props) {
  const accessKey = new URLSearchParams(window.location.search).get('key');
 return (
   <div className="App">
     <BrowserRouter>
       <Routes>
         <Route element={<Layout />} >

           <Route exact path="/" element={accessKey == process.env.REACT_APP_LOCAL_ACCESS_KEY ? (<Home />) : (<Contact />)} />
           <Route path="edit" element={accessKey == process.env.REACT_APP_LOCAL_ACCESS_KEY ? (<Edit />) : (<Contact />)} />
           <Route path="contact" element={<Contact />} />
           <Route path="home2" element={accessKey == process.env.REACT_APP_LOCAL_ACCESS_KEY ? (<Home2 />) : (<Contact />)} />
           <Route path="home3" element={accessKey == process.env.REACT_APP_LOCAL_ACCESS_KEY ? (<Home3 />) : (<Contact />)} />
         </Route>
       </Routes>
     </BrowserRouter>
   </div>
 )
}

export default App;