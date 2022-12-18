const { Router } = require('express');
const router = Router();

const UserModel = require('../models/user-models');
const { validateSession } = require('../lib/middleware');

router.get('/', (req , res) => {
    res.render('index');
});

router.get('/myaccount', validateSession, (req, res) => {
    res.render('myaccount', {username: req.session.username});
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;

    let document = await UserModel.findUser(username, email);
    console.log(document);

    if (!document) {
         res.render('login', {error: 'PLEASE CHECK THAT YOU HAVE ENTERED THE CORRECT USERNAME AND EMAIL'});
        return;
    }

    //***
    if (password == document.password) {
        req.session.username = username;
        req.session.save();
        res.redirect('/myaccount')
    } else {
        res.render('login', {error:'PASSWORD INCORRECT'})
    }
})

router.get('/signup', (req , res) => {
    res.render('signup');
});

router.post('/signup', async (req , res) => {
    const { username, email, password } = req.body;
 
    if (await UserModel.checkIfExists(username, email)) {
     res.render('signup', {error: 'USERNAME OR EMAIL ALREADY EXISTS'});
     return;
    }
    const result = await UserModel.create({
         username,
         email,
         password
    });
 
     console.log(result);
 
     req.session.username = username;
     req.session.save();
 
     res.redirect('/myaccount');
 });

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})


module.exports = router;


//*** If using bcrypt, how to check password validity */
//     if (bcrypt.compareSync(password, document.password)) {
//         res.redirect('myaccount');
//     } else {
//         res.render('login', {error: 'incorrect password'};)
//     }