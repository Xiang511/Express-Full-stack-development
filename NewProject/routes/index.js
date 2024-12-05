var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /index:
 *   get:
 *     summary: Render the index page
 *     responses:
 *       200:
 *         description: Renders the index page.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: '<html><head><title>MetaWall</title></head><body>...</body></html>'
 */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'MetaWall' });
});

module.exports = router;
