# Student Records - React, MongoDB, Node.js, and Express

Rosalba Monterrosas

# Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
  - [Versions](#versions)
  - [Deploying the Application](#deploying-the-application)
- [Project Explanation](#project-explanation)
  - [Add Student](#add-student)
  - [Update Student](#update-student)
  - [Delete Student](#delete-student)
  - [Get Student](#get-student)
  - [Search Students](#search-students)

## About the Project

This project contains a main home page at http://localhost:3000/, where the
user can click on one of the following five options: add a student, update a student, delete a student, get a student, or search the students. The following HTTP methods are used in the request for each option:

- POST: create a new student and checks for duplicates
- PUT: update a student by record id
- DELETE: delete a student by record id
- GET: display a single student by record id
- GET: list all students, or search for students based on first and/or last name

The frontend interacts with the existing backend (studentserver.js).

### Built With

- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Node.js](https://nodejs.org/)
- [HTML](https://html.com)
- [CSS](https://www.w3.org/Style/CSS/)
- [Bootstrap](https://getbootstrap.com)
- [JavaScript](https://www.javascript.com/)
- [JQuery](https://jquery.com)
- [Font Awesome](https://fontawesome.com/)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Versions

- node v17.5.0
- npm v8.4.1
- Bootstrap v5

### Deploying the Application

1.	Install the following
    * node v16.14.0
    * npm v8.4.1
    *	MongoDB
    * Prettier

2.	Run the command `npm install` to install all modules listed as dependencies 
in `package.json`

3.	Start MongoDB

4.	Run the command `node studentserver.js` under the `backend` folder to start 
the server

5.	Run the command `npm start` under the `hw6-frontend` folder to run the 
React app in the development mode.

## Project Explanation

### Add Student

Clicking on the “Add student” option in the home page routes to http://localhost:3000/addStudent in a new tab.

When the form is submiited in the Add Student webpage, fetch is used to send a request using the POST method. The request body includes the first name, last name, gpa, and enrollment status of the student. A success or error message is displayed depending on the result of the request.

```
function AddStudent() {
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
      let res = await fetch("http://localhost:5678/students", {
        method: "POST",
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
      <h1 class="text-center">Add Student</h1>
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

export default AddStudent;
```

The function below is the POST method in the studentserver.js file, which
creates a record id based on the current time value, and adds the new student
to the database if there is no duplicate found.

```
app.post('/students', function(req, res) {
  var recordId = new Date().getTime();
  return addStudent(recordId, req, res);
});
```

### Update Student

Next, clicking on the “Update student” option in the home page routes to
http://localhost:3000/updateStudent in a new tab.

When the form is submiited in the Update Student webpage, fetch is used to
send a request using the PUT method. The url of the request includes the
record id from the user input. The request body includes the first name, last name, gpa, and enrollment status of the student. A success or error message is displayed depending on the result of the request.

```
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
```

The function below is the PUT method in the studentserver.js file, which gets
the record id from the parameter of the request URL. Updates a student's
document in the database using the first name, last name, gpa, and enrollment
status of the student included in the request body.

```
app.put('/students/:recordId', function(req, res) {
  var recordId = parseInt(req.params.recordId);
  var obj = createStudentObj(recordId, req);
  return updateStudent(recordId, obj, res);
});
```

### Delete Student

Next, clicking on the “Delete student” option in the home page routes to
http://localhost:3000/deleteStudent in a new tab.

When the form is submiited in the Delete Student webpage, fetch is used to
send a request using the DELETE method. The url of the request includes the record id from the user input. A success or error message is displayed
depending on the result of the request.

```
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
```

The function below is the DELETE method in the studentserver.js file, which
gets the record id from the parameter of the request URL. Deletes the student
in the database pertaining to that record id.

```
app.delete('/students/:recordId', function(req, res) {
  var recordId = parseInt(req.params.recordId);
  return deleteStudent(recordId, res);
});
```

### Get Student

Next, clicking on the “Get student” option in the home page routes to
http://localhost:3000/getStudent in a new tab.

When the form is submiited in the Get Student webpage, fetch is used to send
a request using the GET method. The url of the request includes the record id from the user input. The student's data or error message is displayed
depending on the result of the request.

```
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
```

The function below is the GET method in the studentserver.js file for getting a
single student based on their record id, which gets the record id from the
parameter of the request URL. Finds the student corresponding to that record id
in the database and sends the student's data in the response.

```
app.get('/students/:recordId', function(req, res) {
  var recordId = parseInt(req.params.recordId);
  return findStudent(recordId, res);
});
```

### Search Students

Lastly, clicking on the “Search students” option in the home page routes to
http://localhost:3000/searchStudent in a new tab.

When the form is submiited in the Search Students webpage, fetch is used to
send a request using the GET method. The url of the request includes the first name and last name query parameters if provided by the user. The students'
data or error message is displayed depending on the result of the request.

```
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
```

The function below is the GET method in the studentserver.js file for
listing and searching for students, which gets the first name and last name of
the student from the query parameters if included in the request URL. Searches
the database to find a match for the first name and/or last name.

```
app.get('/students', function(req, res) {
  var firstName = req.query.firstName;
  var lastName = req.query.lastName;
  return searchStudents(firstName, lastName, res);
});
```
