console.log("Netflix Clone Loaded!");

const API_BASE_URL = 'http://localhost:3000/api';

const handleResponse = async (response) => {
  if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType.includes('application/json')) {
          return await response.json();
      } else if (contentType.includes('application/xml')) {
          return await response.text();
      }
  }
  throw new Error(`HTTP Error: ${response.status}`);
};

const fetchAccounts = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/accounts`);
      return await response.json();
  } catch (error) {
      console.error('Error fetching accounts:', error.message);
  }
};

const fetchAccountById = async (userId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/accounts/${userId}`);
      return await response.json();
  } catch (error) {
      console.error('Error fetching account by ID:', error.message);
  }
};

const createAccount = async (email, password) => {
  try {
      const response = await fetch(`${API_BASE_URL}/accounts/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
      return await response.json();
  } catch (error) {
      console.error('Error creating account:', error.message);
  }
};

const updateAccount = async (userId, updates) => {
  try {
      const response = await fetch(`${API_BASE_URL}/accounts/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates), 
      });
      return await response.json();
  } catch (error) {
      console.error('Error updating account:', error.message);
  }
};

const deleteAccount = async (userId) => {
  try {
      await fetch(`${API_BASE_URL}/accounts/${userId}`, { method: 'DELETE' });
  } catch (error) {
      console.error('Error deleting account:', error.message);
  }
};

const fetchContentWarnings = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/contentWarnings`);
      return await response.json();
  } catch (error) {
      console.error('Error fetching content warnings:', error.message);
  }
};

const fetchContentWarningById = async (contentWarningId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/contentWarnings/${contentWarningId}`);
      return await response.json();
  } catch (error) {
      console.error('Error fetching content warning by ID:', error.message);
  }
};

const createContentWarning = async (name, description) => {
  try {
      const response = await fetch(`${API_BASE_URL}/contentWarnings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description }),
      });
      return await response.json();
  } catch (error) {
      console.error('Error creating content warning:', error.message);
  }
};

const deleteContentWarning = async (contentWarningId) => {
  try {
      await fetch(`${API_BASE_URL}/contentWarnings/${contentWarningId}`, { method: 'DELETE' });
  } catch (error) {
      console.error('Error deleting content warning:', error.message);
  }
};

const fetchContent = async (type) => {
  try {
      const response = await fetch(`${API_BASE_URL}/content/${type}`);
      const contentList = await handleResponse(response);

      const container = document.querySelector(
          type === 'film' ? ".moviesContainer" : ".seriesContainer"
      );
      container.innerHTML = "";
      contentList.forEach(content => {
          const contentElement = document.createElement("div");
          contentElement.classList.add("contentElement");
          contentElement.innerHTML = `
              <img src="${content.imageUrl || 'default.jpg'}" alt="${content.title}">
              <p>${content.title}</p>
              <p>${content.description}</p>
              <div class="actionButtons">
                  <button class="update" data-id="${content.id}" data-type="${type}">Update</button>
                  <button class="delete" data-id="${content.id}" data-type="${type}">Delete</button>
              </div>
          `;
          container.appendChild(contentElement);
      });
  } catch (error) {
      console.error(`Error fetching ${type}:`, error);
  }
};

exports.getContentById = async (req, res) => {
  const { type, id } = req.params;

  if (type !== 'film' && type !== 'series') {
      return sendJSONResponse(res, 400, { error: 'Invalid content type. Use "film" or "series".' });
  }

  const table = type === 'film' ? 'Film' : 'Series';

  try {
      const [content] = await db.execute(`SELECT * FROM ${table} WHERE ${table}ID = ?`, [id]);
      if (content.length === 0) {
          return sendJSONResponse(res, 404, { error: `${type.charAt(0).toUpperCase() + type.slice(1)} not found.` });
      }

      if (req.accepts('xml')) {
          return sendXMLResponse(res, 200, content[0]);
      }
      sendJSONResponse(res, 200, content[0]);
  } catch (error) {
      sendJSONResponse(res, 500, { error: `Error fetching ${type}.`, details: error.message });
  }
};

const addContent = async (type, contentData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/content/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contentData),
      });
      const content = await handleResponse(response);
      fetchContent(type); 
  } catch (error) {
      console.error(`Error adding ${type}:`, error);
  }
};

const updateContent = async (type, contentId, updatedData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/content/${type}/${contentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
      });
      const content = await handleResponse(response);
      fetchContent(type); 
  } catch (error) {
      console.error(`Error updating ${type}:`, error);
  }
};

const deleteContent = async (type, contentId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/content/${type}/${contentId}`, {
          method: 'DELETE',
      });
      const result = await handleResponse(response);
      fetchContent(type); 
  } catch (error) {
      console.error(`Error deleting ${type}:`, error);
  }
};

