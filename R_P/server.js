const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
const RESOURCE = "records";
let records = [
    { id: 1, name: "ANU", department: "ECE" },
    { id: 2, name: "RAVI", department: "CSE" },
    { id: 3, name: "PRIYA", department: "IT" },
    { id: 4, name: "KUMAR", department: "EEE" }
];
app.get("/", (req, res) => {
    res.send("REST API is running successfully");
});
app.get(`/api/${RESOURCE}`, (req, res) => {
    res.json(records);
});
app.get(`/api/${RESOURCE}/:id`, (req, res) => {
    const item = records.find(
        r => String(r.id) === req.params.id
    );
    if (!item) {
        return res.status(404).json({
            message: "Record not found"
        });
    }
    res.json(item);
});
app.post(`/api/${RESOURCE}`, (req, res) => {
    const { name, department } = req.body;
    if (!name || !department) {
        return res.status(400).json({
            message: "Name and department are required"
        });
    }
    const newRecord = {
        id: records.length
            ? Math.max(...records.map(r => Number(r.id))) + 1
            : 1,
        name,
        department
    };
    records.push(newRecord);
    res.status(201).json({
        message: "Record added successfully",
        data: newRecord
    });
});
app.put(`/api/${RESOURCE}/:id`, (req, res) => {
    const item = records.find(
        r => String(r.id) === req.params.id
    );
    if (!item) {
        return res.status(404).json({
            message: "Record not found"
        });
    }
    const { name, department } = req.body;
    if (!name || !department) {
        return res.status(400).json({
            message: "Name and department are required"
        });
    }
    item.name = name;
    item.department = department;
    res.json({
        message: "Record updated successfully",
        data: item
    });
});
app.delete(`/api/${RESOURCE}/:id`, (req, res) => {
    const index = records.findIndex(
        r => String(r.id) === req.params.id
    );
    if (index === -1) {
        return res.status(404).json({
            message: "Record not found"
        });
    }
    const deletedRecord = records.splice(index, 1)[0];
    res.json({
        message: "Record deleted successfully",
        data: deletedRecord
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
