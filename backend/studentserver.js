//studentserver.js

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const MongoClient = require("mongodb").MongoClient;
var uri = "mongodb://127.0.0.1:27017/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

/**
 * Creates a record id based on the current time value, and adds the new
 * student to the database if there is no duplicate found.
 */
app.post("/students", function (req, res) {
  var recordId = new Date().getTime();
  return addStudent(recordId, req, res);
});

/**
 * Connects to MongoDB using the url "mongodb://127.0.0.1:27017/". The
 * database "FAU" is retrieved, and a JSON object for the new student is
 * created. A query is defined to check for duplicates based on the first and
 * last name of each student inside the "students" collection in the "FAU"
 * database. If a duplicate is found, an error message is sent. If there is no
 * duplicate, the new student is inserted into the collection.
 *
 * @param {*} recordId the unique record id of a student
 * @param {*} req the request
 * @param {*} res the response of the request
 */
const addStudent = (recordId, req, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res
          .status(500)
          .send({
            message:
              "error - internal server error: cannot connect to database",
          });
      }
      var dbo = client.db("FAU");
      // Create JSON object for student to insert
      var obj = createStudentObj(recordId, req);

      // Regex for case insensitive query for exact match of first and last name
      var query = {
        $and: [
          { firstName: new RegExp(`^${obj.firstName}$`, "i") },
          { lastName: new RegExp(`^${obj.lastName}$`, "i") },
        ],
      };

      dbo.collection("students").findOne(query, function (err, mongoRes) {
        if (err) {
          return res
            .status(500)
            .send({ message: "error - internal server error: cannot fetch" });
        }
        if (mongoRes == null) {
          // no duplicate found
          //insert into the students collection
          return insertStudentObj(recordId, obj, dbo, client, res);
        } else {
          // duplicate found
          client.close();
          return res
            .status(400)
            .send({
              message: `error - duplicate found for ${obj.firstName} ${obj.lastName}`,
            });
        }
      });
    }
  );
};

/**
 * Sets the id, first name, last name, gpa, and enrollment status of the
 * student's object based on the request body. Returns the student's object.
 *
 * @param {*} recordId the unique record id of a student
 * @param {*} req the request
 */
const createStudentObj = (recordId, req) => {
  var obj = {};
  obj._id = recordId;
  obj.firstName = req.body.firstName;
  obj.lastName = req.body.lastName;
  obj.gpa = parseFloat(req.body.gpa);
  obj.enrolled = req.body.enrolled;
  return obj;
};

/**
 * Inserts the object as a new document inside the "students" collection.
 * Returns the status and response object in the response.
 *
 * @param {*} recordId the unique record id of a student
 * @param {*} obj the object containing a student's id, first name, last name,
 * gpa, and enrollment status
 * @param {*} dbo database in MongoDB
 * @param {*} client MongoClient that allows for connection to MongoDB
 * @param {*} res the response of the request
 */
const insertStudentObj = (recordId, obj, dbo, client, res) => {
  dbo.collection("students").insertOne(obj, function (err, mongoRes) {
    if (err) {
      return res
        .status(500)
        .send({ message: "error - internal server error: cannot insert" });
    }
    let rspObj = {};
    rspObj._id = recordId;
    rspObj.message = "successfully created";
    client.close();
    return res.status(201).send(rspObj);
  });
};

/**
 * Gets the record id from the parameter of the request URL. Finds the student
 * corresponding to that record id in the database and sends the student's data
 * in the response.
 */
app.get("/students/:recordId", function (req, res) {
  var recordId = parseInt(req.params.recordId);
  return findStudent(recordId, res);
});

/**
 * Connects to MongoDB using the url "mongodb://127.0.0.1:27017/". The
 * database "FAU" is retrieved, and a query is defined for filtering for
 * documents with the record id value for the "_id" key. The documents inside
 * the “students” collection in the “FAU” database are filtered based on the
 * query. If there is no document found from the query, an error message is
 * sent. If a document is found from the query, the document is returned.
 *
 * @param {*} recordId the unique record id of a student
 * @param {*} res the response of the request
 */
const findStudent = (recordId, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res
          .status(500)
          .send({
            message:
              "error - internal server error: cannot connect to database",
          });
      }
      var dbo = client.db("FAU");
      // Define a filter query
      var query = { _id: recordId };

      dbo.collection("students").findOne(query, function (err, mongoRes) {
        if (err) {
          return res
            .status(500)
            .send({ message: "error - internal server error: cannot fetch" });
        }
        var rspObj = {};
        client.close();
        if (mongoRes == null) {
          // no match found
          rspObj._id = recordId;
          rspObj.status = 404;
          rspObj.message = "error - resource not found";
          return res.status(rspObj.status).send(rspObj);
        } else {
          // match found
          return res.status(200).send(mongoRes);
        }
      });
    }
  );
};

/**
 * Gets the first name and last name of the student from the query parameters
 * if included in the request URL. Searches the database to find a match for
 * the first name and/or last name.
 */
app.get("/students", function (req, res) {
  var firstName = req.query.firstName;
  var lastName = req.query.lastName;
  return searchStudents(firstName, lastName, res);
});

