!/usr/bin/env sh

virtualenv2 webappenv
cd webappenv
git clone git@github.com:tnajdek/webapp-seed.git
source bin/activate
cd "webapp-seed"
pip install -r requirements.txt
fab install_deps