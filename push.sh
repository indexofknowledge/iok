#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git add README.md
  git commit --message "Auto-generated awesome-list in Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote rm origin
  git remote add origin https://rustielin:${GH_TOKEN}@github.com/rustielin/iok.git > /dev/null 2>&1
  git push --quiet --set-upstream origin master
}

setup_git
commit_website_files
upload_files