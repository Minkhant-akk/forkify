import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {async} from 'regenerator-runtime';


// const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function(){
  try {
    const id = window.location.hash.slice(1);

    //loading recipe
    if(!id) return;
    recipeView.renderSpinner();
    //0 update results view to mark selected search result

    resultsView.update(model.getSearchResultsPage());

    //1 updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //2 rendering recipe
    await model.loadRecipe(id);

    //3 Rendering recipe
    recipeView.render(model.state.recipe);



} catch (error) {
    recipeView.renderMessage();
    console.error(error);
  }
}


const controlSearchResults = async function(){

  try{
    resultsView.renderSpinner();

//get query
    const query = searchView.getQuery();
    if(!query) return;
//load search results
    await model.loadSearchResults(query);
  //  resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage())
//render results
paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
};

const controlPagination = function(goToPage) {

  resultsView.render(model.getSearchResultsPage(goToPage))
//render results
  paginationView.render(model.state.search);
}

const controlServings = function(newServings){
  //update the recipe servings
  model.updateServings(newServings);

  // update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);

}

const controlAddBookmark = function(){
  // add/remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

//update recipe view
  recipeView.update(model.state.recipe)
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
    bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
//show loading spinner
  addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`);


    //close form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC * 1000)

  }catch(err){
    console.error( err);
    addRecipeView._renderError(err.message);
  }

  //Upload the new
}

const init = function(){
    bookmarksView.addHandlerRender(controlBookmarks);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();

const clearBookmarks = function() {
  localStorage.clear('bookmarks');
}
//clearBookmarks();
// window.addEventListener('hashchange',controlRecipes);
// window.addEventListener('load',controlRecipes);
