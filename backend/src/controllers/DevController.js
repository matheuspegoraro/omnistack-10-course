const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index, show, sotre, update, destroy 

module.exports = {
    async index(req, res) {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body;
    
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name = login, avatar_url, bio } = response.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                name, 
                github_username, 
                avatar_url, 
                bio, 
                techs: techsArray,
                location
            });      
        } 
        
        return res.json(dev);
    },

    async update(req, res) {
        const { github_username } = req.params;
        const { techs, latitude, longitude } = req.body;

        const response = await axios.get(`https://api.github.com/users/${github_username}`);
        const { name = login, avatar_url, bio } = response.data;
    
        const techsArray = parseStringAsArray(techs);
    
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        }

        const dev = await Dev.findOneAndUpdate({ 
            github_username 
        }, {
            name,  
            avatar_url, 
            bio, 
            techs: techsArray,
            location
        }, {
            new: true
        });

        if (dev) {
            return res.json(dev);
        } else {
            return res.status(500).send({ error: 'Something failed!' });
        }         
    },

    async destroy(req, res) {
        const { github_username } = req.params;

        const dev = await Dev.findOneAndRemove({ github_username });

        if (dev) {
            return res.json(dev);
        } else {
            return res.status(500).send({ error: 'Something failed!' });
        }      
    }
};