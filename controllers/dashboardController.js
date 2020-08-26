const db = require('../models/db');
const Applicant = require('../models/ApplicantModel');
const Employer = require('../models/EmployerModel');

const dashboardController = {
    // render log-in page when client requests '/' defined in routes.js
    getDashboard: function (req, res, next) {
        // If there's no active session, redirect to login
        if (!req.session.user) res.redirect('/login');
        else {
            var view, model;
            if (req.session.accType == 'applicant') {
                view = 'dashboard-app';
                model = Applicant;
            } else {
                view = 'dashboard-emp';
                model = Employer;
            }

            db.findOne(model, { account: req.session.user }, '', function (
                result,
            ) {
                if (result) {
                    result
                        .populate('account')
                        .execPopulate(function (err, data) {
                            console.log(data.toObject())
                            if (err) throw err;

                            if(view == 'dashboard-app') {
                                res.render(view, {
                                    active_session:
                                    req.session.user && req.cookies.user_sid,
                                    active_user: req.session.user,
                                    title: 'Dashboard | BookMeDental',
                                    profile_active: true,
                                    applicant_active: true,
                                    profileData: data
                                });
                            } else {
                                res.render(view, {
                                    active_session:
                                    req.session.user && req.cookies.user_sid,
                                    active_user: req.session.user,
                                    title: 'Dashboard | BookMeDental',
                                    profile_active: true,
                                    employer_active: true,
                                    profileData: data
                                });
                            }
                        });
                } else {
                    if(view == 'dashboard-app') {
                        res.render('form', {
                            active_session: req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: 'Sign Up | BookMeDental',
                            register_active: true,

                            states: Object.keys(citiesAndStates).sort(),
                        });
                    } else {
                        res.render('form-emp', {
                            active_session: req.session.user && req.cookies.user_sid,
                            active_user: req.session.user,
                            title: 'Sign Up | BookMeDental',
                            register_active: true,

                            states: Object.keys(citiesAndStates).sort(),
                        }); 
                    }
                }
            });
        }
    },
};

// enables to export controller object when called in another .js file
module.exports = dashboardController;