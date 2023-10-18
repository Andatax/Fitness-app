// Selectors from the DOM, to access a DOM element you have to write 'htmlSelectors.{section of the DOM}[index that matches the DOM element]'.
// For example:
// To access the section in the DOM to change the calories you burn doing that activity moderate you need to write: htmlSelectors.activity1[3]
const htmlSelectors = {
	search: [$("#search-input"), $("#search-btn")],
	mainCard: [
		$("#food-title"),
		$("#cardMainCalories"),
		$("#cardMainServingSize"),
		$("#cardMainCarbs"),
		$("#cardMainProtein"),
		$("#cardMainFat"),
		$("#cardMainFiber"),
	],
	activity1: [
		$("#activity1-title"),
		$("#card1CalHourSlow"),
		$("#card1minsSlow"),
		$("#card1CalHourModerate"),
		$("#card1minsModerate"),
	],
	activity2: [
		$("#activity2-title"),
		$("#card2CalHourSlow"),
		$("#card2minsSlow"),
		$("#card2CalHourModerate"),
		$("#card2minsModerate"),
	],
	activity3: [
		$("#activity3-title"),
		$("#card3CalHourSlow"),
		$("#card3minsSlow"),
		$("#card3CalHourModerate"),
		$("#card3minsModerate"),
	],
	activity4: [
		$("#activity4-title"),
		$("#card4CalHourSlow"),
		$("#card4minsSlow"),
		$("#card4CalHourModerate"),
		$("#card4minsModerate"),
	],
	modal: [$("#modalSelector"), $("#modal-backdrop"), $("#modal-window"), $("#btn-modal")],
};

const activities = ["Running", "rope", "cycling", "climbing"];
const apiNutritionURL = "https://api.api-ninjas.com/v1/nutrition?query=";
// const apiActivityURL = 'https://api.api-ninjas.com/v1/caloriesburned?activity='; url api to check activities list
const apiExerciseURL = "https://api.api-ninjas.com/v1/caloriesburned?activity=";
const apiKey = "UV6648NeZT4RY5GoyCFnDSijoyoNqcMMuF33K3fD";
htmlSelectors.search[1].click(function (event) {
	event.preventDefault();
	let searchInput = htmlSelectors.search[0].val();
	console.log(searchInput);

	fetch("https://api.api-ninjas.com/v1/nutrition?query=" + searchInput, {
		method: "GET",
		headers: { "X-Api-Key": apiKey },
		contentType: "application/json",
	})
		.then((response) => response.json())
		.then((NutritionalFactsData) => {
			//----------------------------- Main card function update and local storage save-----------------------------------------------------------
			console.log(NutritionalFactsData);
			fetch("https://api.api-ninjas.com/v1/caloriesburned?activity=" + activities[0], {
				method: "GET",
				headers: { "X-Api-Key": apiKey },
				contentType: "application/json",
			})
				.then((response) => response.json())
				.then((activitiesData) => {
					//----------------------------- function to update activities card and local storage save-----------------------------------------------------------
					console.log(activitiesData);
				})
				.catch((error) => {
					console.error("Error: ", error);
				});
		})
		//hola, esta es una prueba de pull request.
		.catch((error) => {
			console.error("Error: ", error);
		});
});
