CREATE TABLE Account (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    AccountVerified BOOLEAN DEFAULT FALSE,
    AccountBlocked BOOLEAN DEFAULT FALSE,
    Invitations INT DEFAULT 0,
    SubscriptionID INT,
    FOREIGN KEY (SubscriptionID) REFERENCES Subscription(SubscriptionID)
);

CREATE TABLE Profile (
    ProfileID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Name VARCHAR(100),
    Photo VARCHAR(255),
    Language VARCHAR(50),
    Age INT,
    InterestedInMedia VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES Account(UserID)
);

CREATE TABLE Subscription (
    SubscriptionID INT AUTO_INCREMENT PRIMARY KEY,
    SubscriptionType VARCHAR(100) NOT NULL,
    Discount DECIMAL(5, 2)
);

CREATE TABLE Genres (
    GenresID INT AUTO_INCREMENT PRIMARY KEY,
    Genre VARCHAR(50) NOT NULL
);

CREATE TABLE Series (
    SeriesID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Subtitles BOOLEAN DEFAULT FALSE,
    MinimumAge INT,
    Description TEXT,
    TimesWatched INT DEFAULT 0
);

CREATE TABLE Film (
    FilmID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Subtitles BOOLEAN DEFAULT FALSE,
    MinimumAge INT,
    Description TEXT,
    TimesWatched INT DEFAULT 0
);

CREATE TABLE ContentWarnings (
    ContentWarningID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT
);

CREATE TABLE WatchingSeries (
    ProfileID INT,
    SeriesID INT,
    PausedTime TIME,
    WatchCount INT DEFAULT 0,
    CurrentEpisode INT,
    PRIMARY KEY (ProfileID, SeriesID),
    FOREIGN KEY (ProfileID) REFERENCES Profile(ProfileID),
    FOREIGN KEY (SeriesID) REFERENCES Series(SeriesID)
);

CREATE TABLE WatchingFilm (
    ProfileID INT,
    FilmID INT,
    PausedTime TIME,
    WatchCount INT DEFAULT 0,
    PRIMARY KEY (ProfileID, FilmID),
    FOREIGN KEY (ProfileID) REFERENCES Profile(ProfileID),
    FOREIGN KEY (FilmID) REFERENCES Film(FilmID)
);

CREATE TABLE Genres_Series (
    SeriesID INT,
    GenresID INT,
    PRIMARY KEY (SeriesID, GenresID),
    FOREIGN KEY (SeriesID) REFERENCES Series(SeriesID),
    FOREIGN KEY (GenresID) REFERENCES Genres(GenresID)
);

CREATE TABLE Genres_Film (
    FilmID INT,
    GenresID INT,
    PRIMARY KEY (FilmID, GenresID),
    FOREIGN KEY (FilmID) REFERENCES Film(FilmID),
    FOREIGN KEY (GenresID) REFERENCES Genres(GenresID)
);

CREATE TABLE Genres_Profile (
    ProfileID INT,
    GenresID INT,
    PRIMARY KEY (ProfileID, GenresID),
    FOREIGN KEY (ProfileID) REFERENCES Profile(ProfileID),
    FOREIGN KEY (GenresID) REFERENCES Genres(GenresID)
);
