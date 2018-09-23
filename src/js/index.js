//import str from './models/Search';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


/** Global state of the app

* - Search object
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/

const state = {};



//Search Controller

const controlSearch = async () => {
  //1. Get query from view
  const query = searchView.getInput();


  if (query) {
    //2. New search object and add to state
    state.search = new Search(query);
    console.log(query);

    //3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
    //4. Search for recipes
    await state.search.getResults();

    //5. Render results on UI
      clearLoader();
    searchView.renderResults(state.search.result);
  } catch (err) {
    alert('Something went wrong with the search.....');
    clearLoader();
  }
  }

}


elements.searchFrom.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});


//Recipe Controller


const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
  //Prepare UI For changes
  recipeView.clearRecipe();
  renderLoader(elements.recipe);

  if (state.search) searchView.highlightSelected(id);

  //Create new recipe object
  state.recipe = new Recipe(id);



  //Get recipe data
   try {

  await state.recipe.getRecipe();
  state.recipe.parseIngredients();

  //Calcualte servings and calcTime
  state.recipe.calcTime();
  state.recipe.calcServings();

  //Render Recipe
  clearLoader();
  recipeView.renderRecipe(
      state.recipe,
      state.likes.isLiked(id)
  );

} catch (err) {
      alert('Error processing recipe!');
    }
  }
}


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

const controlList = () => {
  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
}

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {

        const newLike = state.likes.addLike(
          currentID,
          state.recipe.title,
          state.recipe.author,
          state.recipe.img
        );

        likesView.toggleLikeBtn(true);

        likesView.renderLike(newLike);

    } else {
      state.likes.deleteLike(currentID);

      likesView.toggleLikeBtn(false);

      likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

//Restore liked recipes on page load
window.addEventListener('load', () => {

  state.likes = new Likes();

  //Restore Likes
  state.likes.readStorage();

  //Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  //Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {

    if (state.recipe.servings > 1) {
          state.recipe.updateServings('dec');
          recipeView.updateServingsIngredients(state.recipe);
    }

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
      controlLike();
  }
});



//Way 1: immport * as searchView from '.views/searchView'
  //console.log(`Using the imported functions ${searchView.add(ID, 2)} and ${searchView.multiply(3, 5)}. ${str}`);


//Way 2: import { add, multiply, ID } from './views/searchView';
  //console.log(`Using the imported functions ${add(ID, 2)} and ${multiply(3, 5)}. ${str}`);


//Way 3: import { add as a, multiply as m, ID } from './views/searchView';
  // console.log(`Using the imported functions ${a(ID, 2)} and ${m(3, 5)}. ${str}`);
