/*******************************
         Install Task
*******************************/

/*
   Install tasks

   For more notes

   * Runs automatically after npm update (hooks)
   * (NPM) Install - Will ask for where to put semantic (outside pm folder)
   * (NPM) Upgrade - Will look for semantic install, copy over files and update if new version
   * Standard installer runs asking for paths to site files etc

*/

var
  gulp           = require('gulp'),

  // node dependencies
  console        = require('better-console'),
  extend         = require('extend'),
  fs             = require('fs'),
  mkdirp         = require('mkdirp'),
  path           = require('path'),

  // gulp dependencies
  chmod          = require('gulp-chmod'),
  del            = require('del'),
  jsonEditor     = require('gulp-json-editor'),
  plumber        = require('gulp-plumber'),
  prompt         = require('gulp-prompt'),
  rename         = require('gulp-rename'),
  replace        = require('gulp-replace'),
  requireDotFile = require('require-dot-file'),
  wrench         = require('wrench'),

  // install config
  install        = require('./config/project/install'),

  // user config
  config         = require('./config/user'),

  // release config (name/title/etc)
  release        = require('./config/project/release'),

  // shorthand
  questions      = install.questions,
  files          = install.files,
  folders        = install.folders,
  regExp         = install.regExp,
  settings       = install.settings,
  source         = install.source
;

