const logout = (req, res) => {
    // Destroy the session
    req.session.destroy();
    res.json({ msg: 'done' });
};

module.exports = {
    logout,
}