const axios = require('axios');
const Dev = require('../models/Dev');

module.exports = {
    async index(req, res) {
        const { user } = req.headers;

        const loggedUser = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { id: { $ne: user } },
                { _id: { $nin: loggedUser.likes } },
                { _id: { $nin: loggedUser.deslikes } }
            ]
        });

        return res.json(users);
    },
    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if (userExists) {
            console.info("USER LOGADO: ", userExists._id);
            return res.json(userExists);
        }

        try {
            const { data: { name, bio, avatar_url: avatar } } = await axios.get(`https://api.github.com/users/${username}`);

            const dev = await Dev.create({ name, user: username, avatar, bio });

            console.info("USER CRIADO: ", dev._id);
            return res.json(dev);
        } catch (error) {
            return res.json(error);
        }
    }
}