document.querySelector("#addMovie").addEventListener("click", () => {
  const newMovieData = {
      title: "New Movie",
      description: "A great movie",
      subtitles: "English",
      minimumAge: 13,
  };
  addContent("film", newMovieData);
});

document.querySelector("#addSeries").addEventListener("click", () => {
  const newSeriesData = {
      title: "New Series",
      description: "An amazing series",
      subtitles: "English",
      minimumAge: 16,
  };
  addContent("series", newSeriesData);
});

document.querySelector(".moviesContainer").addEventListener("click", (event) => {
  const contentId = event.target.dataset.id;
  const type = event.target.dataset.type;
  if (event.target.classList.contains("update")) {
      const updatedData = {
          title: "Updated Movie Title",
          description: "Updated movie description",
          subtitles: "Spanish",
          minimumAge: 15,
      };
      updateContent(type, contentId, updatedData);
  } else if (event.target.classList.contains("delete")) {
      deleteContent(type, contentId);
  }
});

document.querySelector(".seriesContainer").addEventListener("click", (event) => {
  const contentId = event.target.dataset.id;
  const type = event.target.dataset.type;
  if (event.target.classList.contains("update")) {
      const updatedData = {
          title: "Updated Series Title",
          description: "Updated series description",
          subtitles: "French",
          minimumAge: 18,
      };
      updateContent(type, contentId, updatedData);
  } else if (event.target.classList.contains("delete")) {
      deleteContent(type, contentId);
  }
});

fetchContent("film");
fetchContent("series");


async function fetchAllGenres() {
  try {
      const response = await fetch(`${API_BASE_URL}/genres`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json, application/xml'  
          }
      });

      const data = await handleResponse(response);
      console.log('Genres:', data);
      return data;
  } catch (error) {
      console.error('Error fetching genres:', error);
  }
}

async function fetchGenreById(id) {
  try {
      const response = await fetch(`${API_BASE_URL}/genres/${id}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json, application/xml'  
          }
      });

      const data = await handleResponse(response);
      console.log('Genre:', data);
      return data;
  } catch (error) {
      console.error('Error fetching genre by ID:', error);
  }
}

async function createGenre(name) {
  try {
      const response = await fetch(`${API_BASE_URL}/genres`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ name })
      });

      const data = await handleResponse(response);
      console.log('Genre created:', data);
      return data;
  } catch (error) {
      console.error('Error creating genre:', error);
  }
}

async function updateGenre(id, name) {
  try {
      const response = await fetch(`${API_BASE_URL}/genres/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ name })
      });

      const data = await handleResponse(response);
      console.log('Genre updated:', data);
      return data;
  } catch (error) {
      console.error('Error updating genre:', error);
  }
}

async function deleteGenre(id) {
  try {
      const response = await fetch(`${API_BASE_URL}/genres/${id}`, {
          method: 'DELETE',
          headers: {
              'Accept': 'application/json, application/xml'  
          }
      });

      const data = await handleResponse(response);
      console.log('Genre deleted:', data);
      return data;
  } catch (error) {
      console.error('Error deleting genre:', error);
  }
}

