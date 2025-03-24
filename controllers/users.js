const express = require('express');
const User = require('../Models/user');


module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}
module.exports.registerUser = async (req, res, next) =>  {
    try {

        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        await req.login(registerUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}
module.exports.loginUser = (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}
module.exports.logoutUser = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}