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

const activities = ["walking", "rope", "cycling", "climbing"];
const apiNutritionURL = "https://api.api-ninjas.com/v1/nutrition?query=";
// const apiActivityURL = 'https://api.api-ninjas.com/v1/caloriesburned?activity='; url api to check activities list
const apiExerciseURL = "https://api.api-ninjas.com/v1/caloriesburned?activity=";
const apiKey = "UV6648NeZT4RY5GoyCFnDSijoyoNqcMMuF33K3fD";

function updateMainCard(data) {
	if (data && data.length > 0) {
		const foodInfo = data[0];
		htmlSelectors.mainCard[0].text(foodInfo.name.toUpperCase());
		htmlSelectors.mainCard[1].text(foodInfo.calories + " kcal");
		htmlSelectors.mainCard[2].text(`Serving size: ${foodInfo.serving_size_g} g`);
		htmlSelectors.mainCard[3].text(`Carbohydrates: ${foodInfo.carbohydrates_total_g} g`);
		htmlSelectors.mainCard[4].text(`Protein: ${foodInfo.protein_g} g`);
		htmlSelectors.mainCard[5].text(`TotalFat: ${foodInfo.fat_total_g}g`);
		htmlSelectors.mainCard[6].text(`Fiber: ${foodInfo.fiber_g}g`);

		  // Convert data to JSON string
		  const dataString = JSON.stringify(data);
       
		  // Store dataString in local storage
		  localStorage.setItem('mainCardData', dataString);
	}
}

// Retrieve stored data from local storage on page load
document.addEventListener('DOMContentLoaded', function() {
    const storedDataString = localStorage.getItem('mainCardData');
   
    if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        updateMainCard(storedData);
    }
});


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
			console.log(NutritionalFactsData);

			//----------------------------- Main card function update and local storage save-----------------------------------------------------------
			if (NutritionalFactsData.length === 0) {
				modalAnimation("modal404");
			} else {
				modalAnimation("modalDisclaimer");
				updateMainCard(NutritionalFactsData);
			}

			// Iterate over the activities using a for loop
			for (let i = 0; i < activities.length; i++) {
				const activityName = activities[i];
				fetch("https://api.api-ninjas.com/v1/caloriesburned?activity=" + activityName, {
					method: "GET",
					headers: { "X-Api-Key": apiKey },
					contentType: "application/json",
				})
					.then((response) => response.json())
					.then((activitiesData) => {
						//----------------------------- function to update activities card and local storage save-----------------------------------------------------------
						console.log(activityName); // Use activityName instead of 'activity'
						const activityFunction = [functionCard1, functionCard2, functionCard3, functionCard4];
						console.log(activitiesData);
						const functionSelector = activityFunction[i];
						functionSelector(activitiesData, NutritionalFactsData);
					})
					.catch((error) => {
						console.error("Error: ", error);
					});
			}
		})
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
};

let functionCard1 = (activitiesData, data) => {
	const kal = data[0].calories;
	console.log(kal);
	const burnRatePerMinuteSlow = activitiesData[2].calories_per_hour / 60;
	const burnRatePerMinuteModerate = activitiesData[1].calories_per_hour / 60;

	const minutesRequiredSlow = Math.ceil(kal / burnRatePerMinuteSlow);
	const minutesRequiredModerate = Math.ceil(kal / burnRatePerMinuteModerate);
	htmlSelectors.activity1[0].text("Walking");
	htmlSelectors.activity1[1].text(`Slow pace: ${activitiesData[3].calories_per_hour} kcal/hr`);
	htmlSelectors.activity1[2].text(minutesRequiredSlow + " mins");
	htmlSelectors.activity1[3].text(`Fast pace: ${activitiesData[4].calories_per_hour} kcal/hr`);
	htmlSelectors.activity1[4].text(minutesRequiredModerate + " mins");

	const activity1Data = [
        "Walking",
        `Slow pace: ${activitiesData[3].calories_per_hour} kcal/hr`,
        minutesRequiredSlow + " mins",
        `Fast pace: ${activitiesData[4].calories_per_hour} kcal/hr`,
        minutesRequiredModerate + " mins"
    ];

    // Convert the array to JSON string
    const activity1DataString = JSON.stringify(activity1Data);

    // Store the array in local storage
    localStorage.setItem("activity1Data", activity1DataString);
	
};

