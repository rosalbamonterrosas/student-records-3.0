import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddStudent from "./pages/AddStudent";
import UpdateStudent from "./pages/UpdateStudent";
import DeleteStudent from "./pages/DeleteStudent";
import GetStudent from "./pages/GetStudent";
import SearchStudent from "./pages/SearchStudent";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/addStudent" element={<AddStudent />} />
          <Route path="/updateStudent" element={<UpdateStudent />} />
          <Route path="/deleteStudent" element={<DeleteStudent />} />
          <Route path="/getStudent" element={<GetStudent />} />
          <Route path="/searchStudent" element={<SearchStudent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
