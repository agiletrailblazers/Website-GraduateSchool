module.exports = {
  getHomepage: function getHomepage(req, res) {
    res.send('respond with the homepage URL');
  },
  getWhatsNew: function(req, res) {
    res.send('respond with the whats new URL')
  }
}
