const list = document.querySelector(".recipes");
const btn = document.querySelector(".btn-outline-secondary");
const form = document.querySelector("form");
const button = document.querySelector("button");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const now = new Date();
  const recipe = {
    title: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now),
    author: "mother",
  };
  console.log(form.recipe.value);
  db.collection("recipes")
    .add(recipe)
    .then(() => {
      console.log("recipe added");
    })
    .catch((err) => {
      console.log(err);
    });
});

const addRecipe = (recipe, id) => {
  let author = recipe.author;
  let html = `<li data-id ="${id}">
<div>${recipe.title}</div>
<div style ="color: blue">${author}</div>
<button class = "btn btn-danger btn-sm my-2">delete</button>
  </li>`;

  list.innerHTML += html;
};

//delete recipe
const deleteRecipe = (id) => {
  const recipes = document.querySelectorAll("li");
  recipes.forEach((recipe) => {
    if (recipe.getAttribute("data-id") === id) {
      recipe.remove();
    }
  });
};
//get documents
const unsub = db.collection("recipes").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = change.doc;
    if (change.type === "added") {
      addRecipe(doc.data(), doc.id);
    } else if (change.type === "removed") {
      deleteRecipe(doc.id);
    }
  });
});
// deleting data
list.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.parentElement.getAttribute("data-id");
    db.collection("recipes")
      .doc(id)
      .delete()
      .then(() => {
        console.log("recepi deleted");
      });
  }
});

//unsub from database changes
button.addEventListener("click", () => {
  unsub();
});
