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
	modalDisclaimer: [$("#modalSelector"), $("#modal-backdrop"), $("#modal-window"), $("#btn-modal")],

	modal404: [$("#modal404Selector"), $("#modal404-backdrop"), $("#modal404-window"), $("#btn404-modal")],
};


const activities = ["Running", "rope", "cycling", "climbing"];
const apiNutritionURL = "https://api.api-ninjas.com/v1/nutrition?query=";
// const apiActivityURL = 'https://api.api-ninjas.com/v1/caloriesburned?activity='; url api to check activities list
const apiExerciseURL = "https://api.api-ninjas.com/v1/caloriesburned?activity=";
const apiKey = "UV6648NeZT4RY5GoyCFnDSijoyoNqcMMuF33K3fD";

function updateMainCard(data) {
    if (data && data.length > 0) {
        const foodInfo = data[0];
        htmlSelectors.mainCard[0].text(foodInfo.item);
        htmlSelectors.mainCard[1].text(foodInfo.calories + " kcal");
        htmlSelectors.mainCard[2].text(foodInfo.serving_size);
		htmlSelectors.mainCard[3].text(foodInfo.carbs + " g"); 
        htmlSelectors.mainCard[4].text(foodInfo.protein + " g"); 
        htmlSelectors.mainCard[5].text(foodInfo.fat + " g"); 
        htmlSelectors.mainCard[6].text(foodInfo.fiber + " g");
	}
	}

	function updateActivityCards(activitiesData, foodCalories) {
		// For simplicity, let's assume each activity's calorie burn rate 
		// is provided in calories per minute.
		activitiesData.forEach((activityData, index) => {
			const burnRatePerMinute = activityData.caloriesBurnedPerMinute; // adjust based on data's structure
			const minutesRequired = foodCalories / burnRatePerMinute;
	
			const activitySelectors = htmlSelectors[`activity${index + 1}`];
	
			activitySelectors[0].text(activityData.activityName); 
			activitySelectors[1].text(burnRatePerMinute + " kcal/min"); 
			activitySelectors[2].text(minutesRequired.toFixed(2) + " mins"); 
			// ... Field for Adjusments as necessary for data and DOM structure
		});
	}
	
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
			if (NutritionalFactsData.length === 0) {
				modalAnimation("modal404");
			} else {
				modalAnimation("modalDisclaimer");
				updateMainCard(NutritionalFactsData);  
			}
			fetch("https://api.api-ninjas.com/v1/caloriesburned?activity=" + activities[0], {
				method: "GET",
				headers: { "X-Api-Key": apiKey },
				contentType: "application/json",
			})
				.then((response) => response.json())
				.then((activitiesData) => {
					//----------------------------- function to update activities card and local storage save-----------------------------------------------------------

					console.log(activitiesData);
					updateActivityCards(activitiesData, NutritionalFactsData[0].calories);
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

let modalAnimation = (objKey) => {
	htmlSelectors[objKey][0].removeClass("hidden");
	htmlSelectors[objKey][1].removeClass("opacity-0");
	htmlSelectors[objKey][1].addClass("opacity-100");
	htmlSelectors[objKey][2].removeClass("opacity-0 translate-y-4 sm:translate-y-0");
	htmlSelectors[objKey][2].addClass("opacity-100 translate-y-0 sm:scale-100");
	htmlSelectors[objKey][3].click(function (event) {
		event.preventDefault();
		htmlSelectors[objKey][0].addClass("hidden");
	});
}