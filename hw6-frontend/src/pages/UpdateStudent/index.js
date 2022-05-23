import { useState } from "react";

/**
 * When the form is submitted, fetch is used to send a request using the put
 * method. The url of the request includes the record id from the user input.
 * The request body includes the first name, last name, gpa, and enrollment
 * status of the student. A success or error message is displayed depending on
 * the result of the request.
 */
function UpdateStudent() {
  let [recordId, setRecordId] = useState("");
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [gpa, setGpa] = useState("");
  let [enrolled, setEnrolled] = useState(null);
  let [response, setResponse] = useState("");
  let [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear error
    setResponse(""); // clear response
    try {
      let res = await fetch("http://localhost:5678/students/" + recordId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          gpa: gpa,
          enrolled: enrolled,
        }),
      });
      setLoading(false);
      if (res.status === 201) {
        // successful request
        // clear input fields
        setRecordId("");
        setFirstName("");
        setLastName("");
        setGpa("");
        setEnrolled(null);
        // get response data
        res.json().then((data) => {
          setResponse(data.message);
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
      <h1 class="text-center">Update Student</h1>
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
            required
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
            required
          />
        </div>
        <br />
        <div className="row">
          <label htmlFor="gpa" className="col-4 text-end">
            GPA:
          </label>
          <input
            type="number"
            id="gpa"
            name="gpa"
            step="0.01"
            min="0"
            max="4"
            className="col-4"
            value={gpa}
            onChange={(e) => {
              setGpa(e.target.value);
            }}
            required
          />
        </div>
        <br />
        <label htmlFor="enrolled" className="col-4 text-end">
          Enrolled:
        </label>

        <input
          type="radio"
          id="yes"
          name="enrolled"
          value="Yes"
          checked={enrolled === "Yes"}
          onChange={(e) => {
            setEnrolled(e.target.value);
          }}
          required
        />
        <label htmlFor="true">Yes</label>

        <input
          type="radio"
          id="no"
          name="enrolled"
          value="No"
          checked={enrolled === "No"}
          onChange={(e) => {
            setEnrolled(e.target.value);
          }}
        />
        <label htmlFor="false">No</label>
        <br />
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

export default UpdateStudent;
