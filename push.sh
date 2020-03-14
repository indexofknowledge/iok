#!/bin/sh

#
# This script executes at the end of Travis builds to master, 
# and mainly exists to push up code generated in build steps
# e.g. newly generated awesomelist in README.md
# 
# Note: Awesomelist only really matters in master branch, since 
# that's what people see when they click into a repo by default, 
# so we can hardcode the branch name master
#

setup_git() {
  git checkout $TRAVIS_BRANCH
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

# XXX: potential race condition if origin/develop changes,
# but we can just re-run manually
fix_develop() {
  git checkout develop
  git rebase master
  git push --quiet --set-upstream origin develop
}

setup_git
commit_website_files
upload_files

# XXX: master gets new awesome-list via codegen
# we need to rebase develop on master each time to prevent divergence
fix_develop

