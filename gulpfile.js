var gulp = require('gulp');
var ignore = require('gulp-ignore');
var del    = require('del');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var sass = require('gulp-sass');
var notify = require('gulp-notify') 
var wrap = require("gulp-wrap");


///////////////////////////////////////////////////////////////////////
// CONFIG
///////////////////////////////////////////////////////////////////////
var version = {
	build: '1.0.4'
}

var bases ={
 app: './'
}

var scriptFileNames={
	scripts_with_navbar: 'app_nav.min.js',
	clientMvcOutput: 'clientMVC.min.js'
}

var app_main_css={
	css_result: 'main_css.min.css',
	sass_main: 'main_css.scss',
	sass_variables: 'main_var.scss',
	sass_mixins: 'main_mixins.scss',
	sass_functions: 'main_function.scss'
}

var clientMVC={
	app: ['public/clientMVC/main/ngwfApp.js'],
	controllers: ['public/clientMVC/main/controllers/**/*.js'],
	directives: ['public/clientMVC/main/directives/**/*.js'],
	filters: ['public/clientMVC/main/filters/**/*.js'],
	services: ['public/clientMVC/main/services/**/*.js'],
	htmlTemplates : ['public/clientMVC/htmlTemplates/**/*.html']
}

var decorate={
	templateJS: '/* \n' + 
				' easyFormGenerator \n' + 
				' Version ' +  version.build + ' \n' + 				
				' Author : Erwan Datin (MacKentoch) \n' + 
				' Link: https://github.com/MacKentoch/easyFormGenerator \n' +
				' License : MIT (2015) \n' + 								
				'*/ \n' + 
				';(function(){\n"use strict";\n<%= contents %>\n})();',

	templateCSS: '/*! \n' + 
				' * easyFormGenerator \n' + 
				' * Version ' + version.build + ' \n' + 				
				' * Author : Erwan Datin (MacKentoch) \n' +
				' Link: https://github.com/MacKentoch/easyFormGenerator \n' + 
				' * License : 2015 MIT \n' + 								
				'*/ \n' +
				'\n<%= contents %>\n' 
			
}

var paths = {
 //scripts for header
 bower_angularjs: ['bower_components/angular/angular.min.js'],
 bower_angular_loadingbarjs: ['bower_components/angular-loading-bar/build/loading-bar.min.js'],

 bower_html5shiv: ['bower_components/html5shiv/dist/html5shiv.min.js'],
 bower_respondJS: ['bower_components/respondJS/dest/respond.min.js'],

 //scripts for footer
 bower_components_js: 	[
 						'bower_components/jquery/dist/jquery.min.js',   //jquery always first
 						'bower_components/bootstrap/dist/js/bootstrap.min.js',						
 						'bower_components/modernizer/modernizr.js',
						'bower_components/textAngular/dist/textAngular-rangy.min.js',
						'bower_components/textAngular/dist/textAngular-sanitize.min.js',
						'bower_components/textAngular/dist/textAngular.min.js',
						'bower_components/angular-resource/angular-resource.min.js',
						'bower_components/angular-animate/angular-animate.min.js',
						'bower_components/angularjs-toaster/toaster.min.js',
						'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
						'bower_components/api-check/dist/api-check.min.js',
						'bower_components/angular-formly/dist/formly.min.js',
						'bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js',
						'bower_components/nya-bootstrap-select/dist/js/nya-bs-select.min.js',
						'bower_components/lodash/lodash.min.js'
 					],
bower_components_map: 	[
							'bower_components/jquery/dist/jquery.min.map',
							'bower_components/angular/angular.min.js.map',
							'bower_components/angular-resource/angular-resource.min.js.map',
							'bower_components/angular-animate/angular-animate.min.js.map',
							'bower_components/angular-formly/dist/formly.min.js.map',
							'bower_components/api-check/dist/api-check.min.js.map',
							'bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.min.js.map'
						], 					

bower_components_css: 	[
 						'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
 						'bower_components/bootswatch/paper/bootstrap.min.css',
 						'bower_components/font-awesome/css/font-awesome.min.css',
 						'bower_components/angular-loading-bar/build/loading-bar.min.css',
 						'bower_components/animate.css/animate.min.css',
 						'bower_components/angularjs-toaster/toaster.min.css',
 						'bower_components/nya-bootstrap-select/dist/css/nya-bs-select.min.css'
 					],

bower_textAngular_css: ['bower_components/textAngular/src/textAngular.css'], 					

bower_components_fonts: [
							'bower_components/bootstrap/dist/fonts/**/*',
							'bower_components/font-awesome/fonts/**/*'
						], 						

 scriptsWithNav: ['public/js/**/*.js', '!public/js/main_noNavigationBar.js'],
 css: ['public/css/*.css'],
 images: ['public/images/**/*'],
 app_js: ['app.js', 'db.js'],
 bin_js: ['bin/www'],
 models_js: ['models/**/*.js'],
 passport_js: ['passport/**/*.js'],
 controllers_js:['controllers/**/*.js'],
 router_js: ['router/**/*.js'],
 views_ejs: ['views/**/*.ejs'],
 packageJSON: ['package.json'],
 readme: ['README.md'],
 //favicon: ['public/favicon.ico'],
 sass_files: ['public/css/**.*scss'],
 js_lib: ['']
};
 

