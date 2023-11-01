# Workflomics: A Workflow Benchmarking Platform (front end)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development

For now, it is assumed you already have a Postgres database and Postgrest API set up and running. See [Deployment](#deployment) below for a docker compose configuration which starts all necessary services and initializes the database with the `.sql` scripts in the `database` folder.

For development, a simple proxy server is run automatically when running `npm start` (through `setupProxy.js`, which is picked up by create-react-app). Configure the endpoints in a `.env` file in the project directory:

```bash
API_PROXY_TARGET=http://localhost:3000
APE_PROXY_TARGET=http://localhost:4444
```

Install the required modules for the front-end:

```
npm install
```

To start the front-end, simply run

```
npm start
```

## Deployment

### Back-end services

Copy `docker-compose.yml` to the server and in the same directory, create `.env`. In this file, configure accordingly:

```
POSTGRES_PASSWORD=<password>
WF_DATA_DIR=<data directory>
```

At the moment, ports are hard-coded in the docker-compose.yml.

To start the database, API to the database and RestAPE, run the following:

```
docker compose --env-file .env up -d

# To remove the containers, run
docker compose down
```

### Nginx

The front-end can be statically served, but requires a reverse proxy. For this, you could use nginx. A sample config is in the nginx folder, this is usually placed at `/etc/nginx/sites-available/workflomics.org.conf`. Make sure it is pointing to the proper back-end services and that there is a symlink to the config in `sites-enabled`. Nginx also statically serves the website as specified in the config.

### Building and deploying the front-end

Make sure you are on the proper branch and have pulled any changes you want included. Build an optimized version of the application:

```
npm run build
```

This will build the application in the `build` directory. It can be statically served, for instance using nginx.

For instance, using nginx, simply copy the contents of the `build/` directory to `/var/www/workflomics.org/`.
