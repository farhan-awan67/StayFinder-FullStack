let menu = document.getElementById("menu");
let close = document.getElementById("close");
let nav = document.getElementById("nav");

menu.addEventListener("click", () => {
  menu.style.display = "none";
  close.style.display = "block";
  nav.style.left = "0";
});

close.addEventListener("click", () => {
  menu.style.display = "block";
  close.style.display = "none";
  nav.style.left = "-60%";
});

async function performSearch(event) {
  event.preventDefault(); // Prevent the default form submission

  const query = document.getElementById("search-input").value.trim();
  console.log(query);
  // const response = await fetch(
  //   `/api/listings?search=${encodeURIComponent(query)}`
  // );
  // const results = await response.json();
  if (!query) {
    console.log("Search query is empty."); // Handle empty input
    return;
  }

  const response = await fetch(`/listings?search=${encodeURIComponent(query)}`);
  // console.log(response);
  const text = await response.text(); // Get response as text

  console.log(text); // Log the raw HTML response

  if (!response.ok) {
    console.error("Error fetching results:", response.statusText);
    return;
  }

  // const results = await response.json();
  const results = JSON.parse(text); // Try parsing if it seems like valid JSON
  console.log("Search Results:", results); // Log the results

  displayResults(results);
}

function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  results.forEach((item) => {
    const listingDiv = document.createElement("div");
    listingDiv.className = "listing"; // Add a class for styling (optional)

    // Create elements for the title, image, description, and price
    const title = document.createElement("h3");
    title.textContent = item.title;

    const image = document.createElement("img");
    image.src = item.image.url; // Use the image URL
    image.alt = item.title; // Alt text for the image

    const description = document.createElement("p");
    description.textContent = item.description;

    const price = document.createElement("p");
    price.textContent = `Price: $${item.price}`; // Display price

    // Append the elements to the listingDiv
    listingDiv.appendChild(image);
    listingDiv.appendChild(title);
    listingDiv.appendChild(description);
    listingDiv.appendChild(price);

    // Append the listingDiv to the resultsContainer
    resultsContainer.appendChild(listingDiv);
  });
}

// function displayResults(results) {
//   const resultsContainer = document.getElementById("results");
//   resultsContainer.innerHTML = "";

//   results.forEach((item) => {
//     const listingDiv = document.createElement("div");
//     listingDiv.textContent = `${item.name} - ${item.description}`;
//     resultsContainer.appendChild(listingDiv);
//   });
// }
