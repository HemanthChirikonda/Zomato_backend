let adminrootauthenticate = function (req, res, next) {
    //check if token present
    if (localStorage.getItem('adtoken')) {
        // check if token valid
        let verifyResult = jwt.verify(req.headers.authorization, "mnbvcxsertyuiolknb");
        // if valid then allow user
        if (verifyResult) {
            next();
        } else {
            res.send(401).json({
                "message": "invalid authorization"
            })
        }
    } else {
        res.status(401).json({
            "message": "no token present"
        })
    }
}

module.exports = adminrootauthenticate;