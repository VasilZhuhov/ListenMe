const playlist = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('playlist', {
    title: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER
    },
  });

  return Playlist;
};
module.exports = playlist;