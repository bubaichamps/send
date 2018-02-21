const html = require('choo/html');
const assets = require('../../common/assets');

module.exports = function(app) {
  app.get('/mocha.css', function(req, res) {
    res.sendFile(require.resolve('mocha/mocha.css'));
  });
  app.get('/mocha.js', function(req, res) {
    res.sendFile(require.resolve('mocha/mocha.js'));
  });
  app.get('/test', function(req, res) {
    res.send(
      html`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/mocha.css" />
          <script src="/mocha.js"></script>
          <script>mocha.setup({
            ui: 'bdd',
            reporter: 'json'
          })</script>
          <script src="${assets.get('runtime.js')}"></script>
          <script src="${assets.get('vendor.js')}"></script>
          <script src="${assets.get('tests.js')}"></script>
        </head>
        <body>
          <div id="mocha"></div>
          <script>
          mocha.checkLeaks();
          const runner = mocha.run(
            function () {
              window._mochaResults = runner.testResults
            }
          );
          </script>
        </body>
      </html>
      `.toString()
    );
  });
};
