# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

## Apollo client Features

Hooks Used:
useQuery Hook
useMutation Hook

caching for posts
caching for likes
caching for comments

### useQuery methods

fetchMore
refetch
notifyOnNetworkStatusChange

Fragments

returned values
loading
data
error
fetchMore
refetch
networkStatus --> will change based on initial_loading/fetchMore/refetch/error/data etc

Update Cache using readQuery/writeQuery/readFragment/writeFragment

Cursor Pagination
Offset Pagination

### Patterns

Custom Hook:
useForm
usePagination

### POSTS FEATURES

Offset Based pagination
fetchPolicy: 'cache-and-network'

### POST DETAIL FEATURES

fetchPolicy: 'cache-first'

### COMMENTS FEATURES

Fetch Comments
Create comment and update cache to show updated comments and updated comment count
Delete comment and update cache to show updated comments and updated comment count
Cursor based Pagination on comments
Refetch Comments functionality to fetch latest comments
Caching
fetchPolicy: 'network-only'
skip query if condition not met
Edit comment functionality and update cache using readFragments/writeFragments to show updated comments

### LIKES FEATURES

Like/Unlike Post
Optimistic Response // updates UI Without waiting for response from request. After request completion, UI will update again.

### Admin Features

Admin can block/unblock comments of any post

<!-- ---------------------------------------------------- -->

# MERN Social Media App with GraphQL

A simple and interactive social media application built using the MERN (MongoDB, Express, React, Node.js) stack and GraphQL.

![App Demo](link_to_your_demo_image)

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
   git clone https://github.com/yourusername/mern-social-media-app.git
   cd mern-social-media-app
   ```

2. Install project dependencies for the client, server, and root:
   npm run ipkgs

3. Seed the admin user:
   npm run seed-admin

4. Start the server and client application concurrently:
   npm start

Now your application should be up and running at http://localhost:3000.

## Prerequisites

Before you begin, ensure you have met the following requirements:

Node.js should be installed in your system.
MongoDB should be installed and running.
VSCode or any code editor of your choice.

## Application Features

User registration and login
Create and delete posts
Like/unlike posts
Create/Delete/Edit comments
Admin functionality to allow/unallow comments creation on posts
Offset based pagination in posts
Cursor based pagination in comments
optimisticResponse for liking/unliking post

```markdown
## Usage

To use this project, follow these steps:

1. Register or log in to your account.

2. Create posts, like/unlike posts, and add comments.

3. Explore the admin features to manage comments on posts.

## Apollo Client Features

### Caching

Caching for posts
Caching for likes
Caching for comments

### useQuery Arguments

notifyOnNetworkStatusChange
fetchPolicy
Skip
optimisticResponse

### useQuery Returned values

Loading
Data
Error
FetchMore
Refetch
NetworkStatus (changes based on loading, fetchMore, refetch, error, data)

### Update Cache Functions

Using readQuery, writeQuery, readFragment, writeFragment

## Apollo Server Features

Role based access (Admin and User)
```
