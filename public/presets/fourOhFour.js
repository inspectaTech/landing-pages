

  const fourOhFour = function (req, res) {
    res.render('404', {
      title:'404',
      errorMessage:'article not found'
    });
  }

  module.exports = fourOhFour;
