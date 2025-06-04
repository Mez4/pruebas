package mx.com.lagunasoftware.kcuser;

public class User {

    /** User's Id */
    private final String Id;

    /** Return the user's Id */
    public String getId() {
        return this.Id;
    }

    /** User's Email */
    private final String Email;

    /** Return the user's Email */
    public String getEmail() {
        return this.Email;
    }

    /** User's Name(s) */
    private String Name;

    /** Return the user's Name */
    public String getName() {
        return this.Name;
    }

    /** User's LastName */
    private String LastName;

    /** Return the user's Last Name */
    public String getLastName() {
        return this.LastName;
    }

    /** User's Second Last Name (Usefull for some countries) */
    private String LastNameSecond;

    /** Return the user's Second Last Name */
    public String getLastNameSecond() {
        return this.LastNameSecond;
    }

    /** Was the user validated */
    private Boolean Validated;

    /** Return the user's Validation Status */
    public Boolean getValidated() {
        return this.Validated;
    }

    /** Is the user a main administrator */
    private Boolean MasterUser;

    /** Return the user's Main Admin Status */
    public Boolean getMasterUser() {
        return this.MasterUser;
    }

    /**
     * Class Constructor
     * 
     * @param pUser Uses the class UserBuilder inside this class to generate this
     *              data in an
     *              organized manner
     */
    public User(UserBuilder pUser) {
        this.Id = pUser.Id;
        this.Email = pUser.Email;
        this.Name = pUser.Name;
        this.LastName = pUser.LastName;
        this.LastNameSecond = pUser.LastNameSecond;
        this.Validated = pUser.Validated;
        this.MasterUser = pUser.MasterUser;
    }

    /** Constructor class */
    public static class UserBuilder {
        private final String Id;
        private final String Email;
        private String Name;
        private String LastName;
        private String LastNameSecond;
        private Boolean Validated;
        private Boolean MasterUser;

        /**
         * Base constructor with email and Id [Only unique fields]
         * 
         * @param pId    Id to set
         * @param pEmail Email to set
         */
        public UserBuilder(String pId, String pEmail) {
            this.Id = pId;
            this.Email = pEmail;
        }

        /**
         * Set's the names of this user
         * 
         * @param pName           Name to set
         * @param pLastName       LastName to set
         * @param pLastNameSecond LastNameSecond to set
         * @return UserBuilder Interface
         */
        public UserBuilder Names(String pName, String pLastName, String pLastNameSecond) {
            this.Name = pName;
            this.LastName = pLastName;
            this.LastNameSecond = pLastNameSecond;
            return this;
        }

        /**
         * Space dedicated to map the user info
         * 
         * @param pValidated  Is the user validated
         * @param pMasterUser Is the user a MasterUser
         * @return UserBuilder Instance
         */
        public UserBuilder UserInfo(Boolean pValidated, boolean pMasterUser) {
            this.Validated = pValidated;
            this.MasterUser = pMasterUser;
            return this;
        }
    }
}
