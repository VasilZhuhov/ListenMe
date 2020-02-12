const artist = (sequelize, DataTypes) => {
  const Artist = sequelize.define('artist', {
    name: {
      type: DataTypes.STRING,
    },
  });

  return Artist;
};
module.exports = artist;