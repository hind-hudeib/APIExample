function renderBooks(books) {
  const booksContainer = document.getElementById("books-container");
  booksContainer.innerHTML = "";

  books.map((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("col-md-4");
    bookElement.classList.add("book-card");

    bookElement.innerHTML = `
        <h2>${book.title}</h2>
        <p>Author: ${book.author}</p>
        <p>Publication Year: ${book.publicationYear}</p>
        <p>Genre: ${book.genre}</p>
        <img src="${book.coverImage}" alt="${book.title} Cover" />
      `;

    booksContainer.appendChild(bookElement);
  });
}


fetch("http://localhost:3001/books")
  .then((response) => response.json())
  .then((data) => {
    const books = data;
    console.log(books);
    renderBooks(books);

    // Implement the filter functionality
    document.getElementById("searchInput").addEventListener("input", () => {
      const searchTerm = document
        .getElementById("searchInput")
        .value.toLowerCase();

      // Filter books that match the search term
      const filteredBooks = books.filter((book) => {
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        return title.includes(searchTerm) || author.includes(searchTerm);
      });

      renderBooks(filteredBooks); // Display filtered books
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });




//
const commentInput = document.getElementById("comment-input");
const addCommentButton = document.getElementById("add-comment");
const commentsList = document.querySelector(".comments-list");

// Function to fetch and display comments
function fetchComments() {
  fetch(" http://localhost:3003/comments")
    .then((response) => response.json())
    .then((comments) => {
      commentsList.innerHTML = "";
      comments.map((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("card", "mb-4");
        commentDiv.innerHTML = `
                      <div class="card-body">
                          <div class="d-flex justify-content-between">
                              <div class="d-flex flex-row align-items-center">
                                  <p class="small mb-0 ms-2">${comment.name}</p>
                              </div>
                              <div>
                                  <button class="btn btn-danger btn-sm me-2" id="${comment.id}" onclick="deleteComment(this)">Delete</button>
                                  <button class="btn btn-primary btn-sm" id="${comment.id}" onclick="updateComment(this)">Update</button>
                              </div>
                          </div>
                      </div>
                  `;
        commentsList.appendChild(commentDiv);
      });
    });
}

// Add a new comment
addCommentButton.addEventListener("click", () => {

  fetch("http://localhost:3003/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name: commentInput.value}),
  })
    .then(() => {
      commentInput.value = "";
      fetchComments();
    })
    .catch((error) => console.error("Error adding comment:", error));
});

// Delete a comment
function deleteComment(button) {
  const commentId = button.getAttribute("id");
  fetch(`http://localhost:3003/comments/${commentId}`, {
    method: "DELETE",
  })
    .then(() => {
      fetchComments();
    })
    .catch((error) => console.error("Error deleting comment:", error));
}

// Update a comment
function updateComment(button) {
  const commentId = button.getAttribute("id");
  const newComment = prompt("Update the comment:", "");

  if (newComment !== null) {
    fetch(`http://localhost:3003/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newComment }),
    })
      .then(() => {
        fetchComments();
      })
      .catch((error) => console.error("Error updating comment:", error));
  }
}
fetchComments();
