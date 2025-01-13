CREATE VIEW UserProfiles AS
SELECT
    a.UserID,
    a.Email,
    a.Password,
    a.SubscriptionID,
    a.AccountBlocked,
    a.Invitations,
    p.Name,
    p.Photo,
    p.Age,
    p.Language,
    p.InterestedInMedia
FROM
    Account a
JOIN
    Profile p ON a.UserID = p.UserID;


CREATE VIEW WatchHistory AS
SELECT
    wf.ProfileID,
    wf.FilmID,
    NULL AS SeriesID,
    wf.PausedTime AS Film_Paused_Time,
    wf.WatchCount AS Film_Watch_Count,
    NULL AS Series_Paused_Time,
    NULL AS Series_Watch_Count
FROM
    WatchingFilm wf
UNION ALL
SELECT
    ws.ProfileID,
    NULL AS FilmID,
    ws.SeriesID,
    NULL AS Film_Paused_Time,
    NULL AS Film_Watch_Count,
    ws.PausedTime AS Series_Paused_Time,
    ws.WatchCount AS Series_Watch_Count
FROM
    WatchingSeries ws;


CREATE VIEW Watchlist AS
SELECT
    wf.ProfileID,
    wf.FilmID,
    NULL AS SeriesID
FROM
    WatchingFilm wf
WHERE wf.WatchCount = 0
UNION ALL
SELECT
    ws.ProfileID,
    NULL AS FilmID,
    ws.SeriesID
FROM
    WatchingSeries ws
WHERE ws.WatchCount = 0;


CREATE VIEW SubscriptionDetails AS
SELECT
    s.SubscriptionID,
    s.SubscriptionType,
    s.Discount,
    a.UserID
FROM
    Subscription s
JOIN
    Account a ON s.SubscriptionID = a.SubscriptionID;


CREATE VIEW MediaDetails AS
SELECT
    f.FilmID,
    f.Title AS Media_Title,
    f.Description AS Media_Description,
    f.Subtitles AS Media_Subtitles,
    f.MinimumAge AS Media_MinimumAge,
    f.TimesWatched AS Media_Streams,
    gf.GenresID AS Genre_ID,
    g.Genre AS Genre_Name
FROM
    Film f
LEFT JOIN
    Genres_Film gf ON f.FilmID = gf.FilmID
LEFT JOIN
    Genres g ON gf.GenresID = g.GenresID
UNION ALL
SELECT
    s.SeriesID,
    s.Title AS Media_Title,
    s.Description AS Media_Description,
    s.Subtitles AS Media_Subtitles,
    s.MinimumAge AS Media_MinimumAge,
    s.TimesWatched AS Media_Streams,
    gs.GenresID AS Genre_ID,
    g.Genre AS Genre_Name
FROM
    Series s
LEFT JOIN
    Genres_Series gs ON s.SeriesID = gs.SeriesID
LEFT JOIN
    Genres g ON gs.GenresID = g.GenresID;


CREATE VIEW UserGenrePreferences AS
SELECT
    gp.ProfileID,
    g.Genre AS Preferred_Genre
FROM
    Genres_Profile gp
JOIN
    Genres g ON gp.GenresID = g.GenresID;


CREATE VIEW FilmGenres AS
SELECT
    gf.FilmID,
    g.Genre AS Film_Genre
FROM
    Genres_Film gf
JOIN
    Genres g ON gf.GenresID = g.GenresID;


CREATE VIEW SeriesGenres AS
SELECT
    gs.SeriesID,
    g.Genre AS Series_Genre
FROM
    Genres_Series gs
JOIN
    Genres g ON gs.GenresID = g.GenresID;
