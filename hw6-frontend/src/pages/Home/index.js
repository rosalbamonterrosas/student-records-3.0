import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./style.css";

/**
 * Home page which displays the links to the different pages.
 */
const Home = () => {
  return (
    <div className="container-fluid">
      <p className="text-center">Rosalba Monterrosas Z23361820</p>
      <h1 className="text-center bottom-buffer">Student Records</h1>
      <div className="row">
        <div className="col-lg-1"></div>
        {/* <!-- Add student --> */}
        <div className="col-lg-2">
          <Link to="/addStudent" className="icon" target="_blank">
            <div className="text-center">
              <FontAwesomeIcon icon={solid("user-plus")} />
              <h2>Add student</h2>
            </div>
          </Link>
        </div>
        {/* <!-- Update student --> */}
        <div className="col-lg-2">
          <Link to="/updateStudent" className="icon" target="_blank">
            <div className="text-center">
              <FontAwesomeIcon icon={solid("user-pen")} />
              <h2>Update student</h2>
            </div>
          </Link>
        </div>
        {/* <!-- Delete student --> */}
        <div className="col-lg-2">
          <Link to="/deleteStudent" className="icon" target="_blank">
            <div className="text-center">
              <FontAwesomeIcon icon={solid("user-minus")} />
              <h2>Delete student</h2>
            </div>
          </Link>
        </div>
        {/* <!-- Get student --> */}
        <div className="col-lg-2">
          <Link to="/getStudent" className="icon" target="_blank">
            <div className="text-center">
              <FontAwesomeIcon icon={solid("user")} />
              <h2>Get student</h2>
            </div>
          </Link>
        </div>
        {/* <!-- Search students --> */}
        <div className="col-lg-2">
          <Link to="/searchStudent" className="icon" target="_blank">
            <div className="text-center">
              <FontAwesomeIcon icon={solid("magnifying-glass")} />
              <h2>Search students</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
