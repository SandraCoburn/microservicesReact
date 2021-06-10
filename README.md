# microservicesReact

Microservices with Node JS and React. Building a little app from scratch.

## Tech Stack

- `React`
  - Generate a new React App using Create-React-App
- `Node JS`
  - Create an Express-based project for the `Posts` Service
  - Create an Express-based project for the `Comments` Service
- `Docker`
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
