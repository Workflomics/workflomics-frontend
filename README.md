# Workflomics: A Workflow Benchmarking Platform (front end)

[![DOI](https://zenodo.org/badge/594054560.svg)](https://zenodo.org/doi/10.5281/zenodo.10047136)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Project goal

The Workflomics platform aims to address the challenge faced by life science researchers who work with increasingly large and complex datasets and struggle to create optimal workflows for their data analysis problems.

The platform facilitates a "Great Bake Off" of computational workflows in bioinformatics by integrating bioinformatics tools and metadata with technologies for automated workflow exploration and benchmarking. This enables a systematic and rigorous approach to the development of cutting-edge workflows, specifically in the field of proteomics, to increase scientific quality, robustness, reproducibility, FAIRness, and maintainability.

The platform currently focuses on the proteomics domain. We aim to extend the platform to additional domains, e.g., metabolomics, genomics.

Visit the live demo:
http://workflomics.org/

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For now, it is assumed you already have a Postgres database and Postgrest API set up and running. See `docker-compose.yml` for an example configuration, and the `.sql` scripts in the `database` folder to load the tables and content. In addition, the [REST APE](https://github.com/sanctuuary/restape) jar (requires local build) and the corresponding docker [file](https://github.com/sanctuuary/restape/blob/main/Dockerfile) have to be available under ./RestAPE path while running docker-compose. 


For development, a simple proxy server is run (through `setupProxy.js`, which is picked up by create-react-app). Configure the endpoints in a `.env` file in the project directory:

```bash
API_PROXY_TARGET=http://localhost:3333
APE_PROXY_TARGET=http://localhost:4444
```

## Available Scripts

In the project directory, you can run:

### `npm install .`

Installs all required dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
