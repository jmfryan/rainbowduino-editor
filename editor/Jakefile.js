var path = require('path');
var file = require('file');
var execute = require('child_process').exec;

task('default', ['test']);

desc('run all tests');
task('test', function() {
    file.walk('.', function (err, dir, dirs, files) {
        if(dir.indexOf('node_modules') === 0)
            return;

        if (path.basename(dir) === 'tests') {
            console.log('executing tests from ' + dir);
            exec("nodeunit --reporter eclipse " + dir);
        }
    });
});

function exec(command, onComplete) {
    execute(command, function(error, stdout, stderr) {
        if (typeof(onComplete) !== "function" && stdout) {
            console.log(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
        if (typeof(onComplete) === "function") {
            onComplete(stdout);
        }
    });
}
