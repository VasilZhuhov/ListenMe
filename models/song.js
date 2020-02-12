const song = (sequelize, DataTypes) => {
  const Song = sequelize.define('song', {
    title: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.STRING,
    },
  });

  Song.findByTitle = async key => {
    let song = await Song.findOne({
        where: {title: key},
    });
    return song;
  };

  Song.getPage = async (offset) => {
    let records = await Song.findAll({ offset: offset, limit: 10 });
    return records;
  };

  return Song;
};
module.exports = song;