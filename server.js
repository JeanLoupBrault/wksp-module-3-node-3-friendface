'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');


const PORT = process.env.PORT || 8000;

let currentUser = null;

const handleHome = (req, res) => {
    if (!currentUser) { res.redirect('/signin'); return; }
    console.log('currentUser', currentUser);
    const friends = users.filter(user => {
        if (currentUser.friends.includes(user.id)) {
            return user;
        }
    });
    console.log('Friends', friends);
    res.render('pages/userPage', {
        title: 'Homepage',
        user: currentUser,
        friendsOfUser: friends,

    });
}

const handleSignin = (req, res) => {
    //if (!currentUser) { res.redirect('/signin'); return; }
    res.render('pages/signinPage', {
        title: 'Signin to Friendface!',

    });
}

const handleUser = (req, res) => {
    if (!currentUser) { res.redirect('/signin'); return; }
    const id = req.params.id;
    console.log(id)
    const otherUser = users.find(user => {
        return user.id === id
    });
    console.log(otherUser)

    const friends = users.filter(user => {
        return otherUser.friends.includes(user.id)
    });

    console.log('Friends', friends);
    res.render('pages/userPage', {
        title: otherUser.name + 's Homepage',
        user: otherUser,
        friendsOfUser: friends
    });
}

const handleName = (req, res) => {
    const firstName = req.query.firstName;
    console.log("firstName" + firstName);
    currentUser = users.find(user => user.name === firstName) || null;

    res.redirect(`${currentUser ? '/' : '/signin'}`);
}

// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({ extended: false }))
    .set('view engine', 'ejs')

    // endpoints

    .get('/', handleHome)
    .get('/signin', handleSignin)
    .get('/user/:id', handleUser)
    .get('/getname', handleName)

    // handle Friendface user page
    .get('/user', (req, res) => {
        const friendsOfUser = [];
        if (currentUser.id === users.id) {
            Object.values(users).forEach(friends => {

                friendsOfUser.push(friends.avatarUrl);
            });

            console.log(friendsOfUser);
        };


        res.render('pages/userPage', {
            title: 'Friendface user page',
            users: users,
            friendsOfUser: friends
        });
    })



    .get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    })

    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