///////////////////////////////////////////////////////////////////////
// GULP TASKS
///////////////////////////////////////////////////////////////////////


//==================================================
//CLEANING TASKS
//==================================================
//clean all the js in ./public/js (app)
gulp.task('clean:app:scripts_css', function (cb) {
  del([
    'public/js/' + scriptFileNames.scripts_with_navbar,
    'public/css/' + app_main_css.css_result	
  ], cb);
});
//clean all content public/lib/ directory
gulp.task('clean:app:lib', function (cb) {
  del([
    'public/lib/**/*'
  ], cb);
});
//==================================================
//SCRIPTS TASKS : main
//==================================================
// Process scripts and concatenate them into one output file
gulp.task('build', ['clean:app:scripts_css'], function() {
 // //script main app with navabar	
 gulp.src(paths.scriptsWithNav, {cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat(scriptFileNames.scripts_with_navbar))
 .pipe(gulp.dest(bases.app + 'public/js/'));

 //textAngularcss minify
 gulp.src(paths.bower_textAngular_css, {cwd: bases.app})
 	.pipe(concat('textAngular.min.css'))
 	.pipe(cssmin())
 	.pipe(gulp.dest(bases.app + 'public/css'));

 //sass 
 gulp.src(paths.sass_files, {cwd: bases.app})
    .pipe(sass().on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             })) )
    .pipe(concat('main.min.css'))
    .pipe(cssmin())     
 	.pipe(wrap(decorate.templateCSS))    
    .pipe(gulp.dest(bases.app + 'public/css'));
 });


//==================================================
//SCRIPTS TASKS : client MVC (angular JS) - dev = no uglyfy
//==================================================
gulp.task('scripts:clientMVC:dev', [], function() {
 gulp.src(		clientMVC.app
 				.concat(clientMVC.controllers)
 				.concat(clientMVC.directives)
 				.concat(clientMVC.filters)
 				.concat(clientMVC.services),
 				{cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(concat(scriptFileNames.clientMvcOutput))
 .pipe(wrap(decorate.templateJS))
 .pipe(gulp.dest(bases.app + 'public/clientMVC/main/'));
});

//==================================================
//LIB : SCRIPTS for HEADER (vendor) : jquery, angular....
//==================================================

gulp.task('lib', ['clean:app:lib'], function(){

/////////////////
//HEADER scripts
/////////////////
//copy bower APP-> app/public/lib/js	
 gulp.src(	paths.bower_angularjs
 				.concat(paths.bower_angular_loadingbarjs)
 				.concat(paths.bower_html5shiv)
 				.concat(paths.bower_respondJS), 
 			{cwd: bases.app}) 
 .pipe(gulp.dest(bases.app + 'public/lib/js/'));

/////////////////
//FOOTER scripts
/////////////////
//copy bower APP -> app/public/lib/js	
 gulp.src(paths.bower_components_js, {cwd: bases.app })
 .pipe(gulp.dest(bases.app + 'public/lib/js/'));

 // APP : chrome needs map, so jquery map copy here
 gulp.src(paths.bower_components_map, {cwd: bases.app })
 .pipe(gulp.dest(bases.app + 'public/lib/js/'))

/////////////////
//HEADER css  
/////////////////
//copy bower -> app/public/lib/	
 gulp.src(paths.bower_components_css, {cwd: bases.app })
 .pipe(gulp.dest(bases.app + 'public/lib/css/'));

/////////////////
//FONTS (boostrap and font-awesome) 
/////////////////
//copy bower -> app/public/lib/fonts
 gulp.src(paths.bower_components_fonts, {cwd: bases.app })
 .pipe(gulp.dest(bases.app + 'public/lib/fonts/'));

});


//==================================================
//WATCH TASK 
//==================================================
gulp.task('watch', function() {
	var watcher = gulp.watch(	[	'./public/css/*.scss',
									'./public/clientMVC/**/*',
									'!./public/clientMVC/clientMVC.min.js'
								], 
								[
									'build'
								]
							);
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

//==================================================
//DEFAULT TASK 
//================================================== 
// Define the default task as a sequence of the above tasks
gulp.task('default', [	
						'clean:app:scripts_css', 
						'build', 
						'scripts:clientMVC:dev',
						'lib'
					 ]);

