package mx.com.lagunasoftware.kcuser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import org.keycloak.component.ComponentModel;
import org.mindrot.jbcrypt.BCrypt;

/** Manages the connection to the database */
public class UserStorage {

    /** MySQL Database connection variable */
    private Connection con;

    /** Logger instance */
    private static final Logger log = LoggerFactory.getLogger(UserStorage.class);

    /** JDBC Connection string to our application */
    private final String MYSQL_CONNECTION_STRING;

    /** JDBC User */
    private final String MYSQL_USER;

    /** JDBC Password */
    private final String MYSQL_PASSWORD;

    public UserStorage(ComponentModel config) {

        // Details
        this.MYSQL_USER = config.get(Variables.CONFIG_KEY__USER);
        this.MYSQL_PASSWORD = config.get(Variables.CONFIG_KEY__PASSWORD);
        this.MYSQL_CONNECTION_STRING = String.format("jdbc:mysql://%s:%s/%s",
                config.get(Variables.CONFIG_KEY__SERVER), config.get(Variables.CONFIG_KEY__PORT),
                config.get(Variables.CONFIG_KEY__DB));

        // Details
        // log.info(this.MYSQL_CONNECTION_STRING);
        // log.info(this.MYSQL_USER);
        // log.info(this.MYSQL_PASSWORD);
    }

    /** Base query for users */
    private final String BASE_QUERY = "SELECT id, email, name, name_last_first, name_last_second, validated, master FROM users";

    /** Query for getting the password */
    private final String PASSWORD_QUERY = "SELECT password FROM users WHERE email = ?";

    /**
     * Used to parse a user using the record set (avoiding repeating code till hell)
     * 
     * @param pRS RecordSet to use
     * @return User Instance
     */
    private User ParseResultSet(ResultSet pRS) {
        try {
            return new User(
                    new User.UserBuilder(pRS.getString("id"), pRS.getString("email"))
                            .Names(pRS.getString("name"), pRS.getString("name_last_first"),
                                    pRS.getString("name_last_second"))
                            .UserInfo(pRS.getBoolean("validated"), pRS.getBoolean("master")));
        } catch (SQLException e) {
            log.error(String.format("Error while parsing the user {}", e.getMessage()));
            return null;
        }
    }

