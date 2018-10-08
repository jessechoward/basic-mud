const router = require('express').Router();

router.use('/editor/area', (req, res) =>
{
	res.render('editors/area');
});

router.use('/', (req, res) =>
{
	res.render('layout', {title: 'main layout', appName: 'the mud'});
});

module.exports = router;
