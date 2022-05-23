import { useState } from "react";
import Table from "react-bootstrap/Table";

/**
 * When the form is submitted, fetch is used to send a request using the get
 * method. The url of the request includes the first name and last name query
 * parameters if provided by the user. The students' data or error message is
 * displayed depending on the result of the request.
 */
function SearchStudent() {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [students, setStudents] = useState(null);
  let [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let [response, setResponse] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // clear output
    setError("");
    setStudents("");
    setResponse("");

    // set the value of query parameters
    var params = new URLSearchParams({
      firstName: firstName,
      lastName: lastName,
    });

    try {
      let res = await fetch("http://localhost:5678/students/?" + params, {
        method: "GET",
      });
      setLoading(false);
      if (res.status === 200) {
        // successful request
        // get response data
        res.json().then((data) => {
          // the response is an array only if a match was found
          Array.isArray(data) ? setStudents(data) : setResponse(data.message);
        });
      } else {
        // encountered an error
        res.json().then((err) => {
          setError(err.message);
        });
      }
    } catch (err) {
      // failed to send request
      setLoading(false);
      setError("Unable to send request.");
    }
  };

  return (
    <div className="container-fluid">
      <p class="text-center">Rosalba Monterrosas Z23361820</p>
      <h1 class="text-center">Search Students</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="firstName" className="col-4 text-end">
            First name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className="col-4"
          />
        </div>
        <br />
        <div className="row">
          <label htmlFor="lastName" className="col-4 text-end">
            Last name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className="col-4"
          />
        </div>
        <br />
        <div className="row">
          <div className="col-5"></div>
          <input
            type="submit"
            value={loading ? "Submitting..." : "Submit"}
            className="btn-light col-2"
          />
        </div>
      </form>
      <br />
      <br />
      {students && (
        <Table striped variant="light">
          <thead>
            <tr>
              <th>Record ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>GPA</th>
              <th>Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                {Object.values(student).map((val) => (
                  <td key={val}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <div id="response" name="response" className="text-center">
        {response ? <p>{response}</p> : null}
      </div>
      <div id="error" name="error" className="text-center">
        {error ? (
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        ) : null}
      </div>
    </div>
  );
}

export default SearchStudent;
