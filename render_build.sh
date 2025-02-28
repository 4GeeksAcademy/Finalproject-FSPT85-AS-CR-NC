#!/usr/bin/env bash
# exit on error
set -o errexit

cd src/front
npm install
npm run build
cd ../..

pipenv install

pipenv run flask insert-test-users 5
pipenv run flask insert-test-vehiculos
pipenv run flask insert-test-reservas
pipenv run migrate
pipenv run upgrade
