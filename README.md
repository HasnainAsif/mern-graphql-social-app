# MERN Social Media App with GraphQL

A simple and interactive social media application built using the MERN (MongoDB, Express, React, Node.js) stack and GraphQL.

<!-- ![App Demo](link_to_your_demo_image) -->

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Application Features](#application-features)
- [Usage](#usage)
- [Apollo Client Features](#apollo-client-features)
- [Apollo Server Features](#apollo-server-features)

## Introduction

This social media application provides a platform for users to connect, share posts, interact with posts, and manage comments. It incorporates a range of features including user authentication, authorization, post creation, liking/unliking posts, commenting, and admin controls for comment management.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/HasnainAsif/mern-graphql-social-app.git
   ```

2. Change directory to project directory

   ```sh
   cd mern-social-media-app
   ```

3. Install project dependencies for the client, server, and root:

   ```sh
   npm run ipkgs
   ```

4. Seed the admin user:

```sh
   npm run seed-admin
```

4. Start the server and client application concurrently:

```sh
   npm start
```

Now your application should be up and running at http://localhost:3000.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** should be installed in your system.
- **MongoDB** should be installed and running.
- **VSCode** or any code editor of your choice.

## Application Features

- User registration and login
- Create and delete posts
- Like/unlike posts
- Create/Delete/Edit comments
- Admin functionality to allow/unallow comments creation on posts
- Offset based pagination in posts
- Cursor based pagination in comments
- optimisticResponse for liking/unliking post
- Caching for Posts, comments, likes

### POSTS FEATURES

- Offset Based pagination
- fetchPolicy is 'cache-and-network'

### POST DETAIL FEATURES

- fetchPolicy is 'cache-first'

### COMMENTS FEATURES

- Fetch Comments
- Cursor based Pagination
- Refetch Comments functionality to fetch latest comments
- fetchPolicy is 'network-only'
- skip query if condition not met
- Create/Delete comment and update cache(using readQuery/writeQuery) to show updated comments and updated comment count
- Edit comment and update cache(using readFragment/writeFragment) to show updated comments

### LIKES FEATURES

- Like/Unlike Post
- Automatic caching to show updated likes count. No need to handle caching manually.
- Optimistic Response --> updates UI Without waiting for response from request. After request completion, UI states will update again.

### Admin Features

- Admin can allow/unallow comments creation on any post. By default, comments are allowed.

## Usage

To use this project, follow these steps:

1. Register or log in to your account.

2. Create posts, like/unlike posts, and add comments.

3. Login with admin(using username **admin** and password **123456**) to allow/unallow comments creation

## Apollo Client Features

### Caching

- Caching for posts
- Caching for likes
- Caching for comments

### useQuery Arguments

- notifyOnNetworkStatusChange
- fetchPolicy
- Skip
- optimisticResponse

### useQuery Returned values

- Loading
- Data
- Error
- FetchMore
- Refetch
- NetworkStatus (changes based on loading, fetchMore, refetch, error, data)

### Update Cache Functions

- Using readQuery, writeQuery, readFragment, writeFragment

## Apollo Server Features

### Role based access

- Admin
- User

### Middlewares

- For a post to check, if request is from post owner
- For a comment to check, if request is from comment owner
- If request is authenticated
- If request is from admin authenticated
