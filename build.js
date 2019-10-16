var glob = require('glob');
var fs = require('fs');
var path = require('path');
var nodeWatch = require('node-watch');
var commandLineArgs = require('command-line-args');
var colors = require('colors');
var livereload = require('livereload');

var options = commandLineArgs([
    { name: 'watch', alias: 'w', type: Boolean },
]);
var server;
if (options.watch) {
    watch();
} else {
    build();
}

function watch() {
    build();
    console.log("Watching files")
    nodeWatch('src', { recursive: true }, function (evt, name) {
        console.log((name + " changed.").yellow);
        build();
    });

    server = livereload.createServer();
    server.watch(__dirname + "/docs");
}

function build() {
    console.log("Building.".yellow.bold);
    try { fs.mkdirSync('docs'); } catch (e) { }
    //get every root-level html page from src
    var pagePaths = glob.sync('src/*.html');
    for (var pagePath of pagePaths) {
        console.log(("Processing " + pagePath).magenta);
        var pageFullPath = path.resolve(pagePath);

        var pageContents = processPage(pageFullPath);
        //write the page to the root directory
        var filename = path.basename(pageFullPath);
        fs.writeFileSync(path.join(__dirname, 'docs', filename), pageContents, { flag: 'w' });
    }
    console.log('Copying static files');
    copyStaticFiles('src/images/**/*', 'docs/images');
    copyStaticFiles('src/projects/**/*', 'docs/projects');
    copyStaticFiles('src/styles/**/*', 'docs/styles');
    copyStaticFiles('src/js/**/*', 'docs/js');
    copyStaticFiles('src/partials/**/*', 'docs/partials');
    console.log(("Build complete: " + new Date().toISOString() + '.').green.bold);
}

function processPage(pageFullPath) {
    var pageDirPath = path.dirname(pageFullPath);

    var pageContents = fs.readFileSync(pageFullPath, "utf8");
    // while (true) {
    //     var regex = /([ \t]*)<!--\s*include\("(.+)"\)\s*-->/g;
    //     var match = regex.exec(pageContents);
    //     if (match === null) {
    //         break;
    //     }
    //     var whitespace = match[1];
    //     //get the filename from the match
    //     var importFilename = match[2];
    //     //the import filename is relative to the pagePath

    //     var importFilePath = path.join(pageDirPath, importFilename);

    //     console.log(('   Importing ' + importFilename).cyan);
    //     //get the import page contents 
    //     var importPageContents = processPage(importFilePath);
    //     //insert the whitespace at the beginning of each line
    //     var pageLines = importPageContents.split('\r\n');
    //     importPageContents = whitespace + pageLines.join('\r\n' + whitespace);
    //     pageContents =
    //         pageContents.substring(0, match.index) +
    //         importPageContents +
    //         pageContents.substring(match.index + match[0].length);
    // }
    //write the file contents
    return pageContents;
}

function copyStaticFiles(sourceGlob, destinationFolderPath) {
    //make the destination folder if it doesn't already exist
    try { fs.mkdirSync(destinationFolderPath); } catch (e) { }
    var filePaths = glob.sync(sourceGlob);
    for (var j = 0; j < filePaths.length; j++) {
        var filePath = filePaths[j];
        var name = path.basename(filePath);
        console.log(name);
        if (!name.includes('.')) {
            try { fs.mkdir(destinationFolderPath + '/' + name); } catch (e) { }
            copyStaticFiles(filePath + '**/*', destinationFolderPath + '/' + name);
        } else {
            fs.copyFileSync(filePath, destinationFolderPath + '/' + name);
        }
    }
}
var server;
function watch() {
    build();
    console.log("Watching files")
    nodeWatch('src', { recursive: true }, function (evt, name) {
        console.log((name + " changed.").yellow);
        build();
    });

    server = livereload.createServer();
    server.watch(__dirname + "/docs");
}

if (options.watch) {
    watch();
} else {
    build();
}