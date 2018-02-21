const pup = require('puppeteer');
const webpack = require('webpack');
const config = require('../../webpack.config');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const devRoutes = require('../../server/dev');
const app = express();

const wpm = middleware(webpack(config), { logLevel: 'silent' });
app.use(wpm);
devRoutes(app, { middleware: wpm });

const server = app.listen(8080, async function() {
  let exitCode = -1;
  const browser = await pup.launch();
  try {
    const page = await browser.newPage();
    // page.on('console', onConsole);
    await page.goto('http://127.0.0.1:8080/test');
    await page.waitFor(() => typeof window._mochaResults !== 'undefined', {
      timeout: 5000
    });
    const results = await page.evaluate(() => window._mochaResults);
    const stats = results.stats;
    exitCode = stats.failures;
    console.log(`${stats.passes} passing (${stats.duration}ms)\n`);
    if (stats.failures) {
      console.log('Failures:\n');
      for (const f of results.failures) {
        console.log(`${f.fullTitle}`);
        console.log(` ${f.err.stack}\n`);
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    browser.close();
    server.close(() => {
      //eslint-disable-next-line no-process-exit
      process.exit(exitCode);
    });
  }
});