const fetchHistory = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const historyItems = await handleResponse(response);

      const historyContainer = document.querySelector(".historyContainer");
      historyContainer.innerHTML = "";
      historyItems.forEach(item => {
          const historyElement = document.createElement("div");
          historyElement.classList.add("historyElement");
          historyElement.innerHTML = `
              <img src="${item.imageUrl}" alt="${item.title}">
              <p>${item.title}</p>
              <div class="actionButtons">
                  <button class="update" data-id="${item.id}">Update</button>
                  <button class="delete" data-id="${item.id}">Delete</button>
              </div>
          `;
          historyContainer.appendChild(historyElement);
      });
  } catch (error) {
      console.error("Error fetching history:", error);
  }
};

fetchHistory();

async function login(email, password) {
  try {
      const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ email, password })
      });

      const data = await handleResponse(response);
      console.log('Login response:', data);
      return data;
  } catch (error) {
      console.error('Error during login:', error);
  }
}

async function register(email, password) {
  try {
      const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ email, password })
      });

      const data = await handleResponse(response);
      console.log('Registration response:', data);
      return data;
  } catch (error) {
      console.error('Error during registration:', error);
  }
}

async function verifyAccount(userId) {
  try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml' 
          },
          body: JSON.stringify({ userId })
      });

      const data = await handleResponse(response);
      console.log('Account verification response:', data);
      return data;
  } catch (error) {
      console.error('Error during account verification:', error);
  }
}

async function fetchAllProfiles() {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json, application/xml'  
          }
      });

      const data = await handleResponse(response);
      console.log('All profiles:', data);
      return data;
  } catch (error) {
      console.error('Error fetching profiles:', error);
  }
}

const fetchProfiles = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles`);
      const profiles = await handleResponse(response);

      const profileContainer = document.querySelector(".profileContainer");
      profileContainer.innerHTML = "";
      profiles.forEach(profile => {
          const profileElement = document.createElement("div");
          profileElement.classList.add("profile");
          profileElement.innerHTML = `
              <img src="${profile.imageUrl}" alt="${profile.name}">
              <p>${profile.name}</p>
              <div class="actionButtons">
                  <button class="update" data-id="${profile.id}">Update</button>
                  <button class="delete" data-id="${profile.id}">Delete</button>
              </div>
          `;
          profileContainer.appendChild(profileElement);
      });
  } catch (error) {
      console.error("Error fetching profiles:", error);
  }
};

const addProfile = async (profileData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
      });
      const profile = await handleResponse(response);
      fetchProfiles(); 
  } catch (error) {
      console.error("Error adding profile:", error);
  }
};

const updateProfile = async (profileId, updatedData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
      });
      const profile = await handleResponse(response);
      fetchProfiles(); 
  } catch (error) {
      console.error("Error updating profile:", error);
  }
};

const deleteProfile = async (profileId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
          method: 'DELETE',
      });
      const result = await handleResponse(response);
      fetchProfiles(); 
  } catch (error) {
      console.error("Error deleting profile:", error);
  }
};


async function getProfileById(profileId) {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json, application/xml' 
          }
      });

      const data = await handleResponse(response);
      console.log('Profile by ID:', data);
      return data;
  } catch (error) {
      console.error('Error fetching profile by ID:', error);
  }
}


document.querySelector("#addProfile").addEventListener("click", () => {
  const newProfileData = { name: "New Profile", imageUrl: "new_profile.jpg" }; 
  addProfile(newProfileData);
});

document.querySelector(".profileContainer").addEventListener("click", (event) => {
  const profileId = event.target.dataset.id;
  if (event.target.classList.contains("update")) {
      const updatedData = { name: "Updated Profile", imageUrl: "updated_profile.jpg" }; 
      updateProfile(profileId, updatedData);
  } else if (event.target.classList.contains("delete")) {
      deleteProfile(profileId);
  }
});

fetchProfiles();

const fetchRecommended = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/recommendations`);
      const recommendations = await handleResponse(response);

      const container = document.querySelector(".recommendedContainer");
      container.innerHTML = "";
      recommendations.forEach(recommendation => {
          const recommendationElement = document.createElement("div");
          recommendationElement.classList.add("recommendedElement");
          recommendationElement.innerHTML = `
              <img src="${recommendation.imageUrl}" alt="${recommendation.title}">
              <p>${recommendation.title}</p>
          `;
          container.appendChild(recommendationElement);
      });
  } catch (error) {
      console.error("Error fetching recommendations:", error);
  }
};

