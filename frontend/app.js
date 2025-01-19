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

exports.getAllContent = async (req, res) => {
  try {
      const [films] = await db.execute('SELECT * FROM Film');
      const [series] = await db.execute('SELECT * FROM Series');

      if (films.length === 0 && series.length === 0) {
          return sendJSONResponse(res, 404, { error: 'No content found.' });
      }

      const content = { films, series };

      if (req.accepts('xml')) {
          return sendXMLResponse(res, 200, content);
      }
      sendJSONResponse(res, 200, content);
  } catch (error) {
      sendJSONResponse(res, 500, { error: 'Error fetching content.', details: error.message });
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

exports.createContent = async (req, res) => {
  const { type } = req.params;
  const { title, description, subtitles, minimumAge } = req.body;

  if (!title || !description) {
      return sendJSONResponse(res, 400, { error: 'Title and description are required.' });
  }

  if (type !== 'film' && type !== 'series') {
      return sendJSONResponse(res, 400, { error: 'Invalid content type. Use "film" or "series".' });
  }

  const table = type === 'film' ? 'Film' : 'Series';

  try {
      const [result] = await db.execute(
          `INSERT INTO ${table} (Title, Description, Subtitles, MinimumAge) VALUES (?, ?, ?, ?)`,
          [title, description, subtitles, minimumAge]
      );

      const response = {
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully.`,
          id: result.insertId,
      };

      if (req.accepts('xml')) {
          return sendXMLResponse(res, 201, response);
      }
      sendJSONResponse(res, 201, response);
  } catch (error) {
      sendJSONResponse(res, 500, { error: `Error creating ${type}.`, details: error.message });
  }
};

exports.updateContent = async (req, res) => {
  const { type, id } = req.params;
  const { title, description, subtitles, minimumAge } = req.body;

  if (type !== 'film' && type !== 'series') {
      return sendJSONResponse(res, 400, { error: 'Invalid content type. Use "film" or "series".' });
  }

  const table = type === 'film' ? 'Film' : 'Series';

  try {
      const [result] = await db.execute(
          `UPDATE ${table} SET Title = ?, Description = ?, Subtitles = ?, MinimumAge = ? WHERE ${table}ID = ?`,
          [title, description, subtitles, minimumAge, id]
      );

      if (result.affectedRows === 0) {
          return sendJSONResponse(res, 404, { error: `${type.charAt(0).toUpperCase() + type.slice(1)} not found.` });
      }

      const response = { message: `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully.` };

      if (req.accepts('xml')) {
          return sendXMLResponse(res, 200, response);
      }
      sendJSONResponse(res, 200, response);
  } catch (error) {
      sendJSONResponse(res, 500, { error: `Error updating ${type}.`, details: error.message });
  }
};

exports.deleteContent = async (req, res) => {
  const { type, id } = req.params;

  if (type !== 'film' && type !== 'series') {
      return sendJSONResponse(res, 400, { error: 'Invalid content type. Use "film" or "series".' });
  }

  const table = type === 'film' ? 'Film' : 'Series';

  try {
      const [result] = await db.execute(`DELETE FROM ${table} WHERE ${table}ID = ?`, [id]);
      if (result.affectedRows === 0) {
          return sendJSONResponse(res, 404, { error: `${type.charAt(0).toUpperCase() + type.slice(1)} not found.` });
      }

      const response = { message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.` };

      if (req.accepts('xml')) {
          return sendXMLResponse(res, 200, response);
      }
      sendJSONResponse(res, 200, response);
  } catch (error) {
      sendJSONResponse(res, 500, { error: `Error deleting ${type}.`, details: error.message });
  }
};

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

async function fetchHistoryByProfile(profileId) {
  try {
      const response = await fetch(`${API_BASE_URL}/history/${profileId}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json, application/xml' 
          }
      });

      const data = await handleResponse(response);
      console.log('History:', data);
      return data;
  } catch (error) {
      console.error('Error fetching history by profile:', error);
  }
}

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

async function createProfile(userId, name, age, preferences) {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ userId, name, age, preferences })
      });

      const data = await handleResponse(response);
      console.log('Profile creation response:', data);
      return data;
  } catch (error) {
      console.error('Error creating profile:', error);
  }
}

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

async function updateProfile(profileId, name, age, preferences) {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, application/xml'  
          },
          body: JSON.stringify({ name, age, preferences })
      });

      const data = await handleResponse(response);
      console.log('Profile update response:', data);
      return data;
  } catch (error) {
      console.error('Error updating profile:', error);
  }
}

async function deleteProfile(profileId) {
  try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
          method: 'DELETE',
          headers: {
              'Accept': 'application/json, application/xml' 
          }
      });

      const data = await handleResponse(response);
      console.log('Profile deletion response:', data);
      return data;
  } catch (error) {
      console.error('Error deleting profile:', error);
  }
}

async function getRecommendations(profileId) {
  try {
      const response = await fetch(`${API_BASE_URL}/recommendations/${profileId}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json, application/xml'  
          }
      });

      const data = await handleResponse(response);
      console.log('Recommendations:', data);
      return data;
  } catch (error) {
      console.error('Error fetching recommendations:', error);
  }
}

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

exports.getSubscriptionById = async (req, res) => {
  try {
      const [subscription] = await db.execute('SELECT * FROM Subscription WHERE SubscriptionID = ?', [req.params.id]);
      if (subscription.length === 0) {
          return handleResponse(res, 404, { error: 'Subscription not found.' });
      }
      handleResponse(res, 200, subscription[0]);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error fetching subscription.', details: error.message });
  }
};

