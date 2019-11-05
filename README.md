## Smart Reporting Enabler
### Read me

#### 1. Prerequisite for Multi-container docker application

In order to run this enabler code on your local machine you should have Docker installed.
Please refer to [Docker](http://docker.com) for detailed installation instructions

#### 2. Instalation

Make sure the Docker is installed on your  environment:
`docker --version`

Please note that functional tests were performed using the following versions:
`Docker version 17.05.0-ce, build 89658be` 
and
`docker-compose version 1.21.2, build a133471`

##### 2.1 - Clone the repository
Clone this repository by executing the following command:
`git clone https://daleixo@opensourceprojects.eu/git/p/vfos/assets/enablers/sre/code vfos-assets-enablers-sre-code`

##### 2.2 - Run multi-container Docker application

This multi-container Docker application is composed by two services: `sre` and `db` as it's configured in `docker-compose.yml`. `sre` service is build based on a DockerFile available and `db` is a on-the-shelf mysql service.

Navigate to the cloned directory (vfos-assets-enablers-sre-code if you didn't changed the 2.1 command) and execute `docker-compose up --build` to startup the multi-container enabler on background.

Check if services are up and running by executing the command:
`docker-compose ps`

#### 3. Uninstalation

Since this enabler is a multi-container Docker application you can erase the docker images by executing the following command in the application root folder:
`docker-compose down --rmi all`

#### 4. Usage

Whenever it's needed to have this enabler runnig, please execute `docker-compose up`.

Using your favorite web browser please navigate to `localhost:5920` to reach the frontend module. Please note that the port might change if you update the docker-compose.yml file by exposing different ports.

Please note that <localhost> it's related to the Docker environment which you are using.

The following Frontend endpoints are now available:
`localhost:5920/<username>`

For tests purposes `<username>` could be any wanted String.

##### 4.1 - Docker logs

For troubleshoot purposes, logs can be reached by using:
`docker logs vfos-assets-enablers-sre-code_sre_1`

##### 4.2 - Service enabler logs

The enabler service provides specific logs which you can find inside the Docker container.

`docker exec -it vfos-assets-enablers-sre-code_sre_1 bash`

Then you can tail the log file by executing:

`tail -f sre.log`



#### 3. API
API latest version is <v1>. To use it please replace `<api_version>` with `v1`


## vf-OS Enablers

### Enabler 3 - Get Report templates

```http
GET /api/vfosenabler/v1/templates/owners_name HTTP/1.1
Accept: */*
```

```http
HTTP/1.1 200 OK
Content-type: text/html
X-Powered-By: Express
Date: Tue, 29 Aug 2017 11:04:31 GMT
Connection: keep-alive
Transfer-Encondig: chunked

HTML PAGE

```

Use this API call whenever is needed to retrieve a specific template.  

#### Request
`GET /api/vfosenabler/<api_version>/execute/<template_id>`

#### URL Parameters

Resource Parameter | Description
---- | ----
api_version | Identifies the API version that will be used for the request
template_id | The template identification of the report you want to generate




#### Return Payload

The API response will contain a html file with the report template inside including the data structured in a table visualisation format.



#### Return Codes
Code | Description
--- | ---
200 | Report generated
400 | Bad request
404 | Template not found
500 | Internal Server Error - There was an unexpected error at some point during the processing of the request.





### Powered by:

![alt text](https://static.wixstatic.com/media/d65bd8_d460ab5a6ff54207a8ac3e7497af18c4~mv2_d_4201_2594_s_4_2.png "Smart Reporting Enabler")