/**
 * Connects to MongoDB using the url "mongodb://127.0.0.1:27017/". The
 * database "FAU" is retrieved, and a query is defined to check for matches
 * based on the first and/or last name of each student inside the "students"
 * collection in the "FAU" database. If either the first name or last name is
 * not provided in the query parameter, an empty string is used in place of
 * the missing parameter to include all possibilities for that value. If
 * neither the first name or last name are provided in the request, all the
 * students are returned. The resulting documents from the search are returned
 * in an array. If there are no matches found, a message is returned.
 *
 * @param {*} firstName the first name in a student's object
 * @param {*} lastName the last name in a student's object
 * @param {*} res the response of the request
 */
const searchStudents = (firstName = "", lastName = "", res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res
          .status(500)
          .send({
            message:
              "error - internal server error: cannot connect to database",
          });
      }
      var dbo = client.db("FAU");

      // Regex for case insensitive query for starts with first and last name
      var query = {
        $and: [
          { firstName: new RegExp(`^${firstName}`, "i") },
          { lastName: new RegExp(`^${lastName}`, "i") },
        ],
      };

      dbo
        .collection("students")
        .find(query)
        .toArray(function (err, mongoRes) {
          if (err) {
            return res
              .status(500)
              .send({
                message: "error - internal server error: cannot search",
              });
          }
          client.close();
          if (mongoRes.length == 0) {
            // no matches found
            return res.status(200).send({ message: "No results found." });
          }
          return res.status(200).send(mongoRes); // match found
        });
    }
  );
};

/**
 * Gets the record id from the parameter of the request URL. Updates a
 * student's document in the database using the first name, last name, gpa,
 * and enrollment status of the student included in the request body.
 */
app.put("/students/:recordId", function (req, res) {
  var recordId = parseInt(req.params.recordId);
  var obj = createStudentObj(recordId, req);
  return updateStudent(recordId, obj, res);
});

/**
 * Connects to MongoDB using the url "mongodb://127.0.0.1:27017/". The
 * database "FAU" is retrieved, and a query is defined for filtering for
 * documents with the record id value for the "_id" key. The new values for the
 * fields in the student's object are also defined. The documents inside
 * the “students” collection in the “FAU” database are filtered based on the
 * query. If there is no document found from the query, an error message is
 * sent. If a document is found from the query, the document is updated with
 * the new values, and the status and response object are returned in the
 * response.
 *
 * @param {*} recordId the unique record id of a student
 * @param {*} obj the object containing a student's id, first name, last name,
 * gpa, and enrollment status
 * @param {*} res the response of the request
 */
const updateStudent = (recordId, obj, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res
          .status(500)
          .send({
            message:
              "error - internal server error: cannot connect to database",
          });
      }
      var dbo = client.db("FAU");
      // Define a filter query
      var query = { _id: recordId };
      var newvals = {
        $set: {
          firstName: obj.firstName,
          lastName: obj.lastName,
          gpa: obj.gpa,
          enrolled: obj.enrolled,
        },
      };

      dbo
        .collection("students")
        .updateOne(query, newvals, function (err, mongoRes) {
          if (err) {
            return res
              .status(500)
              .send({
                message: "error - internal server error: cannot update",
              });
          }
          var rspObj = {};
          rspObj._id = recordId;
          if (mongoRes.modifiedCount == 0) {
            // no match found
            rspObj.status = 404;
            rspObj.message = "error - resource not found";
          } else {
            // match found
            rspObj.status = 201;
            rspObj.message = "successfully updated";
          }
          client.close();
          return res.status(rspObj.status).send(rspObj);
        });
    }
  );
};

/**
 * Gets the record id from the parameter of the request URL. Deletes the
 * student in the database pertaining to that record id.
 */
app.delete("/students/:recordId", function (req, res) {
  var recordId = parseInt(req.params.recordId);
  return deleteStudent(recordId, res);
});

/**
 * Connects to MongoDB using the url "mongodb://127.0.0.1:27017/". The
 * database "FAU" is retrieved, and a query is defined for filtering for
 * documents with the record id value for the "_id" key. The documents inside
 * the “students” collection in the “FAU” database are filtered based on the
 * query. If there is no document found from the query, an error message is
 * sent. If a document is found from the query, the document is deleted from
 * the database, and the status and response object are returned in the
 * response.
 *
 * @param {*} recordId the unique record id of a student
 * @param {*} res the response of the request
 */
const deleteStudent = (recordId, res) => {
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (err, client) {
      if (err) {
        return res
          .status(500)
          .send({
            message:
              "error - internal server error: cannot connect to database",
          });
      }
      var dbo = client.db("FAU");
      // Define a filter query
      var query = { _id: recordId };

      dbo.collection("students").deleteOne(query, function (err, mongoRes) {
        if (err) {
          return res
            .status(500)
            .send({ message: "error - internal server error: cannot delete" });
        }
        var rspObj = {};
        rspObj._id = recordId;
        if (mongoRes.deletedCount == 0) {
          // no match found
          rspObj.status = 404;
          rspObj.message = "error - resource not found";
        } else {
          // match found
          rspObj.status = 200;
          rspObj.message = "record deleted";
        }
        client.close();
        return res.status(rspObj.status).send(rspObj);
      });
    }
  );
};

app.listen(5678); //start the server
console.log("Server is running...");