// Export install task
module.exports = function () {

  var
    currentConfig = requireDotFile('semantic.json'),
    manager       = install.getPackageManager(),
    rootQuestions = questions.root
  ;

  console.clear();

  /* Test NPM
  manager = {
    name : 'NPM',
    root : path.normalize(__dirname + '/../')
  };
  */

  /*--------------
      PM Config
  ---------------*/

  /* Don't do end user config if SUI is a sub-module */
  if( install.isSubModule() ) {
    console.info('SUI is a sub-module, skipping end-user install');
    return;
  }

  // run update scripts if semantic.json exists
  if(currentConfig && manager.name === 'NPM') {

    var
      updateFolder = path.join(manager.root, currentConfig.base),
      updatePaths  = {
        config      : path.join(manager.root, files.config),
        tasks       : path.join(updateFolder, folders.tasks),
        themeImport : path.join(updateFolder, folders.themeImport),
        definition  : path.join(currentConfig.paths.source.definitions),
        site        : path.join(currentConfig.paths.source.site),
        theme       : path.join(currentConfig.paths.source.themes)
      }
    ;

    // duck-type if there is a project installed
    if( fs.existsSync(updatePaths.definition) ) {

      // perform update if new version
      if(currentConfig.version !== release.version) {
        console.log('Updating Semantic UI from ' + currentConfig.version + ' to ' + release.version);

        console.info('Updating ui definitions...');
        wrench.copyDirSyncRecursive(source.definitions, updatePaths.definition, settings.wrench.update);

        console.info('Updating default theme...');
        wrench.copyDirSyncRecursive(source.themes, updatePaths.theme, settings.wrench.update);

        console.info('Updating tasks...');
        wrench.copyDirSyncRecursive(source.tasks, updatePaths.tasks, settings.wrench.update);

        console.info('Updating gulpfile.js');
        gulp.src(source.userGulpFile)
          .pipe(plumber())
          .pipe(gulp.dest(updateFolder))
        ;

        // copy theme import
        console.info('Updating theme import file');
        gulp.src(source.themeImport)
          .pipe(plumber())
          .pipe(gulp.dest(updatePaths.themeImport))
        ;

        console.info('Adding new site theme files...');
        wrench.copyDirSyncRecursive(source.site, updatePaths.site, settings.wrench.site);

        console.info('Updating version...');

        // update version number in semantic.json
        gulp.src(updatePaths.config)
          .pipe(plumber())
          .pipe(rename(settings.rename.json)) // preserve file extension
          .pipe(jsonEditor({
            version: release.version
          }))
          .pipe(gulp.dest(manager.root))
        ;

        console.info('Update complete! Run "\033[92mgulp build\033[0m" to rebuild dist/ files.');

        return;
      }
      else {
        console.log('Current version of Semantic UI already installed');
        return;
      }

    }
    else {
      console.error('Cannot locate files to update at path: ', updatePaths.definition);
      console.log('Running installer');
    }

  }

  /*--------------
   Determine Root
  ---------------*/

  // PM that supports Build Tools (NPM Only Now)
  if(manager.name == 'NPM') {
    rootQuestions[0].message = rootQuestions[0].message
      .replace('{packageMessage}', 'We detected you are using \033[92m' + manager.name + '\033[0m. Nice! ')
      .replace('{root}', manager.root)
    ;
    // set default path to detected PM root
    rootQuestions[0].default = manager.root;
    rootQuestions[1].default = manager.root;

    // insert PM questions after "Install Type" question
    Array.prototype.splice.apply(questions.setup, [2, 0].concat(rootQuestions));

    // omit cleanup questions for managed install
    questions.cleanup = [];
  }

  /*--------------
       Set-up
  ---------------*/

  return gulp
    .src('gulpfile.js')
    .pipe(prompt.prompt(questions.setup, function(answers) {

      /*--------------
       Exit Conditions
      ---------------*/

      // if config exists and user specifies not to proceed
      if(answers.overwrite !== undefined && answers.overwrite == 'no') {
        return;
      }

      console.clear();
      console.log('Installing');
      console.log('------------------------------');


      /*--------------
            Paths
      ---------------*/

      var
        installPaths = {
          config            : files.config,
          configFolder      : folders.config,
          site              : answers.site || folders.site,
          themeConfig       : files.themeConfig,
          themeConfigFolder : folders.themeConfig
        },
        installFolder = false
      ;

      /*--------------
         PM Install
      ---------------*/

      // Check if PM install
      if(answers.useRoot || answers.customRoot) {

        // Set root to custom root path if set
        if(answers.customRoot) {
          if(answers.customRoot === '') {
            console.log('Unable to proceed, invalid project root');
            return;
          }
          manager.root = answers.customRoot;
        }

        // special install paths only for PM install
        installPaths = extend(false, {}, installPaths, {
          definition  : folders.definitions,
          lessImport  : folders.lessImport,
          tasks       : folders.tasks,
          theme       : folders.themes,
          themeImport : folders.themeImport
        });

        // add project root to semantic root
        installFolder = path.join(manager.root, answers.semanticRoot);

        // add install folder to all output paths
        for(var destination in installPaths) {
          if( installPaths.hasOwnProperty(destination) ) {
            // config goes in project root, rest in install folder
            installPaths[destination] = (destination == 'config' || destination == 'configFolder')
              ? path.normalize( path.join(manager.root, installPaths[destination]) )
              : path.normalize( path.join(installFolder, installPaths[destination]) )
            ;
          }
        }

        // create project folders
        try {
          mkdirp.sync(installFolder);
          mkdirp.sync(installPaths.definition);
          mkdirp.sync(installPaths.theme);
          mkdirp.sync(installPaths.tasks);
        }
        catch(error) {
          console.error('NPM does not have permissions to create folders at your specified path. Adjust your folders permissions and run "npm install" again');
        }

        console.log('Installing to \033[92m' + answers.semanticRoot + '\033[0m');

        console.info('Copying UI definitions');
        wrench.copyDirSyncRecursive(source.definitions, installPaths.definition, settings.wrench.install);
        wrench.copyDirSyncRecursive(source.themes, installPaths.theme, settings.wrench.install);

        console.info('Copying gulp tasks');
        wrench.copyDirSyncRecursive(source.tasks, installPaths.tasks, settings.wrench.install);

        // copy theme import
        console.info('Adding theme files');
        gulp.src(source.themeImport)
          .pipe(plumber())
          .pipe(gulp.dest(installPaths.themeImport))
        ;
        gulp.src(source.lessImport)
          .pipe(plumber())
          .pipe(gulp.dest(installPaths.lessImport))
        ;

        // create gulp file
        console.info('Creating gulpfile.js');
        gulp.src(source.userGulpFile)
          .pipe(plumber())
          .pipe(gulp.dest(installFolder))
        ;

      }

      /*--------------
         Site Theme
      ---------------*/

      // Copy _site templates folder to destination
      if( fs.existsSync(installPaths.site) ) {
        console.info('Site folder exists, merging files (no overwrite)', installPaths.site);
      }
      else {
        console.info('Creating site theme folder', installPaths.site);
      }
      wrench.copyDirSyncRecursive(source.site, installPaths.site, settings.wrench.site);

      /*--------------
        Theme Config
      ---------------*/

      var
        // determine path to site theme folder from theme config
        // force CSS path variable to use forward slashes for paths
        pathToSite   = path.relative(path.resolve(installPaths.themeConfigFolder), path.resolve(installPaths.site)).replace(/\\/g,'/'),
        siteVariable = "@siteFolder   : '" + pathToSite + "/';"
      ;

      // rewrite site variable in theme.less
      console.info('Adjusting @siteFolder to: ', pathToSite + '/');

      if(fs.existsSync(installPaths.themeConfig)) {
        console.info('Modifying src/theme.config (LESS config)', installPaths.themeConfig);
        gulp.src(installPaths.themeConfig)
          .pipe(plumber())
          .pipe(replace(regExp.siteVariable, siteVariable))
          .pipe(gulp.dest(installPaths.themeConfigFolder))
        ;
      }
      else {
        console.info('Creating src/theme.config (LESS config)', installPaths.themeConfig);
        gulp.src(source.themeConfig)
          .pipe(plumber())
          .pipe(rename({ extname : '' }))
          .pipe(replace(regExp.siteVariable, siteVariable))
          .pipe(gulp.dest(installPaths.themeConfigFolder))
        ;
      }

      /*--------------
        Semantic.json
      ---------------*/

      var
        jsonConfig = install.createJSON(answers)
      ;

      // adjust variables in theme.less
      if( fs.existsSync(files.config) ) {
        console.info('Extending config file (semantic.json)', installPaths.config);
        gulp.src(installPaths.config)
          .pipe(plumber())
          .pipe(rename(settings.rename.json)) // preserve file extension
          .pipe(jsonEditor(jsonConfig))
          .pipe(gulp.dest(installPaths.configFolder))
        ;
      }
      else {
        console.info('Creating config file (semantic.json)', installPaths.config);
        gulp.src(source.config)
          .pipe(plumber())
          .pipe(rename({ extname : '' })) // remove .template from ext
          .pipe(jsonEditor(jsonConfig))
          .pipe(gulp.dest(installPaths.configFolder))
        ;
      }

      // Completion Message
      if(installFolder) {
        console.log('Install complete! Navigate to \033[92m' + answers.semanticRoot + '\033[0m and run "\033[92mgulp build\033[0m" to build');
      }
      else {
        console.log('');
        console.log('');
      }

    }))
    .pipe(prompt.prompt(questions.cleanup, function(answers) {
      if(answers.cleanup == 'yes') {
        del(install.setupFiles);
      }
      if(answers.build == 'yes') {
        gulp.start('build');
      }
    }))
  ;


};