# microservicesReact

Microservices with Node JS and React. Building a little app from scratch.

## Tech Stack

- `React`
  - Generate a new React App using Create-React-App
- `Node JS`
  - Create an Express-based project for the `Posts` Service
  - Create an Express-based project for the `Comments` Service
- `Docker` Containers wrap up everything that is needed for a program + how to start and run it without worrying about setup or dependencies
  - [Buildkit](https://docs.docker.com/develop/develop-images/build_enhancements/)
    Features and Documentation
  - [Specifying external cache sources](https://docs.docker.com/engine/reference/commandline/build/#specifying-external-cache-sources)
  - [Advanced Dockerfiles](https://www.docker.com/blog/advanced-dockerfiles-faster-builds-and-smaller-images-using-buildkit-and-multistage-builds/) Faster Builds and Smaller Images Using BuildKit and Multistage Builds
- `Kubernetes`

##### Micro Services

- Client service

  - Create a simple form to consume Post and Comments services
  - Use [BootstrapCDN](https://getbootstrap.com/docs/5.0/getting-started/download/) - copy and paste CDN to add to html public file to style the form

- Post service
  - Create a Post
  - List all Posts

| Post Services |        |                 |                    |
| ------------- | ------ | --------------- | ------------------ |
| Path          | Method | Body?           | Goal               |
| /post         | POST   | {title: String} | Create a new post  |
| /posts        | GET    | -               | Retrieve all posts |
|               |        |                 |                    |

- Comment service
  - Create a comment (asynchronous communication with List all posts)
  - List all comments (Tied to posts by user)
  - In charge of all business logic around a comment
  - It will process events to update status and will generate an updated event to other services

| Comments Services   |        |                   |                                                             |
| ------------------- | ------ | ----------------- | ----------------------------------------------------------- |
| Path                | Method | Body?             | Goal                                                        |
| /posts/:id/comments | POST   | {content: String} | Create a new post cp,,emt associated with the given post ID |
| /posts/:id/comments | GET    | -                 | Retrieve all comments associated with the given post ID     |
|                     |        |                   |                                                             |

- Comments By PostId

  - ID of a post => [{id: "generatedid", content: 'great post'}, {id: "secondId", content: 'another post'}] <-/_array of comments_/

- Event Bus Service

  - All events hit the endpoint for this event bus
  - Front end get the posts from the event bus instead of each different service

- Query Service -

  - The query service is about presentation logic
  - It is joining two resources right now (posts and comments)
    , but it might join 10
  - This service will utilize a moderation service to flag comments
  - Query service will only listens for 'update' events

- Moderation Service
  - Will send events when moderation is done sending a status event back.
    - Default status will be pending - will send a message to alert of status
    - After comment is approved the status will update to approved
    - The frontend won't need to use this service so we won't install cors

### Request Minimization Strategies

- A `Monoliths` appplication is built as a single unit. A monolithic application is self-contained and independent from other computing applications.
- `Microservices` are an architectural aproach to building applications. As an architectural framework, microservices are distributed and loosely coupled, so one team's changes won't break the entire app. When using `microservices`, you isolate software functionality into multiple independent modules that are individually responsible for performing precisely defined, standalone tasks. These modules communicate with each other through simple, universally accesible application programming interfaces (APIs).
- `Synch communication` - Introduces a dependency between services. If any inter-service request fails, the overall request fails. The entire reques is only as fast as the slowest request. Can easily introduce webs of requests.
- `Async Communication` - <strong>Post service</strong> -> Will emit an event any time a post is created. <strong>Comments Service</strong> -> Will emit an event any time a comment is created. <strong>Query Service</strong> -> Assembles all of the blogs + comments into an efficient data structure. <strong>Event Broker</strong> -> Receives events, sends them on to interested parties.
  - `Notes on Async Communication,` - Pros: Query Service has zero dependencies on other services. Query Service will be extremely fast. - Cons: Data duplication, harder to understand.
  - We'll build an `event bus` with Javascript and Express to keep track of all the events in the app.
    - Event bus receives events, publishes them to listeners. Many different subtle features that make async communication way easier or way harder.

#### Docker and Kubernetes

- Docker Containers wrap up everything that is needed for a program + how to start and run it without worrying about setup or dependencies
- Kubernetes is a tool for running a bunch of different container
- We give it some configuration to describe how we want our containers to run and interact with each other
  - Kubernetes Cluster - a set of different virtual machines(Nodes). Master is a program to manage everything in the cluster
- Docker Ecosystem:

  - Docker Client (Docker CLI) -> Tool to issue commands
  - Docker Server (Docker Daemon) -> Tool responsible for creating images, runnig containers, etc
  - Docker Machine
  - Docker Image -> Single file with all the dependencies and config required to run a program
    - Container -> Instance of an image. Runs a program. - A set of processes that have a grouping of resources specifically assiged to it
  - Docker Hub
  - Docker Compose
  - Namespacing and Control Groups belong to Linux OS
  - When we install Docker in Mac we install a Linux Virtual Machine

  ##### Docker CL Commands

  - To create and run a container from an image (docker run = docker create + docker start)

  ```
  docker run <image name>

  ```

  - Default command override

  ```
  docker run <image name> override command
  ex. docker run busybox echo hi there
  ex. docker run busybox ls //Will print the folder names that exist in that container(FS Snapshot)
  ```

- List all running containers

```
docker ps
```

- Ping an external url and measure the amount of latency

```
docker run busybox ping google.com
```

If we have that running and try docker ps again, it will show the docker container running. We will also see the container ID, status, when was created, ports and names.

- To show all containers ever created in our machine

```

docker ps --all

```

- Restarting Stopped Containers

```
docker ps --all
docker start -a <container id>
```

- Removing Stopped Containers (it will delete all stopped containers, networks not used by at leas one container, all dangling images and all build cahce)

```
docker ps --all
docker system prune
```

- Retrieving Output Logs

```
docker start <container id>
docker logs <container id>
```

- Stopping Containers

```
docker create busybox ping google.com
docker start <container id>
docker logs <container id>
docker ps
docker stop <container id> or docker kill <container id>
```

- Multi-Command Containers

```
docker run redis
docker ps
docker exec -it <container id> reids-cli

```

- The purpose of the "it" flag
  In reality is two flags -i and -t -> to be sure all the text in CL is nicely formatted and send in and out of our terminal

- Getting a command prompt in a container

```
docker exec -it <container i> <command>
ex. docker exec -it 4e3d1593585 sh
sh command will run a Unix environment to have full terminal acces like: cd ~/, ls, cd /
```

- Starting with a shell ex.

```
docker run -it busybox sh
ls
cmm C to end it or type: exit

```

- Container isolation
  If you are running same container in two different command windows it will be like you are running two separate containers. Each will have their own files. If you create a file in one window and then type ls on the other one, it will not show the new created file.

- How to create a new Docker Image
  - Create a Dockerfile -> Docker client -> Docker Server -> Usable Image
    - Dockerfile will have the configuration to define how our container should behave
    - Inside every Docckerfile will specify a base image, run some commands to install additional programs, specify a command to run on container startup
- Buildkit for Docker Desktop v2.4.0+ and Edge
  - Recent versions of Docker have Builtkit enabled by default

### Building a Dockerfile -> Create an image that runs redis-server

- Create a new directory anywhere in the machine

```
mkdir redis-image
```

- Open directory with text editor and create a Dockerfile (no end extension)
  - Configure the Dockerfile
  - Inside directory run a command to build the new Image (don't forget dot at the end)
  ```
  docker build .
  ```
  - If we add more instructions to Dockerfile we just need to run the build again. It will rebuild from Cache and just add the extra set of instructions. Best practice is to add new line of instructions far down the line of previous commands for a quick re build
- Tagging an image <The dot at the endspecifies the directory of files/folders to use for the build of the tag>

  - Rename an Image to use name instead of id. Image to be tagged naming convention: - your Docker Id -> / -> repo/project name -> : version

  ```
  docker build -t sandra/redis:latest .
  ```

- Then we can use the new name to run the Image

```
docker run sandra/redis
```

- Manual Image Generation with Docker Commit (what the Dockerfile does)

```
dockr run -it alpine sh
apk add --update redis
docker ps
docker commit -c 'CMD ["redis-server"]' <id of running container>
docker run <container id>
```
