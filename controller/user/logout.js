module.exports.logout = (req, res) => {
    res.clearCookie("loggedin", null);
    res.clearCookie("sessionToken", null);
    req.session.destroy();
    res.json({ msg: "done" });
    res.end();
};