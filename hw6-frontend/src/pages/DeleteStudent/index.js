import { useState } from "react";

/**
 * When the form is submitted, fetch is used to send a request using the
 * delete method. The url of the request includes the record id from the user
 * input. A success or error message is displayed depending on the result of
 * the request.
 */
function DeleteStudent() {
  let [recordId, setRecordId] = useState("");
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
        method: "DELETE",
      });
      setLoading(false);
      if (res.status === 200) {
        // successful request
        setRecordId(""); // clear input field
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
      <h1 class="text-center">Delete Student</h1>
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

export default DeleteStudent;
