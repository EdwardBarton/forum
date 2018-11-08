// *************** FUNCTIONS ****************** //

const createPostButton = (faIcon, bsBtnClass, btnClass) => {
  return $(`<button class="btn btn-sm btn-${bsBtnClass} ${btnClass}"><i class="fas fa-${faIcon}"></i></button>`);
};

// Creates a post object, pushes to the posts array, and renders posts
let postId = 0;
const createPost = (name, postContent) => {
  const post = {
    author: name,
    message: postContent,
    votes: 0,
    id: postId,
    editPost(newAuthor, newMessage) {
      this.author = newAuthor;
      this.message = newMessage;
    }
  };
  posts.push(post);

  // Increment id for next post obj that gets created (post.id)
  postId++;
  sortAndRenderPosts();
};

// Render HTML for posts
const sortAndRenderPosts = () => {
  posts.sort((a, b) => b.votes - a.votes);

  // Create post buttons
  const upvoteButton = createPostButton(`arrow-up`, `success`, `upvotePost`);
  const downvoteButton = createPostButton(`arrow-down`, `warning`, `downvotePost`);
  const editButton = createPostButton(`edit`, `primary`, `editPost`);
  const deleteButton = createPostButton(`trash-alt`, `danger`, `deletePost`);

  // Create html for individual posts
  let postHTML = '';
  posts.map(post => {
    postHTML += `<li data-id="${post.id}">`;
    postHTML += `<span class='post'>`;
    postHTML += `<span class='author'>${post.author}</span> - `;
    postHTML += `<span class='message'>${post.message} </span></span>`;
    postHTML += `<form class='edit-post hide-el'>`;
    postHTML += `<input class='edit-author' placeholder='New Author' value='${post.author}'>`;
    postHTML += `<input class='edit-message' placeholder='New Message' value='${post.message}'>`;
    postHTML += `<button type="submit">Edit</button>`;
    postHTML += `</form>`;
    postHTML += ` <i class="fas fa-thumbs-up"></i>`;
    postHTML += `<span class='votes'> ${post.votes} </span>`;
    postHTML += upvoteButton[0].outerHTML;
    postHTML += downvoteButton[0].outerHTML;
    postHTML += editButton[0].outerHTML;
    postHTML += deleteButton[0].outerHTML;
    postHTML += `</li>`;
  });

  // Add post to posts list ul
  postsList.html(postHTML);
};

// ************ VARIABLES ************** //

const posts = [];
const postsList = $('ul');
const nameInput = $('#name');
const messageTextArea = $('#message');
const submitButton = $(`button[type='submit']`);

// ************** EVENT HANDLERS ************** //

// On form submission, a post should be created based off of the user's inputs
submitButton.on(`click`, function(e) {
  // Prevent form from actually submitting anywhere
  e.preventDefault();

  // Get user's inputs and create the post obj
  let name = nameInput.val();
  let message = messageTextArea.val();
  createPost(name, message);

  // Clear form and focus on input
  nameInput.val('');
  messageTextArea.val('');
  nameInput.focus();
});

// Handle post's button clicks after they've been rendered onto the page
postsList.on(`click`, 'button', function() {
  // Determine which button was clicked and the data-id of the html post
  const clickedButton = $(this);
  const postLiDataId = parseInt(clickedButton.closest('li').attr('data-id'));

  // Map JavaScript post obj --> html post li
  posts.forEach(post => {
    if (post.id === postLiDataId) {
      // Upvote post
      if (clickedButton.hasClass('upvotePost')) {
        post.votes++;
        sortAndRenderPosts();
      }
      // Downvote post
      else if (clickedButton.hasClass('downvotePost')) {
        post.votes--;
        sortAndRenderPosts();
      }
      // Edit post
      else if (clickedButton.hasClass('editPost')) {
        // Hide post span from page while editing
        clickedButton.parent().find('.post').addClass('hide-el');

        // Show edit-post form with post obj values
        clickedButton.parent().find('.edit-post').removeClass('hide-el').addClass('show-el');
        clickedButton.parent().find('.edit-author').val(post.author).focus();
        clickedButton.parent().find('.edit-message').val(post.message);
        
        // Edit post obj and re-render posts once changes are complete
        $('.edit-post').on(`submit`, function(e) {
          e.preventDefault();
          post.editPost($(this).find('.edit-author').val(), $(this).find('.edit-message').val());
          sortAndRenderPosts();
        });
      }
      // Delete post
      else if (clickedButton.hasClass('deletePost')) {
        posts.splice(posts.indexOf(post), 1);
        sortAndRenderPosts();
      }
    }
  });
});
