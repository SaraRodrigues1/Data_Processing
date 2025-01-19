DELIMITER $$

/* User Registration */
CREATE PROCEDURE UserRegistration(
    IN Email VARCHAR(255),
    IN Password VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Handle error
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred during user registration.';
    END;

    START TRANSACTION;
    
    IF NOT EXISTS (SELECT 1 FROM Account WHERE Email = Email) THEN
        INSERT INTO Account (Email, Password) VALUES (Email, Password);
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists.';
    END IF;
    
    COMMIT;
END$$

/* Create Profile */
CREATE PROCEDURE CreateProfile(
    IN UserID INT,
    IN Name VARCHAR(100),
    IN Age INT,
    IN Language VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred during profile creation.';
    END;

    START TRANSACTION;

    IF EXISTS (SELECT 1 FROM Account WHERE UserID = UserID) THEN
        IF (SELECT COUNT(*) FROM Profile WHERE UserID = UserID) < 4 THEN
            INSERT INTO Profile (UserID, Name, Age, Language) VALUES (UserID, Name, Age, Language);
        ELSE
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'User has reached maximum profile limit.';
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User not found.';
    END IF;

    COMMIT;
END$$

/* Change Preffered Language */
CREATE PROCEDURE ChangePreferredLanguage(
    IN ProfileID INT,
    IN NewLanguage VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'An error occurred while changing the preferred language.';
    END;

    START TRANSACTION;
    
    UPDATE Profile
    SET Language = NewLanguage
    WHERE ProfileID = ProfileID;

    COMMIT;
END$$
DELIMITER ;
