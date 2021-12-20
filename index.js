require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const { response } = require("express");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// Exercise 3.7
// app.use(morgan("tiny"));

// Exercise 3.8
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Show info page
app.get("/info", (req, res) => {
	const date = new Date();
	const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `;
	res.send(info);
});

// GET - all persons
app.get("/api/persons", (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons);
	});
});

// GET - single person by id
app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			res.json(person);
		})
		.catch((error) => next(error));
});

// DELETE - person by id
app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

// POST – create new person
app.post("/api/persons", (req, res, next) => {
	const { name, number } = req.body;

	if (!req.body) {
		return res.status(400).json({ error: "content missing" });
	}

	const person = new Person({
		name,
		number,
	});

	person.save().then((savedPerson) => {
		res.json(savedPerson);
	});
});

// PUT - update person number
app.put("/api/persons/:id", (req, res, next) => {
	const { number } = req.body;

	const person = {
		number,
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then((updatedPerson) => {
			res.json(updatedPerson);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
