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

### Docker and Kubernetes

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

  ### Docker CL Commands

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
cmm D to end it or type: exit

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

### Create a Docker file for Node

- 1. Create Node JS web app
- 2. Create a Dockerfile
- 3. Build image from dockerfile
- 4. Run image as container
- 5. Connect to web app from a browser

If we use Alpine image for our project it will give us this error message because Alpine doesn't have node pre installed:

```
 /bin/sh: npm: not found
```

[Hub Docker](https://hub.docker.com/)/explore has pre made images that we can use in our projects. We can use node image to install in our simpleweb project

- To fix the error we use the following command in our Dockerfile:

```
FROM node:alpine
```

- Container Port Forwarding
  - Set up Docker Run with Port Mapping
  ```
  docker run -p 8080:8080 <image name>
  ```
- Specifying a Working Directory to copy our project files into Docker image
  Change the Docker file to add a new line of instructions

  - `WORKDIR /usr/app`
  - Rebuild the image
  - Check for files in shell

  ```
  docker ps
  docker exec -it <image id> sh
  ls
  ```

  When we modify our app files the changes by default don't go to our Docker container. To update changes we need to rebuild the whole container again. To fix this and prevent unnecessary rebuilds we will change the Dockerfile specs by copying only the json package instead of all file.

  - `COPY ./package.json ./`
  - `RUN npm install`
  - `COPY ./ ./`
  - Then run the build command again: `docker build -t sandra/simpleweb .`

  #### Docker login

  ```
  docker login -u <username>
  ```

  ### Kubernetes Cluster

  - Each Node(virtual machine) in a Kubernetes cluster will run a Container. Kubernetes can send requests from one container to another one. We give it some configuration to describe how we want our containers to run and interact with eachother.

#### Kubernetes Setup

- Running Docker for Mac/Windows:
  - Click on Docker icon from machine browser
  - Click preferences
  - Click on Kubernetes
  - Check Enable Kubernetes
  - Apply & restart
- How Kubernetes work:
  - `Kubernetes Cluster` - A collection of nodes + a master to manage them
  - Every Docker Container will be in a `Pod` inside a `Node`(virtual machine)
  - `Deployment` monitors a set of pods, make sure all containers are running and restarts them if they crash
  - `Service` gives access to containers in cluster, provides an easy to remember URL to access a running container
- Kubernetes Config Files
  - Tells Kubernetes about the different Deployements, Pods, and Services(referred to as 'Objects') that we want to create
  - Written in YAML syntax
  - Always store these files with our project source code - they are documentation
- Command line to include yaml file to kubernetes and create a new pod

```
kubectl apply -f posts.yaml
```

- To read the pods created

```
kubectl get pods
```

#### Common Kubectl Commands

| Docker World                           | K8s World                             |
| -------------------------------------- | ------------------------------------- |
| docker ps                              | kubectl get pods                      |
| docker exec -t [`container id`][`cmd`] | kubectl exec -it [`pod_name`][`cmd`]  |
| docker logs [`container id`]           | kubectl logs [`pod_name`]             |
|                                        | kubectl delete pod [`pod_name]        |
|                                        | kubectl apply -f [`config file name`] |
|                                        | kubectl describe pod [`pod_name`]     |

### Deployment -> manager of a set of pods

- If any pod crashes deployment will re create it again
- To update code in different containers like a new version. Deployment will take care of this update automatically

#### Create a Deployment

- Delete the posts.yaml file and create a new one: posts-depl.yaml. Add new conf.

#### Deployment Commands

- kubectl get deployments
- kubectl describe deployment [depl name]
- kubectl apply -f [config file name]
- kubectl delete deployment [depl_name]

#### Updating the Image Used By a Deployment

- Method #1 steps:
  - Make a change to your project code
  - Rebuild the image, specifying a new imae version
  - In the deployment config file, update the version of the image
  - Run the command: kubectil apply -f [depl file name]
- Method #2 - preferred
  - The deployment must be usig the 'latest' tag in the pod spec section
  - Make an update to your code
  - Go into deployment yaml file and change the conf to the image not to have a version. ex. image: sandracoburn/posts:latest
  - Build the image:
    - We tell kubernetes to apply the latest version. In command line: kubectl apply -f posts-depl.yaml
    - `docket build -d sandracoburn/posts .`
  - Push the image to docker hub
    - `docker push sandracoburn/posts`
  - Run the command: `kubectl rollout restart deployment [depl_name]`

### Networking With Services

- Type of Services:
  - `Cluster IP` -> Sets up an easy to remember URL to acces a pod. Only exposes pods in the cluster
  - `Node Port` -> Makes a pod accesible from outside the cluster. Usually ony used for dev purposes
  - `Load Balancer` -> Makes a pod accessible from outside the cluster. This is the right way to expose a pod to the outside world
  - `External Name` -> Redirects an in-cluster request to a CNAME url
- To create a service
  - Create a new yaml file in infra folder ex. posts-srv.yaml
  - Configure the posts-srv file to create new service
  - In CL inside the k8s folder run this command to create service in Kubernetes:
  ```
  kubectls apply -f posts-srv.yaml
  To get a list of all services:
  kubectl get services
  To get port number:
  kubectl describe service posts-srv
  To access in localhost copy the port and open in browser(access container inside of a cluster):
  localhost:31940/posts
  ```

#### Cluster IP Services

Pods will reach out to Cluster IP Service to access resources from each other

### For every service:

- Build an `Image` for the service(event bus, comments, etc)
  - ex. docker build -t sandracoburn/event-bus .
- `Push` the image to Docker Hub
  - ex. docker push sandracoburn/event-bus
- Create a `deployment` pod for each service and configure in own yaml file, then run yaml file inside k8s
  - ex. kubectl apply -f event-bus-depl.yaml
- Create a `Cluster IP service` for each service
  - Inside depl.yamls file from each service add cluster Ip config at the bottom
  - run it inside k8s file in CL: ex. kubectl apply -f event-bus-depl.yaml
- Wire it all up

#### Communicating between services

- Get a list of all services:

```
kubectl get services
```

- From result find the local host port name and change it in the service's server request code
  - ex, from http://localhost:4000/posts to http://posts-clusterip-srv:4000/posts