window.addEventListener('DOMContentLoaded', function() {
	// Retrieve the data from local storage
	const activity1DataString = localStorage.getItem('activity1Data');
	const activity1Data = JSON.parse(activity1DataString);
  
	// Check if the data exists
	if (activity1Data) {
	// Update the HTML elements with the retrieved data
	  htmlSelectors.activity1[0].text(activity1Data[0]);
	  htmlSelectors.activity1[1].text(activity1Data[1]);
	  htmlSelectors.activity1[2].text(activity1Data[2]);
	  htmlSelectors.activity1[3].text(activity1Data[3]);
	  htmlSelectors.activity1[4].text(activity1Data[4]);
	}
  });


let functionCard2 = (activitiesData, data) => {
	const kal = data[0].calories;
	console.log(kal);
	const burnRatePerMinuteSlow = activitiesData[2].calories_per_hour / 60;
	const burnRatePerMinuteModerate = activitiesData[1].calories_per_hour / 60;

	const minutesRequiredSlow = Math.ceil(kal / burnRatePerMinuteSlow);
	const minutesRequiredModerate = Math.ceil(kal / burnRatePerMinuteModerate);
	htmlSelectors.activity2[0].text("Jumping Rope");
	htmlSelectors.activity2[1].text(`Slow: ${activitiesData[2].calories_per_hour} kcal/hr`);
	htmlSelectors.activity2[2].text(minutesRequiredSlow + " mins");
	htmlSelectors.activity2[3].text(`Fast: ${activitiesData[1].calories_per_hour} kcal/hr`);
	htmlSelectors.activity2[4].text(minutesRequiredModerate + " mins");
};

let functionCard3 = (activitiesData, data) => {
	const kal = data[0].calories;
	console.log(kal);
	const burnRatePerMinuteSlow = activitiesData[2].calories_per_hour / 60;
	const burnRatePerMinuteModerate = activitiesData[1].calories_per_hour / 60;

	const minutesRequiredSlow = Math.ceil(kal / burnRatePerMinuteSlow);
	const minutesRequiredModerate = Math.ceil(kal / burnRatePerMinuteModerate);
	htmlSelectors.activity3[0].text("Cycling");
	htmlSelectors.activity3[1].text(`Slow: ${activitiesData[4].calories_per_hour} kcal/hr`);
	htmlSelectors.activity3[2].text(minutesRequiredSlow + " mins");
	htmlSelectors.activity3[3].text(`Fast: ${activitiesData[3].calories_per_hour} kcal/hr`);
	htmlSelectors.activity3[4].text(minutesRequiredModerate + " mins");
};

let functionCard4 = (activitiesData, data) => {
	const kal = data[0].calories;
	console.log(kal);
	const burnRatePerMinuteSlow = activitiesData[2].calories_per_hour / 60;
	const burnRatePerMinuteModerate = activitiesData[1].calories_per_hour / 60;

	const minutesRequiredSlow = Math.ceil(kal / burnRatePerMinuteSlow);
	const minutesRequiredModerate = Math.ceil(kal / burnRatePerMinuteModerate);
	htmlSelectors.activity4[0].text("Rock Climbing");
	htmlSelectors.activity4[1].text(`Slow: ${activitiesData[1].calories_per_hour} kcal/hr`);
	htmlSelectors.activity4[2].text(minutesRequiredSlow + " mins");
	htmlSelectors.activity4[3].text(`Fast: ${activitiesData[0].calories_per_hour} kcal/hr`);
	htmlSelectors.activity4[4].text(minutesRequiredModerate + " mins");
};
