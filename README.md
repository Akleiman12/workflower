# Workflower (PerkssTest)

## Run project

To run the project in development mode, follow the next steps:

0. Download/Clone the repository to your local machine.
1. Install dependencies from the terminal with: `npm install`.
2. Serve the server application in the terminal with `npm run server:serve:dev`.
3. In a separate terminal, serve the client application with `npm run client:serve:dev`.
4. Go to `http://localhost:4200` from your browser of choice to see the project running.

To run the project in production mode, follow the next steps:

0. Download/Clone the repository to your local machine.
1. Install dependencies from the terminal with: `npm install`.
2. Serve the server application in the terminal with `npm run server:serve:prod`.
3. In a separate terminal, serve the client application with `npm run client:serve:prod`.
4. Go to `http://localhost:4200` from your browser of choice to see the project running.

Running the applications in "production mode" will bundle the applications as a production build, which will use the production configuration and minify the js/ts code.

As an alternative, the scripts `npm run server:build:dev` and `npm run client:build:dev` (or `npm run server:build:prod` and `npm run client:build:prod`) will generate the application bundles in the directory `./dist`. Here you can see the differences between building the applications in `dev` or `prod` modes.

## Frameworks and tools

The frameworks used for this project are **ReactJS** (for the client) and **NestJS** (for the server). Both of them are popular frameworks that ease development in a NodeJS environment.
NestJS was chosen as a backend framework due to all the "out-of-the-box" functionalities (such as validation, modularity, and gateway; as well as guards and interceptors although those were not used) that it provides, as well as the architecture it forces being easily scalable.

Another tool worth mentioning is NX, which is a workspace manager for monorepos that make use of NodeJS technologies. As it can be seen in the repository, both client and server applications are included in the same repo; while NX helps to keep things organized and provides toolsets to develop them easily (for example, scaffolding for both frameworks and linters). Also, it provides an easy way to create "shareable" code that can be imported into each of the applications (see `./packages`).

VSCode was used for the development of this project, so certain configuration files were included to provide a better and more "responsive" workspace.

## Dependencies

In the `package.json` you will find several dependencies, divided between 'dependencies' and 'devDependencies'. Some of the noteworthy are:

- **@hapi/joi, class-validator, class-transformer**:

  JOI is a library that allows for very easy validation of classes (for request bodies for example). It is used in conjunction with 'class-validator' to validate classes and return human-readable errors, while class-transformer is used to parse objects into their respective classes without any overhead. This is a common practice when developing with NestJS.

- **axios**:

  Axios is a standard HTTP client, used to communicate the client with the API provided by the server.

- **cytoscape, react-cytoscapejs**:

  These two libraries provide the necessary tools to create the visualization of workflows. While cytoscape.js is the main library that contains all the needed classes and methods, react-cytoscapejs provides an easy-to-use React component library.

- **env-cmd**:

  This library allows each of the applications to manage different `.env` files, such as `.env.dev` and `.env.prod`.

- **react-icons**:

  Standard icons (SVG's) library for React.

- **react-tooltip**:

  Standard tooltip library for React. Used to display tooltips where needed.

- **sqlite3**:

  SQLite is an easy-to-use SQL database that requires no installation and works locally. This allows for easier and faster development, although it might not be the best DB to use in a production environment.

- **typeorm**:

  This ORM for typescript provides an easy way to connect to the provided SQL database. It provides an abstract way of interacting with the different entities such that it is possible to change the DB with minimal effort (I.E, changing the SQLite DB to PostgreSQL).

- **uuid**:

  Standard library to generate unique IDs when needed.

From the `devDependencies` there are no note-worthy dependencies, but it can be seen how NX (created by nrwl) includes a lot of development tools. Also, there are several `@types/*` libraries that are used to provide the required TS types for development.

## Testing

No useful tests were implemented in this project, but NX provides Jest as a default testing framework. This means that tests could be added without the need to install any other dependencies.

Inside each of the applications, `.spec` files can be found to give an idea of how these tests will look like. Note that these were only modified to prevent errors but were generated by NX when the apps/components/modules were generated.

## Special decisions

### Typescript

Although it was not required, I took the decision of using typescript due to how well it works for projects that are bound to be scaled. The typing system is excellent to keep everything organized and gives the advantage of self-documentation that javascript usually lacks. More often than not, there is no reason to not use typescript instead of vanilla javascript in any project.

### NestJS

NestJS for me is the go-to framework for any backend application, but I did consider using ExpressJS for this particular one. The reason I didn't is that NestJS is a lot better for applications that are expected to scale and, given that this was a consideration to be taken, I wanted to provide a clear path to do exactly that; while Express, although it is easier to implement and has less overhead, is not the best to provide a scaleable environment. Also, although this is more of a personal reason, NestJS gives me the chance to showcase my abilities a lot better.

### Modularity

As it can be seen, the whole of the backend functionality in regards to the "Workflows" is encapsulated in a module. The alternative to this was to implement everything directly in the App module (or main module), but this wouldn't be a good use of NestJS capabilities and wouldn't provide a good architecture. Modularity allows developers to plug or disconnect different functionalities (or sets of them) in a NestJS environment and therefore it is a lot better for scalability, as well as development in general.

### Mechanism to deploy

Although no mechanism to deploy was included in the project directly, the scripts that are described at the top of this document to "build" the applications allow for a multitude of them.
I want to allow myself to describe how to implement them instead of actually doing it only due to the fact that it would take longer to do so with very little return (for the purpose of this test).
I would suggest using GitHub Actions (given that the repository is hosted in GitHub) to achieve this, utilizing this feature with the help of Yaml to provide different pipelines to build, test, and deploy; to the given environment. The build is already explained, while testing can be implemented better and executed in the pipelines and later the deployment can be done to the service that is selected for this (either a cloud-based option, like Google Cloud or AWS, or a server).

### Angular

Given the instructions for the test, I was not allowed to use another framework other than React. But, given the option, I would much rather use Angular for similar reasons to NestJS: scalability and maintainability. A good extra note for this is that the architecture provided by NestJS is extremely similar to Angular, which would allow for a more cohesive environment for developers.