async function createRecommendation(profileId, mediaType, mediaId) {
  try {
      const response = await fetch(`${API_BASE_URL}/recommendations`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ profileId, mediaType, mediaId })
      });

      const data = await handleResponse(response);
      console.log('Recommendation creation response:', data);
      return data;
  } catch (error) {
      console.error('Error creating recommendation:', error);
  }
}

async function updateRecommendation(recommendationId, mediaType, mediaId) {
  try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ mediaType, mediaId })
      });

      const data = await handleResponse(response);
      console.log('Recommendation update response:', data);
      return data;
  } catch (error) {
      console.error('Error updating recommendation:', error);
  }
}

async function deleteRecommendation(recommendationId) {
  try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${recommendationId}`, {
          method: 'DELETE',
          headers: {
              'Accept': 'application/json, application/xml'
          }
      });

      const data = await handleResponse(response);
      console.log('Recommendation deletion response:', data);
      return data;
  } catch (error) {
      console.error('Error deleting recommendation:', error);
  }
}

fetchRecommended();

const fetchSubscriptions = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`);
      const subscriptions = await handleResponse(response);

      const container = document.querySelector("#subscriptions ul");
      container.innerHTML = "";
      subscriptions.forEach(subscription => {
          const subscriptionElement = document.createElement("li");
          subscriptionElement.innerHTML = `
              ${subscription.plan} : €${subscription.price}/month
              <div class="actionButtons">
                  <button class="update" data-id="${subscription.id}">Update</button>
                  <button class="delete" data-id="${subscription.id}">Delete</button>
              </div>
          `;
          container.appendChild(subscriptionElement);
      });
  } catch (error) {
      console.error("Error fetching subscriptions:", error);
  }
};


const addSubscription = async (subscriptionData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/subscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscriptionData),
      });
      const subscription = await handleResponse(response);
      fetchSubscriptions(); 
  } catch (error) {
      console.error("Error adding subscription:", error);
  }
};

const updateSubscription = async (subscriptionId, updatedData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
      });
      const subscription = await handleResponse(response);
      fetchSubscriptions(); 
  } catch (error) {
      console.error("Error updating subscription:", error);
  }
};

const deleteSubscription = async (subscriptionId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
          method: 'DELETE',
      });
      const result = await handleResponse(response);
      fetchSubscriptions(); 
  } catch (error) {
      console.error("Error deleting subscription:", error);
  }
};

document.querySelector("#addSubscription").addEventListener("click", () => {
  const newSubscriptionData = { plan: "Premium", price: 19.99 }; 
  addSubscription(newSubscriptionData);
});

document.querySelector("#subscriptions ul").addEventListener("click", (event) => {
  const subscriptionId = event.target.dataset.id;
  if (event.target.classList.contains("update")) {
      const updatedData = { plan: "Updated Premium", price: 24.99 }; 
      updateSubscription(subscriptionId, updatedData);
  } else if (event.target.classList.contains("delete")) {
      deleteSubscription(subscriptionId);
  }
});

fetchSubscriptions();

