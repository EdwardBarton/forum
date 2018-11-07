
// *************** FUNCTIONS ****************** //

const createPostButton = (faIcon, bsBtnClass, btnClass) => {
  const button = document.createElement(`button`);
  const icon = document.createElement(`i`);
  icon.setAttribute(`class`, `fas fa-${faIcon}`);
  button.appendChild(icon);
  button.setAttribute(`class`, `btn btn-sm btn-${bsBtnClass} ${btnClass}`)
  return button; // returns button html node
};

// Creates a post object, pushes to the posts array, and renders posts
let postId = 0;
const createPost = (userName, postContent) => {
  const post = {
    owner: userName,
    message: postContent,
    votes: 0,
    id: postId
  };
  posts.push(post);
  
  // Increment id for next post obj that gets created (post.id)
  postId++;
  renderPosts();
};

// Render HTML for posts
const renderPosts = () => {
  // Clear existing posts from posts (ul) html
  while (postsList.hasChildNodes()) {
    postsList.removeChild(postsList.firstChild);
  }

  // Create post buttons
  const upvoteButton = createPostButton(`arrow-up`, `success`, `upvotePost`);
  const downvoteButton = createPostButton(`arrow-down`, `warning`, `downvotePost`);
  const editButton = createPostButton(`edit`, `primary`, `editPost`);
  const deleteButton = createPostButton(`trash-alt`, `danger`, `deletePost`);

  // Create html for individual posts
  let postHTML = '';  
  posts.map(post => {
    postHTML += `<li data-id="${post.id}"><span class='votes'>${post.votes}</span> : `; 
    postHTML += `<span class='name'>${post.owner}</span> - `
    postHTML += `<span class='message'>${post.message}</span>`;
    postHTML += upvoteButton.outerHTML;
    postHTML += downvoteButton.outerHTML;
    postHTML += editButton.outerHTML;
    postHTML += deleteButton.outerHTML;
    postHTML += `</li>`;
  });

  // Add post to posts list ul
  postsList.innerHTML = postHTML;
};


const posts = [];
const postsList = document.querySelector(`ul`);
const nameInput = document.querySelector(`input`);
const messageTextArea = document.querySelector(`textarea`);


// On form submission, a post should be created based off of the user's inputs
document.querySelector(`form`).addEventListener(`submit`, (e) => {
  // Prevent form from actually submitting anywhere
  e.preventDefault();

  // Get user's inputs and create the post obj
  let name = nameInput.value;
  let message = messageTextArea.value;

  // Only create posts w/ new ids (edit post will have same id)
  createPost(name, message);
  
  // Clear form and focus on input
  nameInput.value = ``;
  messageTextArea.value = ``;
  nameInput.focus();

});

// Handle post's button clicks after they've been rendered onto the page
postsList.addEventListener(`click`, e => {
  // Determine which button was clicked and the data-id of the html post
  const clickedButton = e.target.closest('button');
  const postLi = e.target.closest('li');
  const postLiDataId = parseInt(postLi.getAttribute('data-id'));

  // Map JavaScript post obj --> html post li
  posts.map(post => {
    if (post.id === postLiDataId) {
      // Upvote post
      if (clickedButton.classList.contains('upvotePost')) {
        post.votes++;
      }
      // Downvote post
      else if (clickedButton.classList.contains('downvotePost')) {
        post.votes--;
      }
      // Edit post
      else if (clickedButton.classList.contains('editPost')) {
        debugger;
        postLi.style.display = 'none';
        nameInput.value = post.owner;
        messageTextArea.value = post.message;
      }
      // Delete post
      else if (clickedButton.classList.contains('deletePost')) {
        posts.splice(posts.indexOf(post), 1);
      }
    }
  });

  // Sort and re-render
  posts.sort((a, b) => b.votes - a.votes);
  renderPosts();
});