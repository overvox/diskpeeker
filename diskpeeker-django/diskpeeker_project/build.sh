#!/usr/bin/env bash

# clean old build
rm -r dist diskpeeker-django.pyz

# include the dependencies from `pip freeze`
pip install -r ../requirements.txt --target dist/

# or, if you're using pipenv
# pip install -r  <(pipenv lock -r) --target dist/

# specify which files to be included in the build
# You probably want to specify what goes here
cp -r \
-t dist \
diskpeeker diskpeeker_project static manage.py

# finally, build!
shiv --site-packages dist --compressed -p '/usr/bin/env python3.9' -o diskpeeker-django.pyz -e diskpeeker_project.main:main