const fetchMoviesWatching = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingFilm`);
      const movies = await handleResponse(response);

      const container = document.querySelector(".moviesWatchingContainer");
      container.innerHTML = "";
      movies.forEach(movie => {
          const movieElement = document.createElement("div");
          movieElement.classList.add("moviesWatchingElement");
          movieElement.innerHTML = `
              <img src="${movie.imageUrl}" alt="${movie.title}">
              <p>${movie.title}</p>
              <div class="actionButtons">
                  <button class="update" data-id="${movie.id}">Update</button>
                  <button class="delete" data-id="${movie.id}">Delete</button>
              </div>
          `;
          container.appendChild(movieElement);
      });
  } catch (error) {
      console.error("Error fetching movies watching:", error);
  }
};

const addMovieWatching = async (movieData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingFilm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movieData),
      });
      const movie = await handleResponse(response);
      fetchMoviesWatching(); 
  } catch (error) {
      console.error("Error adding movie to watching:", error);
  }
};

const updateMovieWatching = async (movieId, updatedData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingFilm/${movieId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
      });
      const movie = await handleResponse(response);
      fetchMoviesWatching();
  } catch (error) {
      console.error("Error updating movie:", error);
  }
};

const deleteMovieWatching = async (movieId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingFilm/${movieId}`, {
          method: 'DELETE',
      });
      const result = await handleResponse(response);
      fetchMoviesWatching(); 
  } catch (error) {
      console.error("Error deleting movie:", error);
  }
};

document.querySelector("#addMoviesWatching").addEventListener("click", () => {
  const newMovieData = { title: "New Movie", imageUrl: "new_movie.jpg" }; 
  addMovieWatching(newMovieData);
});

document.querySelector(".moviesWatchingContainer").addEventListener("click", (event) => {
  const movieId = event.target.dataset.id;
  if (event.target.classList.contains("update")) {
      const updatedData = { title: "Updated Movie", imageUrl: "updated_movie.jpg" };
      updateMovieWatching(movieId, updatedData);
  } else if (event.target.classList.contains("delete")) {
      deleteMovieWatching(movieId);
  }
});

fetchMoviesWatching();

const fetchWatchingSeries = async () => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingSeries`);
      const series = await handleResponse(response);

      const container = document.querySelector(".watchingSeriesContainer");
      container.innerHTML = "";
      series.forEach(seriesItem => {
          const seriesElement = document.createElement("div");
          seriesElement.classList.add("watchingSeriesElement");
          seriesElement.innerHTML = `
              <img src="${seriesItem.imageUrl}" alt="${seriesItem.title}">
              <p>${seriesItem.title}</p>
              <div class="actionButtons">
                  <button class="update" data-id="${seriesItem.id}">Update</button>
                  <button class="delete" data-id="${seriesItem.id}">Delete</button>
              </div>
          `;
          container.appendChild(seriesElement);
      });
  } catch (error) {
      console.error("Error fetching watching series:", error);
  }
};

const addWatchingSeries = async (seriesData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingSeries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seriesData),
      });
      const series = await handleResponse(response);
      fetchWatchingSeries(); 
  } catch (error) {
      console.error("Error adding watching series:", error);
  }
};

const updateWatchingSeries = async (seriesId, updatedData) => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingSeries/${seriesId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
      });
      const series = await handleResponse(response);
      fetchWatchingSeries(); 
  } catch (error) {
      console.error("Error updating watching series:", error);
  }
};

const deleteWatchingSeries = async (seriesId) => {
  try {
      const response = await fetch(`${API_BASE_URL}/watchingSeries/${seriesId}`, {
          method: 'DELETE',
      });
      const result = await handleResponse(response);
      fetchWatchingSeries(); 
  } catch (error) {
      console.error("Error deleting watching series:", error);
  }
};

document.querySelector("#addWatchingSeries").addEventListener("click", () => {
  const newSeriesData = { title: "New Series", imageUrl: "new_series.jpg" }; 
  addWatchingSeries(newSeriesData);
});

document.querySelector(".watchingSeriesContainer").addEventListener("click", (event) => {
  const seriesId = event.target.dataset.id;
  if (event.target.classList.contains("update")) {
      const updatedData = { title: "Updated Series", imageUrl: "updated_series.jpg" }; 
      updateWatchingSeries(seriesId, updatedData);
  } else if (event.target.classList.contains("delete")) {
      deleteWatchingSeries(seriesId);
  }
});

fetchWatchingSeries();
