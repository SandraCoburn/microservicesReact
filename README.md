# microservicesReact

Microservices with Node JS and React

##### Services

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

| Comments Services   |        |                   |                                                             |
| ------------------- | ------ | ----------------- | ----------------------------------------------------------- |
| Path                | Method | Body?             | Goal                                                        |
| /posts/:id/comments | POST   | {content: String} | Create a new post cp,,emt associated with the given post ID |
| /posts/:id/comments | GET    | -                 | Retrieve all comments associated with the given post ID     |
|                     |        |                   |                                                             |

- Comments By PostId
  - ID of a post => [{id: "generatedid", content: 'great post'}, {id: "secondId", content: 'another post'}] <-/_array of comments_/

## Tech Stack

- `React`
  - Generate a new React App using Create-React-App
- `Node JS`
  - Create an Express-based project for the `Posts` Service
  - Create an Express-based project for the `Comments` Service
- `Docker`
- `Kubernetes`
