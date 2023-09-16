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
