const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'listenme',
  'admin',
  'admin',
  {
    dialect: 'postgres',
    define: {
        timestamps: false,
        underscored: true
    }
  }
);
const models = {
    User: sequelize.import('./user'),
    Artist: sequelize.import('./artist'),
    Song: sequelize.import('./song'),
    Playlist: sequelize.import('./playlist'),
    Playlist_song: sequelize.import('./playlist_song'),
};

models.Song.belongsTo(models.Artist);
models.Artist.hasMany(models.Song, {foreignKey: 'artist_id'});

models.Playlist.belongsTo(models.User);
models.User.hasMany(models.Playlist, {foreignKey: models.Playlist.user_id});

models.Playlist_song.belongsTo(models.Playlist);
models.Playlist_song.belongsTo(models.Song);
models.Song.hasMany(models.Playlist_song, {foreignKey: models.Playlist_song.song_id});
models.Playlist.hasMany(models.Playlist_song, {foreignKey: models.Playlist_song.playlist_id});

module.exports = { models, sequelize };