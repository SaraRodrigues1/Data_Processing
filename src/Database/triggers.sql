DELIMITER $$

/* Log profile Updates */
CREATE TRIGGER after_profile_update
AFTER UPDATE ON Profile
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog(ProfileID, ChangedAt, OldName, NewName, OldAge, NewAge)
    VALUES (OLD.ProfileID, NOW(), OLD.Name, NEW.Name, OLD.Age, NEW.Age);
END$$

/* Track Movie/Serie Watching */
/* Watching a movie */
CREATE TRIGGER after_watch_film
AFTER UPDATE ON WatchingFilm
FOR EACH ROW
BEGIN
    UPDATE Film
    SET TimeWatched = TimeWatched + 1
    WHERE FilmID = NEW.FilmID;
END$$

/* Watching a serie */
CREATE TRIGGER after_watch_series
AFTER UPDATE ON WatchingSeries
FOR EACH ROW
BEGIN
    UPDATE Series
    SET TimesWatched = TimesWatched + 1
    WHERE SeriesID = NEW.SeriesID;
END$$

/* Restrict Inappropriate Content */
/* For movie */
CREATE TRIGGER before_add_movie_to_watchlist
BEFORE INSERT ON WatchingFilm
FOR EACH ROW
BEGIN
    DECLARE profile_age INT;
    DECLARE min_age INT;

    SELECT Age INTO profile_age FROM Profile WHERE ProfileID = NEW.ProfileID;
    SELECT MinimumAge INTO min_age FROM Film WHERE FilmID = NEW.FilmID;

    IF profile_age < min_age THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add movie: Content exceeds age restriction.';
    END IF;
END$$

/* For Series */
CREATE TRIGGER before_add_series_to_watchlist
BEFORE INSERT ON WatchingSeries
FOR EACH ROW
BEGIN
    DECLARE profile_age INT;
    DECLARE min_age INT;

    SELECT Age INTO profile_age FROM Profile WHERE ProfileID = NEW.ProfileID;
    SELECT MinimumAge INTO min_age FROM Series WHERE SeriesID = NEW.SeriesID;

    IF profile_age < min_age THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add series: Content exceeds age restrictions.';
    END IF;
END$$

/* Audit Subscriptions */
CREATE TRIGGER after_subscription_update 
AFTER UPDATE ON Subscription
FOR EACH ROW
BEGIN
    INSERT INTO SubscriptionAudit(SubscriptionID, ChangedAt, OldType, NewType, OldDiscount, NewDiscount)
    VALUES (OLD.SubscriptionID, NOW(), OLD.SubscriptionType, NEW.SubscriptionType, OLD.Discount, NEW.Discount);
END$$

/* Prevent Deleting Linked Data */
CREATE TRIGGER before_profile_delete
BEFORE DELETE ON Profile
FOR EACH ROW
BEGIN
    DECLARE watchlist_count INT;

    SELECT COUNT(*) INTO watchlist_count FROM WatchingFilm WHERE ProfileID = OLD.ProfileID;

    IF watchlist_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete profile: Active watchlist items exist.';
    END IF;
END$$

DELIMITER ;