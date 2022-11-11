Run the Backend application then the Frontend application (Which will automatically connect to BE app)

## Running the Backend application

## AllosaurusCAPI

This is a FastAPI project.

### Development server
cd into the project folder `cd allosaurus-api` <br/><br/>
Run `docker-compose build` to spin up the docker containers. <br/><br/>
Run `docker-compose up` for a dev server. Navigate to `http://localhost:8001/api/texts/`. <br/><br/>
Run `docker-compose exec web alembic upgrade head` to run database migrations <br/><br/>

You can interact with the api on `http://localhost:8001/docs` via openAPI interface to create sample texts that are displayed on the FE for reading <br/>

Sample Payload <br/>
```
{
  "title": "Another Test Text",
  "passage": "Oceans and lakes have much in common, but they are also quite different. Both are bodies of water, but oceans are very large bodies of salt water, while lakes are much smaller bodies of fresh water. Lakes are usually surrounded by land, while oceans are what surround continents. Both have plants and animals living in them. The ocean is home to the largest animals on the planet, whereas lakes support much smaller forms of life. When it is time for a vacation, both will make a great place to visit and enjoy"
  "duration": 2
}
```


## Running the client application

## AllosaurusClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.

### Development server
cd into the project folder `cd allosaurus-client` <br/><br/>
Run `npm instal` to install dependancies. <br/><br/>
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. <br/>
<br/>
The application will automatically reload if you change any of the source files.<br/>


### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
