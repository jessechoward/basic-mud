const router = require('express').Router();

router.use('/', (req, res) =>
{
	res.render('layout', {title: 'main layout', appName: 'the mud'});
});

module.exports = router;
