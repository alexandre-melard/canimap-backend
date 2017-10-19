import { Schema, model, connect } from 'mongoose';

export function buildUserSchema() {
    connect('localhost');
    const userSchema = new Schema({
        id: Number,
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        street: String,
        city: String,
        cp: String,
        club: String,
        helpers: [{
            key: String,
            visible: Boolean
        }],
        mapBoxes: [{
            key: String,
            opacity: Number,
            visible: Boolean
        }],
        lastLogin: Number,
        token: String,
    });
    const User = model('User', userSchema);
    const user = new User({id: 0, username: 'alex', password: 'alex'});
    user.save((err) => {
        console.log(err);
    });
    User.find({ id: 0 }).exec((user) => console.log(user));   
    User.remove({id: 0}, (err) => console.log(err)); 
}
