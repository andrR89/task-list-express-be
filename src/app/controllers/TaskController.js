import Task from '../models/Task';
import * as Yup from 'yup';

class TaskController {
  async store(req, res) {
    const schema = Yup.object().shape({
      task: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const { task } = req.body;

    const createdTask = await Task.create({
      user_id: req.userId,
      task,
    });
    return res.json(createdTask);
  }

  async index(req, res) {
    // Query param
    const status = req.query.status ? req.query.status : false;
    const tasks = await Task.findAll({
      where: { user_id: req.userId, check: status },
    });

    return res.json(tasks);
  }

  async update(req, res) {
    const { task_id } = req.params;

    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ error: 'Invalid task' });
    }

    await task.update(req.body);

    return res.json(task);
  }

  async delete(req, res) {
    const { task_id } = req.params;

    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ error: 'Invalid task' });
    }

    if(task.user_id !== req.userId){
      return res.status(401).json({ error: 'User not owner of this task' });
    }

    await task.destroy();

    return res.send();
  }
}

export default new TaskController();
