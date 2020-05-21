const cocktailApp = {};

cocktailApp.apiRandomUrl = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;

// Random function 
cocktailApp.randomize = (array) => array[Math.floor(Math.random() * array.length)];

// ajax call to grab random cocktails (the API had their own call for generating random cocktails) 
cocktailApp.getRandomCocktail = function () {
    $.ajax({
        url: cocktailApp.apiRandomUrl,
        method: `GET`,
        dataType: `json`,
    }).then(function (results) {
        cocktailApp.displayCocktail(results.drinks[0]);
    });
};

// ajax for alchohol by user choice (aka "choiceCocktail") 
cocktailApp.choiceCocktail = function (boozeName) {
    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${boozeName}`,
        method: `GET`,
        dataType: `json`,
    }).then(function (results) {
        const randomFromResults = cocktailApp.randomize(results.drinks)
        cocktailApp.findInstructions(randomFromResults.idDrink)
    })
};

// ajax call to grab ingredients & instructiosn by drink ID (which is pulled from choiceCocktail), and then pushed to displayCocktail
cocktailApp.findInstructions = function (drinkId) {
    $.ajax({
        url: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`,
        method: `GET`,
        dataType: `json`,
    }).then(function (results) {
        cocktailApp.displayCocktail(results.drinks[0])
    })
};

// display Random cocktail
cocktailApp.displayCocktail = function (data) {
    $(`.displayCocktail`).empty();
    const displayCocktailInfo = `
        <div class="cocktailName"><p>${data.strDrink}</p></div>
        <div class="ingredientsAndInstructions">
            <div class="ingredients">
                <p>Ingredients:</p>
                <ul class="ingredientList">
                </ul>
            </div>
            <div class="instructions">
                <p>${data.strInstructions}</p>
            </div>
        </div>
        `;

    $(`.displayCocktail`).append(displayCocktailInfo);

    // The ingredients are not in their own object or array, so I grabbed them individually and put them in my own object to parse through them. 15 seemed to be where the API maxed out. 
    const ingredientList = [data.strIngredient1, data.strIngredient2, data.strIngredient3, data.strIngredient4, data.strIngredient5, data.strIngredient6, data.strIngredient7, data.strIngredient8, data.strIngredient8, data.strIngredient9, data.strIngredient10, data.strIngredient11, data.strIngredient12, data.strIngredient13, data.strIngredient14, data.strIngredient15]

    // Go through each ingredient and display them until a null value is reached.
    ingredientList.forEach((item) => {
        if (item != null) {
            $(`.ingredientList`).append(`<li>${item}</li>`)
        }
    })
}

// Init
cocktailApp.init = function () {
    $(`#random`).on(`click`, function () {
        cocktailApp.getRandomCocktail();
    })

    $(`.boozeList li`).on(`click`, function () {
        cocktailApp.choiceCocktail(this.id)
    })

    $(`.choice`).on(`click`, function () {
        console.log(this)
        $(`.choice`).removeClass(`blue`);
        $(this).addClass(`blue`);
        $(`.displayCocktail`).addClass(`stylings`)
    });

    $(`.headerInfo`).on(`click`, function() {
        setTimeout(function () { 
            $(`header`).addClass(`hide`)
            $(`footer`).removeClass(`hide`)
        }, 800);
        $(`main`).removeClass(`hide`)
    })
}

// Document Ready
$(document).ready(function(){
    cocktailApp.init();
});