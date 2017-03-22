#!/usr/bin/env bash

# NOTE: Python alias
alias python=python3

# NOTE: Install dependencies
sudo apt-get update -y
sudo apt-get install -y gettext build-essential pkg-config nodejs-legacy npm python3-dev libjpeg-dev zlib1g-dev python-virtualenv virtualenvwrapper

# NOTE: Install virtual environment
source /etc/bash_completion.d/virtualenvwrapper
mkvirtualenv --python=/usr/bin/python3 --no-site-packages --unzip-setuptools django-markdownx
pip install --upgrade pip
pip install -r /srv/django-markdownx/requirements.txt

# NOTE: Folders
sudo chown vagrant:vagrant /srv

# NOTE: Bash
sudo sed -i '$a cd /srv/django-markdownx/' ~/.bashrc
sudo sed -i '$a workon django-markdownx' ~/.bashrc

# NOTE: Install Node modules & compile static files
cd /srv/django-markdownx/
npm install
npm run dist

echo -e '\e[33;1;5mDONE!\e[0m \e[33;1;3m Connect using "vagrant ssh" \e[0m'
