const { User } = require('../../lib/db');

function toSafeUser(user) {
  if (!user) return null;
  const plain = typeof user.toJSON === 'function' ? user.toJSON() : user;
  const { passwordHash, ...rest } = plain;
  return rest;
}

const userService = {
  async getById(userId) {
    const user = await User.findOne({ where: { id: userId } });
    return toSafeUser(user);
  },

  async updateMe(userId, data) {
    const updates = {};
    if (data.fullName != null) updates.fullName = data.fullName;
    if (data.phone != null) updates.phone = data.phone;

    if (Object.keys(updates).length === 0) {
      const err = new Error('No valid fields to update');
      err.status = 400;
      throw err;
    }

    await User.update(updates, { where: { id: userId } });
    return this.getById(userId);
  },
};

module.exports = { userService };
