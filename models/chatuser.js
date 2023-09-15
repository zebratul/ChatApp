const { Model, DataTypes } = require('sequelize');

class ChatUser extends Model {
    static init(sequelize) {
        super.init({
            username: { 
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    notEmpty: true, 
                    len: [3, 20]    
                }
            },
            email: { 
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,  
                    notEmpty: true
                }
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [6, 100]   
                }
            },
            is_admin: { 
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
        }, {
            sequelize,
            modelName: 'ChatUser',
            tableName: 'chat_users', 
            timestamps: true,
            underscored: true,
            paranoid: true, 
        });
    }
}

module.exports = { ChatUser };
