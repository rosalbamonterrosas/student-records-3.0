import { useState } from "react";
import Table from "react-bootstrap/Table";

/**
 * When the form is submitted, fetch is used to send a request using the get
 * method. The url of the request includes the record id from the user input.
 * The student's data or error message is displayed depending on the result of
 * the request.
 */
function GetStudent() {
  let [recordId, setRecordId] = useState("");
  let [student, setStudent] = useState("");
  let [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear error
    setStudent(""); // clear student result
    try {
      let res = await fetch("http://localhost:5678/students/" + recordId, {
        method: "GET",
      });
      setLoading(false);
      if (res.status === 200) {
        // successful request
        setRecordId(""); // clear input field
        // get response data
        res.json().then((data) => {
          setStudent(data);
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
      <h1 class="text-center">Get Student</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="recordId" className="col-4 text-end">
            Record ID:
          </label>
          <input
            type="number"
            id="recordId"
            name="recordId"
            className="col-4"
            value={recordId}
            onChange={(e) => {
              setRecordId(e.target.value);
            }}
            required
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
      {student && (
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
            <tr>
              {Object.values(student).map((val) => (
                <td key={val}>{val}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      )}
      <div id="error" name="error" className="text-center">
        {error ? (
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        ) : null}
      </div>
    </div>
  );
}

export default GetStudent;
