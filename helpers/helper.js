const sanitize = require('mongo-sanitize');
const moment = require('moment');
const dateformat = require('dateformat');
const fs = require('fs');

const helper = {
    sanitize: function (query) {
        return sanitize(query);
    },

    renameAvatar: function (req, newName) {
        var origName = req.files['avatar'][0].originalname;
        var extension = origName.substring(origName.lastIndexOf('.'));
        const newURL =
            req.files['avatar'][0].destination + '/' + newName + extension;

        fs.renameSync(req.files['avatar'][0].path, newURL);
        return newName + extension;
    },

    renameResume: function (req, newName) {
        var origName = req.files['resume'][0].originalname;
        var extension = origName.substring(origName.lastIndexOf('.'));
        const newURL =
            req.files['resume'][0].destination + '/' + newName + extension;

        fs.renameSync(req.files['resume'][0].path, newURL);
        return newName + extension;
    },

    formatDate: function (date) {
        var diff_seconds = Math.round((+new Date - date) / 1000);
    
        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;
    
        var time;
    
        if (diff_seconds < 30) {
            time = 'just then';
        } else if (diff_seconds < minute) {
            time = delta + ' seconds ago';
        } else if (diff_seconds < 2 * minute) {
            time = 'a minute ago.'
        } else if (diff_seconds < hour) {
            time = Math.floor(diff_seconds / minute) + ' minutes ago';
        } else if (Math.floor(diff_seconds / hour) == 1) {
            time = '1 hour ago.'
        } else if (diff_seconds < day) {
            time = Math.floor(diff_seconds / hour) + ' hours ago';
        } else if (diff_seconds == day) {
            time = 'yesterday';
        } else if (diff_seconds < day * 7){
            time = Math.floor(diff_seconds / day) + ' days ago';
        } else if (diff_seconds == week){
            time = 'one week ago'
        } else{
            time = dateformat(data.created, 'mmm dd, yyyy')
        }
    
        return time;
    },

    parseDate: function (s) {
        if (!(moment(s, 'YYYY-MM-DD', true).isValid())) {
            return null;
        }
    
        if (s == null || s === undefined) {
            return null;
        }
    
        var b = s.split(/\D/);
        let date = new Date(b[0], --b[1], b[2]);
    
        date.setHours(8, 0, 0, 0);
    
        return date;
    }
};

module.exports = helper;
