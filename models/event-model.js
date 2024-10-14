const mongooes = require("mongoose");
const eventscheme = new mongooes.Schema({
    name: {
        type: String,
        require:true
    },
    description: {
        type: String,
        require:true
    },
    organizer: {
        type: String,
        require:true
    },
    guests:{
        type: Array,
        require: true,
        default:[]
    },
    address: {
        type: String,
        require:true
    },
    city: {
        type: String,
        require:true
    },
    pincode: {
        type: String,
        require:true
    },
    date: {
        type: String,
        require:true
    },
    time: {
        type: String,
        require:true
    },
    media: {
        type: Array,
        require: true,
        default:[]
    },
    ticketTypes: {
        type: Array,
        require:true,
        default:[]
    }
}, { timestamps: true });

const EventModel = mongooes.model("events", eventscheme);
module.exports = EventModel;