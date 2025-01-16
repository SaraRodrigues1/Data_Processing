SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Account` (
  `UserID` INT AUTO_INCREMENT,
  `Email` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `AccountVerified` TINYINT DEFAULT FALSE,
  `AccountBlocked` TINYINT DEFAULT FALSE,
  `Invitations` INT DEFAULT 0,
  `SubscriptionID` INT DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX (`Email` ASC),
  INDEX (`SubscriptionID` ASC),
  CONSTRAINT `FK_Account_Subscription`
    FOREIGN KEY (`SubscriptionID`)
    REFERENCES `mydb`.`Subscription` (`SubscriptionID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`ContentWarnings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`ContentWarnings` (
  `ContentWarningID` INT AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Description` TEXT DEFAULT NULL,
  PRIMARY KEY (`ContentWarningID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Episode`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Episode` (
  `EpisodeId` INT NOT NULL,
  `SeriesId` INT NOT NULL,
  `Title` VARCHAR(255) DEFAULT NULL,
  `Subtitles` VARCHAR(255) DEFAULT NULL,
  `PrevEp` INT DEFAULT NULL,
  `NextEp` INT DEFAULT NULL,
  PRIMARY KEY (`EpisodeId`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Film`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Film` (
  `FilmID` INT AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `Subtitles` TINYINT DEFAULT FALSE,
  `MinimumAge` INT DEFAULT NULL,
  `Description` TEXT DEFAULT NULL,
  `TimesWatched` INT DEFAULT 0,
  PRIMARY KEY (`FilmID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Genres` (
  `GenresID` INT AUTO_INCREMENT,
  `Genre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`GenresID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Genres_Film`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Genres_Film` (
  `FilmID` INT NOT NULL,
  `GenresID` INT NOT NULL,
  PRIMARY KEY (`GenresID`, `FilmID`),
  CONSTRAINT `FK_Genres_Film_Film`
    FOREIGN KEY (`FilmID`)
    REFERENCES `mydb`.`Film` (`FilmID`),
  CONSTRAINT `FK_Genres_Film_Genres`
    FOREIGN KEY (`GenresID`)
    REFERENCES `mydb`.`Genres` (`GenresID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Genres_Profile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Genres_Profile` (
  `ProfileID` INT NOT NULL,
  `GenresID` INT NOT NULL,
  PRIMARY KEY (`ProfileID`, `GenresID`),
  CONSTRAINT `FK_Genres_Profile_Profile`
    FOREIGN KEY (`ProfileID`)
    REFERENCES `mydb`.`Profile` (`ProfileID`),
  CONSTRAINT `FK_Genres_Profile_Genres`
    FOREIGN KEY (`GenresID`)
    REFERENCES `mydb`.`Genres` (`GenresID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Genres_Series`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Genres_Series` (
  `SeriesID` INT NOT NULL,
  `GenresID` INT NOT NULL,
  PRIMARY KEY (`SeriesID`, `GenresID`),
  CONSTRAINT `FK_Genres_Series_Series`
    FOREIGN KEY (`SeriesID`)
    REFERENCES `mydb`.`Series` (`SeriesID`),
  CONSTRAINT `FK_Genres_Series_Genres`
    FOREIGN KEY (`GenresID`)
    REFERENCES `mydb`.`Genres` (`GenresID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Profile`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Profile` (
  `ProfileID` INT AUTO_INCREMENT,
  `UserID` INT DEFAULT NULL,
  `Name` VARCHAR(100) DEFAULT NULL,
  `Photo` VARCHAR(255) DEFAULT NULL,
  `Language` VARCHAR(50) DEFAULT NULL,
  `Age` INT DEFAULT NULL,
  `InterestedInMedia` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`ProfileID`),
  CONSTRAINT `FK_Profile_Account`
    FOREIGN KEY (`UserID`)
    REFERENCES `mydb`.`Account` (`UserID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Series`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Series` (
  `SeriesID` INT AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `Subtitles` TINYINT DEFAULT FALSE,
  `MinimumAge` INT DEFAULT NULL,
  `Description` TEXT DEFAULT NULL,
  `TimesWatched` INT DEFAULT 0,
  PRIMARY KEY (`SeriesID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`Subscription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Subscription` (
  `SubscriptionID` INT AUTO_INCREMENT,
  `SubscriptionType` VARCHAR(100) NOT NULL,
  `Discount` DECIMAL(5,2) DEFAULT NULL,
  PRIMARY KEY (`SubscriptionID`)
);

-- -----------------------------------------------------
-- Table `mydb`.`WatchingFilm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`WatchingFilm` (

  `ProfileID` INT NULL DEFAULT NULL,
  `FilmID` INT NULL DEFAULT NULL,
  `PausedTime` TIME NULL DEFAULT NULL,
  `WatchCount` INT NULL DEFAULT 0,
  PRIMARY KEY (`ProfileID`, `FilmID`),
  INDEX (`FilmID` ASC) VISIBLE,
  CONSTRAINT ``
    FOREIGN KEY (`ProfileID`)
    REFERENCES `mydb`.`Profile` (`ProfileID`),
  CONSTRAINT ``
    FOREIGN KEY (`FilmID`)
    REFERENCES `mydb`.`Film` (`FilmID`));

-- -----------------------------------------------------
-- Table `mydb`.`WatchingSeries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`WatchingSeries` (
  `ProfileID` INT NOT NULL,
  `SeriesID` INT NOT NULL,
  `PausedTime` TIME DEFAULT NULL,
  `WatchCount` INT DEFAULT 0,
  `CurrentEpisode` INT DEFAULT NULL,
  PRIMARY KEY (`ProfileID`, `SeriesID`),
  CONSTRAINT `FK_WatchingSeries_Profile`
    FOREIGN KEY (`ProfileID`)
    REFERENCES `mydb`.`Profile` (`ProfileID`),
  CONSTRAINT `FK_WatchingSeries_Series`
    FOREIGN KEY (`SeriesID`)
    REFERENCES `mydb`.`Series` (`SeriesID`)
);

-- -----------------------------------------------------
-- New Table: AuditLog
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`AuditLog` (
  `AuditID` INT AUTO_INCREMENT PRIMARY KEY,
  `ProfileID` INT,
  `ChangedAt` DATETIME,
  `OldName` VARCHAR(255),
  `NewName` VARCHAR(255),
  `OldAge` INT,
  `NewAge` INT
);

-- -----------------------------------------------------
-- New Table: SubscriptionAudit
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`SubscriptionAudit` (
  `AuditID` INT AUTO_INCREMENT PRIMARY KEY,
  `SubscriptionID` INT,
  `ChangedAt` DATETIME,
  `OldType` VARCHAR(255),
  `NewType` VARCHAR(255),
  `OldDiscount` DECIMAL(5, 2),
  `NewDiscount` DECIMAL(5, 2)
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
