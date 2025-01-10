<img src="https://github.com/Workflomics/.github/blob/main/WORKFLOMICS_logo.png" alt="logo" width=60%/>

# Workflomics: A Workflow Benchmarking Web Platform


| Badges                   |                                                                                                                              |
|:------------------------:|------------------------------------------------------------------------------------------------------------------------------|
| **Packages and Releases** |  [![Latest release](https://img.shields.io/github/release/workflomics/workflomics-frontend.svg)](https://github.com/sanctuuary/APE/releases/latest) [![Static Badge](https://img.shields.io/badge/RSD-Workflomics-workflomics)](https://research-software-directory.org/software/workflomics) |
| **Build Status** | [![Build Frontend](https://github.com/Workflomics/workflomics-frontend/actions/workflows/build-frontend.yaml/badge.svg)](https://github.com/Workflomics/workflomics-frontend/actions/workflows/build-frontend.yaml) |
| **Documentation Status** | [![Documentation Status](https://readthedocs.org/projects/workflomics/badge/?version=latest)](https://workflomics.readthedocs.io/en/latest/?badge=latest) |
| **DOI**                  | [![DOI](https://zenodo.org/badge/594054560.svg)](https://zenodo.org/doi/10.5281/zenodo.10047136)                             |
| **License**              | ![GitHub](https://img.shields.io/github/license/workflomics/workflomics-frontend)                                           |


## Project goal

The Workflomics platform aims to address the challenge faced by life science researchers who work with increasingly large and complex datasets and struggle to create optimal workflows for their data analysis problems.

The platform facilitates a "Great Bake Off" of computational workflows in bioinformatics by integrating bioinformatics tools and metadata with technologies for automated workflow exploration and benchmarking. This enables a systematic and rigorous approach to the development of cutting-edge workflows, specifically in the field of proteomics, to increase scientific quality, robustness, reproducibility, FAIRness, and maintainability.

The platform currently focuses on the proteomics domain. We aim to extend the platform to additional domains, e.g., metabolomics, genomics.

Visit the live demo:
http://workflomics.org/

## Architecture

The Workflomics web interface is part of a larger infrastructure that includes a Postgres database, a Postgrest API, a RESTful APE service, etc. The architecture is presented in the figure below:

<div align="left">
  <img src="https://github.com/Workflomics/.github/blob/main/draw.io/architecture_simplified.png" alt="architecture_workflomics" width="60%">
</div>

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

The POSTGRES_PASSWORD is the password that is used to login to the Postgres database. The password can be set to anything the user wants, but it might be a good idea to use a password manager to generate a secure password and share it with other users that need access to hosted the database.
The WF_DATA_DIR is the directory where the data is stored.

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
