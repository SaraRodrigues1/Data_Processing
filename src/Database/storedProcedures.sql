CREATE PROCEDURE UserRegistration
    @Email VARCHAR(255),
    @Password VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Account WHERE Email = @Email)
        BEGIN
            INSERT INTO Account (Email, Password) VALUES (@Email, @Password);
            PRINT 'User registered successfully.';
        END
        ELSE
        BEGIN
            THROW 51000, 'Email already exists.', 1;
        END
    END TRY
    BEGIN CATCH
        PRINT 'An error occurred during user registration: ' + ERROR_MESSAGE();
    END CATCH;
END;

 /* create profile */
CREATE PROCEDURE CreateProfile
    @UserID INT,
    @Name VARCHAR(100),
    @Age INT,
    @Language VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Account WHERE UserID = @UserID)
        BEGIN
            IF (SELECT COUNT(*) FROM Profile WHERE UserID = @UserID) < 4
            BEGIN
                INSERT INTO Profile (UserID, Name, Age, Language) VALUES (@UserID, @Name, @Age, @Language);
                PRINT 'Profile created successfully.';
            END
            ELSE
            BEGIN
                THROW 51001, 'User has reached maximum profile limit.', 1;
            END
        END
        ELSE
        BEGIN
            THROW 51002, 'User not found.', 1;
        END
    END TRY
    BEGIN CATCH
        PRINT 'An error occurred during profile creation: ' + ERROR_MESSAGE();
    END CATCH;
END;

 /* change language */
CREATE PROCEDURE ChangePreferredLanguage
    @ProfileID INT,
    @NewLanguage VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        UPDATE Profile SET Language = @NewLanguage WHERE ProfileID = @ProfileID;
        PRINT 'Preferred language changed successfully.';
    END TRY
    BEGIN CATCH
        PRINT 'An error occurred while changing preferred language: ' + ERROR_MESSAGE();
    END CATCH;
END;
