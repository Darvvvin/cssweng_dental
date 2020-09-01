const helper = require('../helpers/helper');
const db = require('../models/db');

const Job = require('../models/JobModel');
const Employer = require('../models/EmployerModel');

const JOB_SELECT = '_id placement position date'

const feedController = {

    getEmpFeed: function (req, res) {
        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = helper.sanitize(req.query.position);
        let placementStatus = helper.sanitize(req.query.placement);

        let dateStatus = helper.parseDate(helper.sanitize(req.query.date));

        if(Array.isArray(positionStatus)) {
            for(let i = 0; i < positionStatus.length; i++) {
                positionQuery.push(positionStatus[i]);
            }
        } else if (positionStatus) {
            positionQuery.push(positionStatus);
        } 
        else {
            positionQuery.push('Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant');
        }

        if(Array.isArray(placementStatus)) {
            for(let i = 0; i < placementStatus.length; i++) {
                placementQuery.push(placementStatus[i]);
            }
        } else if (placementStatus) {
            placementQuery.push(placementStatus);
        } 
        else {
            placementQuery.push('Permanent', 'Temporary');
        }

        db.findOne(Employer, {account: req.session.user}, '_id', function(emp){

            let page = helper.sanitize(req.query.page);

            if (page == null) {
                page = '1';
            }

            let options = {
                lean: true,
                page: page,
                limit: 4,

            };

            let query = {
                employer  : emp._id,
                position  : { $in: positionQuery },
                placement : { $in : placementQuery},
            };
            
            Job.paginate(query, options,
                function(err, results) {
                console.log(results);

                let selectOptions = new Array()

                console.log(placementQuery);
                console.log(positionQuery);

                let placementLink = "";
                let positonLink = "";

                for(let i = 0; i < placementQuery.length; i++) {
                    if(i == 0)
                        placementLink += "placement=" + placementQuery[i];
                    else
                        placementLink += "&placement=" + placementQuery[i];
                }

                for(let i = 0; i < positionQuery.length; i++) {
                    positonLink += "&position=" + positionQuery[i];
                }

                for (let i = 0; i < results.pages; i++) {
                    let nPage = i + 1;

                    let options = {
                        pageLink: "/feed-emp?" + placementLink + positonLink + "&page=" + nPage,
                        pageNo : nPage,
                        isSelected : (results.page == nPage),
                    };

                    selectOptions.push(options);
                }

                //fix this logic

                let nextPageNumber = parseInt(results.page) + 1;
                let prevPageNumber = parseInt(results.page) - 1;

                let prevPageLink = (results.page != '1') ? "/feed-emp?" + placementLink + positonLink + "&page=" + prevPageNumber: "";
                let nextPageLink = (results.page != results.pages) ? "/feed-emp?" + placementLink + positonLink + "&page=" + nextPageNumber : "";
                
                let hasPrevPage = true;
                let hasNextPage = true;

                if(prevPageLink) {
                    hasPrevPage = true;
                } else {
                    hasPrevPage = false;
                }

                if(nextPageLink) {
                    hasNextPage = true;
                } else {
                    hasNextPage = false;
                }

                console.log(parseInt(results.page) + 1)


                res.render('feed', {
                    active_session: (req.session.user && req.cookies.user_sid),
                    active_user: req.session.user,
                    title: 'Job Feed | BookMeDental',
                    filter_route:'/feed-emp',
                    profile_active: true,
                    jobs: results.docs,
                    employer_active: true,

                    //Pagination
                    selectOptions: selectOptions,
                    hasPrev: hasPrevPage,
                    hasNext: hasNextPage,
                    prevPageLink: prevPageLink,
                    nextPageLink: nextPageLink
                });
            })
        });
    },

    getAppFeed: function (req, res) {

        if (!(req.session.user && req.cookies.user_sid)) {
            res.redirect('/login');
            return;
        }

        console.log('getFiltered request');

        let positionQuery = new Array();
        let placementQuery = new Array();

        let positionStatus = helper.sanitize(req.query.position);
        let placementStatus = helper.sanitize(req.query.placement);

        let dateStatus = helper.parseDate(helper.sanitize(req.query.date));

        if(Array.isArray(positionStatus)) {
            for(let i = 0; i < positionStatus.length; i++) {
                positionQuery.push(positionStatus[i]);
            }
        } else if (positionStatus) {
            positionQuery.push(positionStatus);
        } 
        else {
            positionQuery.push('Dentist', 'Dental Hygienist', 'Front Desk', 'Dental Assistant');
        }

        if(Array.isArray(placementStatus)) {
            for(let i = 0; i < placementStatus.length; i++) {
                placementQuery.push(placementStatus[i]);
            }
        } else if (placementStatus) {
            placementQuery.push(placementStatus);
        } 
        else {
            placementQuery.push('Permanent', 'Temporary');
        }

        let page = helper.sanitize(req.query.page);

            if (page == null) {
                page = '1';
            }

            let options = {
                lean: true,
                page: page,
                limit: 4,

            };

            let query = {
                position  : { $in: positionQuery },
                placement : { $in : placementQuery},
            };

        Job.paginate(query, options,
                function(err, results) {
                console.log(results);

                let selectOptions = new Array()

                console.log(placementQuery);
                console.log(positionQuery);

                let placementLink = "";
                let positonLink = "";

                for(let i = 0; i < placementQuery.length; i++) {
                    if(i == 0)
                        placementLink += "placement=" + placementQuery[i];
                    else
                        placementLink += "&placement=" + placementQuery[i];
                }

                for(let i = 0; i < positionQuery.length; i++) {
                    positonLink += "&position=" + positionQuery[i];
                }

                for (let i = 0; i < results.pages; i++) {
                    let nPage = i + 1;

                    let options = {
                        pageLink: "/feed-app?" + placementLink + positonLink + "&page=" + nPage,
                        pageNo : nPage,
                        isSelected : (results.page == nPage),
                    };

                    selectOptions.push(options);
                }

                //fix this logic

                let nextPageNumber = parseInt(results.page) + 1;
                let prevPageNumber = parseInt(results.page) - 1;

                let prevPageLink = (results.page != '1') ? "/feed-app?" + placementLink + positonLink + "&page=" + prevPageNumber: "";
                let nextPageLink = (results.page != results.pages) ? "/feed-app?" + placementLink + positonLink + "&page=" + nextPageNumber : "";
                
                let hasPrevPage = true;
                let hasNextPage = true;

                if(prevPageLink) {
                    hasPrevPage = true;
                } else {
                    hasPrevPage = false;
                }

                if(nextPageLink) {
                    hasNextPage = true;
                } else {
                    hasNextPage = false;
                }

                console.log(parseInt(results.page) + 1)


                res.render('feed', {
                    active_session: (req.session.user && req.cookies.user_sid),
                    active_user: req.session.user,
                    title: 'Job Feed | BookMeDental',
                    filter_route:'/feed-app',
                    profile_active: true,
                    jobs: results.docs,
                    applicant_active: true,

                    //Pagination
                    selectOptions: selectOptions,
                    hasPrev: hasPrevPage,
                    hasNext: hasNextPage,
                    prevPageLink: prevPageLink,
                    nextPageLink: nextPageLink
                });
            })
    },

    getIndivJob: function (req,res){
        db.findOne(Job, {_id: req.query._id}, '', function(result){
            if(result){
                result 
                    .populate('employer')
                    .execPopulate(function(err,data){
                        if (err) throw err;
                        res.render('details',{
                            active_session: (req.session.user && req.cookies.user_sid),
                            active_user: req.session.user,
                            title: data.placement + ' ' + data.position + ' | ' + 'BookMeDental',
                            profile_active: true,
                            jobData: data.toObject(),
                            date: helper.formatDate(data.created),
                        })
                    })
            }
            
        })
    },
};

// enables to export controller object when called in another .js file
module.exports = feedController;