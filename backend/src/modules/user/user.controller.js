const { userService } = require('./user.service');

const userController = {
  async getMe(req, res) {
    const user = await userService.getById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  },

  async updateMe(req, res) {
    try {
      const user = await userService.updateMe(req.userId, req.body || {});
      res.json({ user });
    } catch (err) {
      if (err.status === 400) {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  },
};

module.exports = { userController };
