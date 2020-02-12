const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    }
  });

  User.findByName = async key => {
    let user = await User.findOne({
        where: {name: key},
    });
    return user;
  };

  User.findByCredentials = async key => {
    let user = await User.findOne({
      where: {name: key.name, password: key.password},
    });
    return user;
  };


  User.addUser = async newUser => {
    let c = await User.count({where: newUser});
    if(c == 0){
      let newlyUser = await User.create(newUser);
      await newlyUser.save();
      return JSON.stringify(newlyUser, null, 4);
    }else{
      return false;
    }

  };

  return User;
};
module.exports = user;