const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/tasksDB', { useNewUrlParser: true, useUnifiedTopology: true });

            const taskSchema = new mongoose.Schema({
                    title: String,
                            description: String,
                        category: String,
                isDeleted: { type: Boolean, default: false }
            });

            const Task = mongoose.model('Task', taskSchema);

            app.post('/tasks', async (req, res) => {
                const task = new Task({
                             title: req.body.title,
                    description: req.body.description,
                                category: req.body.category
                });
                await task.save();
                res.status(201).send(task);
            });

            app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({ isDeleted: false });
    res.status(200).send(tasks);
});

app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task || task.isDeleted) return res.status(404).send('Task not found');
    res.status(200).send(task);
});

app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task || task.isDeleted) return res.status(404).send('Task not found');
    res.status(200).send(task);
});

        app.delete('/tasks/:id', async (req, res) => {
            const task = await Task.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
            if (!task) return res.status(404).send('Task not found');
            res.status(200).send(task);
        });

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });