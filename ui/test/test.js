#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  child_process = require('child_process');

function run(cmd, args, callback) {
  var p = child_process.spawn(cmd, args || [], {
    stdio: 'inherit'
  });

  p.on('exit', function() {
    callback();
  });

  p.on('error', function(err) {
    callback(err);
  });
}

if (fs.existsSync(path.join(__dirname, 'app'))) {

  run('rm', ['-rf', path.join(__dirname, 'app')], function(err) {
    if (err) {
      throw eer;
    }

    init();
  });

} else {
  init();
}

function init() {
  run('ti', ['create', '-p', 'ios,android', '-n', 'app', '--id', 'app', '-d', __dirname], function(err) {

    if (err) {
      throw err;
    }

    console.log('Created app.');

    fs.writeFileSync(path.join(__dirname, 'app', 'Resources', 'app.js'), fs.readFileSync(path.join(__dirname, 'app.js')));
    fs.writeFileSync(path.join(__dirname, 'app', 'Resources', 'ui.js'), fs.readFileSync(path.join(__dirname, '..', 'ui.js')));
    fs.writeFileSync(path.join(__dirname, 'app', 'Resources', 'image.png'), fs.readFileSync(path.join(__dirname, 'image.png')));

    console.log('Initted app.');

    run('ti', ['build', '-p', 'ios', '-d', path.join(__dirname, 'app')], function(err) {

      if (err) {
        throw err;
      }

      console.log('Running app.');
    });
  });
}