    /**
     * Get's a user from the database using the user's Id
     * 
     * @param pId Id of the user to find
     * @return User instance
     */
    public User GetUserById(String pId) {

        // Find User Query
        String userQuery = String.format("%s %s", BASE_QUERY, "WHERE Id = ?");

        // Prepare an statement
        try {

            // Initialize our connection
            this.con = DriverManager.getConnection(MYSQL_CONNECTION_STRING, MYSQL_USER, MYSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(userQuery);

            // Set our variables
            statement.setString(1, pId);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Read our values into our user variable
            User user = ParseResultSet(rs);

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Return our uset
            return user;

        } catch (SQLException e) {

            // Log the exception
            log.error(String.format("Error on [MySQL] while getting the user by the id: {}", e.getMessage()));

        } catch (Exception ex) {

            // Log the exception
            log.error(String.format("Error on [General] while getting the user by the id: {}", ex.getMessage()));

        }

        return null;
    }

    /**
     * Get's a user from the database using the user's Email
     * 
     * @param pEmail Email of the user to find
     * @return User instance
     */
    public User GetUserByEmail(String pEmail) {

        // Find User Query
        String userQuery = String.format("%s %s", BASE_QUERY, "WHERE Email = ?");

        // Prepare an statement
        try {

            // Initialize our connection
            this.con = DriverManager.getConnection(MYSQL_CONNECTION_STRING, MYSQL_USER, MYSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(userQuery);

            // Set our variables
            statement.setString(1, pEmail);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Read our values into our user variable
            User user = ParseResultSet(rs);

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Return our uset
            return user;

        } catch (SQLException e) {

            // Log the exception
            log.error(String.format("Error on [MySQL] while getting the user by the email: {}", e.getMessage()));

        } catch (Exception ex) {

            // Log the exception
            log.error(String.format("Error on [General] while getting the user by the email: {}", ex.getMessage()));

        }

        return null;
    }

    /**
     * Lists the users in the database
     * 
     * @param pEmail Email of the user to find
     * @return User instance
     */
    public List<User> GetUsers(int firstResult, int maxResults) {

        // Find User Query
        String userQuery = String.format("%s %s", BASE_QUERY, "order by Email limit ? offset ?");

        // Prepare an statement
        try {

            List<User> users = new ArrayList<>();

            // Initialize our connection
            this.con = DriverManager.getConnection(MYSQL_CONNECTION_STRING, MYSQL_USER, MYSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(userQuery);

            // Set our variables
            statement.setInt(1, maxResults);
            statement.setInt(2, firstResult);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            while (rs.next()) {
                users.add(ParseResultSet(rs));
            }

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Return our uset
            return users;

        } catch (SQLException e) {

            // Log the exception
            log.error(String.format("Error on [MySQL] while getting the user by the email: {}", e.getMessage()));

        } catch (Exception ex) {

            // Log the exception
            log.error(String.format("Error on [General] while getting the user by the email: {}", ex.getMessage()));

        }

        return null;
    }

    /**
     * Search for users in the database
     * 
     * @param pEmail Email of the user to find
     * @return User instance
     */
    public List<User> FindUsers(String search, int firstResult, int maxResults) {

        // Find User Query
        String userQuery = String.format("%s %s", BASE_QUERY,
                "WHERE Email LIKE '%?%' OR CONCAT(Name, ' ', LastName, ' ', LastNameSecond) LIKE '%?%' order by Email limit ? offset ?");

        // Prepare an statement
        try {

            List<User> users = new ArrayList<>();

            // Initialize our connection
            this.con = DriverManager.getConnection(MYSQL_CONNECTION_STRING, MYSQL_USER, MYSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(userQuery);

            // Set our variables
            statement.setString(1, search);
            statement.setString(2, search);
            statement.setInt(3, maxResults);
            statement.setInt(4, firstResult);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            while (rs.next()) {
                users.add(ParseResultSet(rs));
            }

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Return our uset
            return users;

        } catch (SQLException e) {

            // Log the exception
            log.error(String.format("Error on [MySQL] while getting the user by the email: {}", e.getMessage()));

        } catch (Exception ex) {

            // Log the exception
            log.error(String.format("Error on [General] while getting the user by the email: {}", ex.getMessage()));

        }

        return null;
    }

    /**
     * Get's a user from the database using the user's Id
     * 
     * @param pEmail Email of the user to find
     * @return User instance
     */
    public Integer GetUserCount() {

        // Find User Query
        String countQuery = String.format("SELECT COUNT(0) FROM users");

        // Prepare an statement
        try {

            // Initialize our connection
            this.con = DriverManager.getConnection(MYSQL_CONNECTION_STRING, MYSQL_USER, MYSQL_PASSWORD);

            // Prepare qour query execution
            Statement statement = con.createStatement();

            // Get our Result's Set
            ResultSet rs = statement.executeQuery(countQuery);

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Read our values into our user variable
            Integer count = rs.getInt(0);

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Return our uset
            return count;

        } catch (SQLException e) {

            // Log the exception
            log.error(String.format("Error on [MySQL] while getting the user's count: {}", e.getMessage()));

        } catch (Exception ex) {

            // Log the exception
            log.error(String.format("Error on [General] while getting the user's count: {}", ex.getMessage()));

        }

        return null;
    }

    /**
     * Get's a user from the database using the user's Id
     * 
     * @param pEmail Email of the user to find
     * @return User instance
     */
    public Boolean PasswordValid(String pEmail, String pPassword) {

        // Prepare an statement
        try {

            // Initialize our connection
            this.con = DriverManager.getConnection(MYSQL_CONNECTION_STRING, MYSQL_USER, MYSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(PASSWORD_QUERY);

            // Set our variables
            statement.setString(1, pEmail);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Read our values into our user variable
            String passwordDB = rs.getString(1);

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Validate the passwords
            return BCrypt.checkpw(pPassword, passwordDB);

        } catch (SQLException e) {

            // Log the exception
            log.error(String.format("Error on [MySQL] while validating the user's password: {}", e.getMessage()));

        } catch (Exception ex) {

            // Log the exception
            log.error(String.format("Error on [General] while validating the user's password: {}", ex.getMessage()));

        }

        return null;
    }

}