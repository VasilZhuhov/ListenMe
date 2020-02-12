const playlist_song = (sequelize, DataTypes) => {
  const Playlist_song = sequelize.define('playlist_song', {
    playlist_id: {
      type: DataTypes.INTEGER
    },
    song_id: {
      type: DataTypes.INTEGER
    },
  });

  Playlist_song.removeAttribute('id');
  return Playlist_song;
};
module.exports = playlist_song;