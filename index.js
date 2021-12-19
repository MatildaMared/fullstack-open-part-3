const express = require("express");
const app = express();

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.use(express.json());

// Show info page
app.get("/info", (req, res) => {
	const date = new Date();
	const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `;
	res.send(info);
});

// GET all persons
app.get("/api/persons", (req, res) => {
	res.status(200).json(persons);
});

// GET single person by id
app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((person) => person.id === id);

	if (person) {
		res.status(200).json(person);
	} else {
		res.status(404).end();
	}
});

// DELETE person by id
app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((person) => person.id !== id);
	res.status(204).end();
});

// CREATE new person
app.post("/api/persons", (req, res) => {
	const { name, number } = req.body;
	const id = Math.floor(Math.random() * 1000000);
	const person = {
		name,
		number,
		id,
	};
	persons = persons.concat(person);
	res.status(201).json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
