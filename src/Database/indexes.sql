CREATE INDEX idx_userid ON Account(UserID);
CREATE INDEX idx_filmid ON Film(FilmID);
CREATE INDEX idx_profileid ON Profile(ProfileID);
CREATE INDEX idx_seriesid ON Series(SeriesID);
CREATE INDEX idx_subscriptionid ON Subscription(SubscriptionID);
CREATE INDEX idx_genresid ON Genres(GenresID);
CREATE INDEX idx_genres_film_filmid ON Genres_Film(FilmID);
CREATE INDEX idx_genres_film_genresid ON Genres_Film(GenresID);
CREATE INDEX idx_genres_series_seriesid ON Genres_Series(SeriesID);
CREATE INDEX idx_genres_series_genresid ON Genres_Series(GenresID);
CREATE INDEX idx_watchingfilm_profileid ON WatchingFilm(ProfileID);
CREATE INDEX idx_watchingfilm_filmid ON WatchingFilm(FilmID);
CREATE INDEX idx_watchingseries_profileid ON WatchingSeries(ProfileID);
CREATE INDEX idx_watchingseries_seriesid ON WatchingSeries(SeriesID);