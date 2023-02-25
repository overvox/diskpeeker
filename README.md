# Diskpeeker

A full-stack application for displaying informtion about disks of a host system. Built with Django (+[DRF](https://www.django-rest-framework.org/)), React & [Pico.css](https://picocss.com/).

## Status

The first usable version is complete with some UI & UX issues that could be adressed in the future.
Currently the app supports the following features:

- Fetch currently available disk partitions and persistent them in a database
- Change display names for disks or partitions
- Hide and show specific disks or partitions

## Screenshots

<img src="screenshots/Overview.png" width="530px"></img> 
<img src="screenshots/EditView.png" width="400px"></img> 

## Installation & Setup

### Django Backend
Prerequisites:

- Python >v3.9
To install the necessary dependencies, run `pip install -r requirements.txt`. Using a separate VEnv is recommended.

To run the app locally use `python manage.py runserver`.

To run test use `python manage.py test diskpeeker`.

### React Frontend

To install dependencies run `npm install`.

This project uses a slightly customized version of [Pico.css](https://picocss.com/). 
After changes, make sure [Sass](https://www.npmjs.com/package/sass) is installed and run `sass pico.scss pico.react.css` to create a new customized css file.

In development run `npm start` for testing. 


## Packaging & Deployment

### Django Backend

The backend app utilizes the psutil package to access the host system's hardware info, which does not work due to the isolated nature of docker containers.

An executable .pyz package can be created via [shiv](https://github.com/linkedin/shiv) using the `build.sh` script (linux only).
This will generate the selfcontained zipapp **diskpeeker-django.pyz** ready for deployment.

To run the app in prod make sure to set the env var `DJANGO_DEVELOPMENT='false'` (default if no it does not exist).
See [main.py](diskpeeker-django/diskpeeker_project/diskpeeker_project/main.py) on more info of how the zipapp is executed. 

One way to deploy the app on linux is using a [systemd service](https://github.com/coreos/docs/blob/master/os/getting-started-with-systemd.md).

### React Frontend

Use the docker-compose.yaml which will build the react app and create a docker image based on nginx.
The app will uses port 3080 as the default. 

Additionally the ENV Var *REACT_APP_DISKPEEKER_API_BASE_URL* needs to be setup accordingly (based on where the backend is running).