exports.createSubscription = async (req, res) => {
  const { subscriptionType, discount } = req.body;
  if (!subscriptionType) {
      return handleResponse(res, 400, { error: 'Subscription type is required.' });
  }

  try {
      const [result] = await db.execute('INSERT INTO Subscription (SubscriptionType, Discount) VALUES (?, ?)', [subscriptionType, discount]);
      const response = { message: 'Subscription created successfully.', subscriptionId: result.insertId };
      handleResponse(res, 201, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error creating subscription.', details: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  const { subscriptionType, discount } = req.body;
  try {
      const [result] = await db.execute('UPDATE Subscription SET SubscriptionType = ?, Discount = ? WHERE SubscriptionID = ?', [subscriptionType, discount, req.params.id]);
      if (result.affectedRows === 0) {
          return handleResponse(res, 404, { error: 'Subscription not found.' });
      }

      const response = { message: 'Subscription updated successfully.' };
      handleResponse(res, 200, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error updating subscription.', details: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
      const [result] = await db.execute('DELETE FROM Subscription WHERE SubscriptionID = ?', [req.params.id]);
      if (result.affectedRows === 0) {
          return handleResponse(res, 404, { error: 'Subscription not found.' });
      }

      const response = { message: 'Subscription deleted successfully.' };
      handleResponse(res, 200, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error deleting subscription.', details: error.message });
  }
};

exports.getWatchingFilm = async (req, res) => {
  try {
      const [watchingFilm] = await db.execute('SELECT * FROM WatchingFilm WHERE ProfileID = ? AND FilmID = ?', [req.params.profileId, req.params.filmId]);
      if (watchingFilm.length === 0) {
          return handleResponse(res, 404, { error: 'Watching film record not found.' });
      }
      handleResponse(res, 200, watchingFilm[0]);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error fetching watching film record.', details: error.message });
  }
};

exports.createWatchingFilm = async (req, res) => {
  const { profileId, filmId } = req.body;
  if (!profileId || !filmId) {
      return handleResponse(res, 400, { error: 'ProfileId and FilmId are required.' });
  }

  try {
      const [result] = await db.execute('INSERT INTO WatchingFilm (ProfileID, FilmID) VALUES (?, ?)', [profileId, filmId]);
      const response = { message: 'Watching film record created successfully.', watchingFilmId: result.insertId };
      handleResponse(res, 201, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error creating watching film record.', details: error.message });
  }
};

exports.updateWatchingFilm = async (req, res) => {
  const { profileId, filmId } = req.body;
  try {
      const [result] = await db.execute('UPDATE WatchingFilm SET FilmID = ? WHERE ProfileID = ?', [filmId, profileId]);
      if (result.affectedRows === 0) {
          return handleResponse(res, 404, { error: 'Watching film record not found.' });
      }

      const response = { message: 'Watching film record updated successfully.' };
      handleResponse(res, 200, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error updating watching film record.', details: error.message });
  }
};

exports.deleteWatchingFilm = async (req, res) => {
  try {
      const [result] = await db.execute('DELETE FROM WatchingFilm WHERE ProfileID = ? AND FilmID = ?', [req.params.profileId, req.params.filmId]);
      if (result.affectedRows === 0) {
          return handleResponse(res, 404, { error: 'Watching film record not found.' });
      }

      const response = { message: 'Watching film record deleted successfully.' };
      handleResponse(res, 200, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error deleting watching film record.', details: error.message });
  }
};

exports.getWatchingSeries = async (req, res) => {
  try {
      const [watchingSeries] = await db.execute('SELECT * FROM WatchingSeries WHERE ProfileID = ? AND SeriesID = ?', [req.params.profileId, req.params.seriesId]);
      if (watchingSeries.length === 0) {
          return handleResponse(res, 404, { error: 'Watching series record not found.' });
      }
      handleResponse(res, 200, watchingSeries[0]);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error fetching watching series record.', details: error.message });
  }
};

exports.createWatchingSeries = async (req, res) => {
  const { profileId, seriesId } = req.body;
  if (!profileId || !seriesId) {
      return handleResponse(res, 400, { error: 'ProfileId and SeriesId are required.' });
  }

  try {
      const [result] = await db.execute('INSERT INTO WatchingSeries (ProfileID, SeriesID) VALUES (?, ?)', [profileId, seriesId]);
      const response = { message: 'Watching series record created successfully.', watchingSeriesId: result.insertId };
      handleResponse(res, 201, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error creating watching series record.', details: error.message });
  }
};

exports.updateWatchingSeries = async (req, res) => {
  const { profileId, seriesId } = req.body;
  try {
      const [result] = await db.execute('UPDATE WatchingSeries SET SeriesID = ? WHERE ProfileID = ?', [seriesId, profileId]);
      if (result.affectedRows === 0) {
          return handleResponse(res, 404, { error: 'Watching series record not found.' });
      }

      const response = { message: 'Watching series record updated successfully.' };
      handleResponse(res, 200, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error updating watching series record.', details: error.message });
  }
};


exports.deleteWatchingSeries = async (req, res) => {
  try {
      const [result] = await db.execute('DELETE FROM WatchingSeries WHERE ProfileID = ? AND SeriesID = ?', [req.params.profileId, req.params.seriesId]);
      if (result.affectedRows === 0) {
          return handleResponse(res, 404, { error: 'Watching series record not found.' });
      }

      const response = { message: 'Watching series record deleted successfully.' };
      handleResponse(res, 200, response);
  } catch (error) {
      handleResponse(res, 500, { error: 'Error deleting watching series record.', details: error.message });
  }
};