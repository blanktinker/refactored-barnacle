# blanktinker/refactored-barnacle
## A Jekyll build using Pug, Sass, BrowserSync and Auto-prefixer
***
#### App Files
Files in the *_app/* directory are processed using gulp. These will be
organized as follows:
* *css/* - Require Sass compilation, auto-prefixing, and minification.
* *images/* - Require optimization and in some cases resizing.
* *jekyll/* - Require processing by Jekyll to AFTER the pugfiles are processed.
* *js/* - Require concatenation and uglification.
* *pugfiles/* - Require processing into the *jekyll/_includes/* subdirectory before Jekyll is allowed to run since its pages will be built using these segments.
***
#### Gulp-Generated Files
'*main.sass*' along with its imports are processed by Gulp and its results '*main.css*' and '*main.min.css*' are placed into the *_dist/css/* directory.

Image files in *_app/images/* are optimized losslessly through imagemin.
(NOTE: gulp-imagemin can be tweaked to allow more aggressive methods of optimization. Also, at this point other methods, such as image resizing, can be worked into the stream before and after image file optimizations in order to maximize your serving speed. *This project is defaulted to a **lossless** system to ensure no one accidentally botches their image files since image optimization is very project-specific.*)

Javascript files in *_app/js/* are processed by Gulp and their results '*scripts.js*' and '*scripts.min.js*' are placed into the *_dist/js/* directory.

Pug files in *_app/pugfiles/* are processed by Gulp and the resulting html files are placed in *_app/jekyll/_includes* before Jekyll processes anything in order to allow Jekyll to use the resulting files during its own build process.
***
#### Non-Gulp-Generated Jekyll Files
Files in the *_app/jekyll/* directory are fed to and processed directly by Jekyll. This includes:
* *_data/*
* *_drafts/*
* *_includes/*
* *_layouts/*
* *_posts/*
* *config.yml*
* *config-prod.yml*
* *Jekyll Pages* (any .md and .html in the *_app/jekyll/* directory)

Jekyll outputs into the *_app/temp/* directory in order to ensure it cannot wipe other files during site generation (without having to maintain a massive keep_files listing in Jekyll's configuration options). Gulp will then handle moving the files from the *_app/temp/* directory to the *_dist/* directory.
***
#### Project Setup
This project is built to provide an easy-to-modify skeleton for anyone looking to make a gh-pages site. Simply fork the project and clone it to your local machine using: `$ git clone https://github.com/<repo address>.git`

Once cloned, `cd` into your new repo and install the dependencies on your machine using: `$ npm install`

In order to simplify deployment of this project I've bundled it with a script called *deploy.sh*. Of course, if you're familiar with deploying these sorts of projects on your own you need not use it but if you'd like the ease of use, first you must grant it the proper permissions with: `$ chmod 755 deploy.sh`

To run your Gulp setup in development mode just type: `$ gulp`

Once everything has been built to taste and you are ready to deploy you can then run: `$ ./deploy.sh`

This will trigger a few prompts to guide you through either:
1) backing up your local repo to your remote repo, or
2) deploying your current build to a desired branch.

The script will then prompt you to tell it:
1) what branch you want to push **TO**,
2) what commit message you want to include, and if you are deploying the build,
3) what branch you are pushing **FROM**.

>IMPORTANT NOTE: This method uses a forced `git subtree push` for the site deployment since most often they will be non-fast-forward commits and you may want to lose the history when publishing. If you do not wish to use forced commits for the subtree push you should opt out of this method and publish your files manually. This project does include gulp commands that you can use to prepare your project for manually pushing.
>
>`$ gulp clean` will clear the contents of *_app/temp/* and completely delete the *_dist/* directory in preparation for a development backup since typically you wouldn't want to backup these extra files.
>
>`$ gulp build` will produce a deployment-ready version of the *_dist/* directory.

**DISCLAIMER**: These commands are all based on a Windows 10 machine using Git Bash. Mileage may vary. Also, this is based on my admittedly loose understanding of Git so there may be better ways to do this.
***
#### Project Structure
The project structure will look something like the following (NOTE: it can and **likely will** vary based on what you choose to include in your project):
```
.
  _app/
      css/
          0_tools/
          1_base/
          2_modules/
          3_layouts/
          main.sass
      images/
          -
      jekyll/
          _data/
          _drafts/
          _includes/
          _layouts/
          _posts/
          _config-prod.yml
          _config.yml
          index.html
      js/
          -
      pugfiles/
          -
      temp/
          -
  _dist/
      css/
          main.css
          main.min.css
      images/
          -
      js/
          scripts.js
          scripts.min.js
  .git/
  node_modules/

  .gitignore
  deploy.sh
  gulpfile.js
  package.json
  package-lock.json
  README.md
```
