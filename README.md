Run the Backend application then the Frontend application (Which will automatically connect to BE app)

## Running the Backend application

## AllosaurusCAPI

This is a FastAPI project.

### Development server
cd into the project folder `cd allosaurus-api`
Run `docker-compose build` to spin up the docker containers. 
Run `docker-compose up` for a dev server. Navigate to `http://localhost:8001/api/texts/`. 
Run `docker-compose exec web alembic upgrade head` to run database migrations


You can interact with the api on `http://localhost:8001/docs` via openAPI interface to create sample texts that are displayed on the FE for reading

Sample Payload
{
  "title": "Another Test Text",
  "passage": "Oceans and lakes have much in common, but they are also quite different. Both are bodies of water, but oceans are very large bodies of salt water, while lakes are much smaller bodies of fresh water. Lakes are usually surrounded by land, while oceans are what surround continents. Both have plants and animals living in them. The ocean is home to the largest animals on the planet, whereas lakes support much smaller forms of life. When it is time for a vacation, both will make a great place to visit and enjoy"
  "duration": 2
}


## Running the client application

## AllosaurusClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

### Development server
cd into the project folder `cd allosaurus-client`
Run `npm instal` to install dependancies. 
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 
The application will automatically reload if you change any of the source files.


### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).