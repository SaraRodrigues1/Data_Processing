BEGIN TRY
    CREATE INDEX idx_userid ON Account(UserID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on UserID column in the Account table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_filmid ON Film(FilmID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on FilmID column in the Film table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_profileid ON Profile(ProfileID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on ProfileID column in the Profile table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_seriesid ON Series(SeriesID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on SeriesID column in the Series table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_subscriptionid ON Subscription(SubscriptionID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on SubscriptionID column in the Subscription table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_genresid ON Genres(GenresID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on GenresID column in the Genres table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_genres_film_filmid ON Genres_Film(FilmID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on FilmID column in the Genres_Film table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_genres_film_genresid ON Genres_Film(GenresID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on GenresID column in the Genres_Film table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_genres_series_seriesid ON Genres_Series(SeriesID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on SeriesID column in the Genres_Series table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_genres_series_genresid ON Genres_Series(GenresID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on GenresID column in the Genres_Series table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_watchingfilm_profileid ON WatchingFilm(ProfileID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on ProfileID column in the WatchingFilm table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_watchingfilm_filmid ON WatchingFilm(FilmID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on FilmID column in the WatchingFilm table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_watchingseries_profileid ON WatchingSeries(ProfileID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on ProfileID column in the WatchingSeries table.';
    PRINT ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    CREATE INDEX idx_watchingseries_seriesid ON WatchingSeries(SeriesID);
END TRY
BEGIN CATCH
    PRINT 'An error occurred while creating the index on SeriesID column in the WatchingSeries table.';
    PRINT ERROR_MESSAGE();
END CATCH;
