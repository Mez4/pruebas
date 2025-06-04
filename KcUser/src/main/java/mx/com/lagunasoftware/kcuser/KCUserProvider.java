package mx.com.lagunasoftware.kcuser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.keycloak.component.ComponentModel;
import org.keycloak.credential.CredentialInput;
import org.keycloak.credential.CredentialInputValidator;
import org.keycloak.models.GroupModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.cache.CachedUserModel;
import org.keycloak.models.credential.PasswordCredentialModel;
import org.keycloak.storage.StorageId;
import org.keycloak.storage.UserStorageProvider;
import org.keycloak.storage.user.UserLookupProvider;
import org.keycloak.storage.user.UserQueryProvider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class KCUserProvider implements
        UserStorageProvider, UserLookupProvider, CredentialInputValidator, UserQueryProvider {

    // Create our logger
    private static final Logger log = LoggerFactory.getLogger(KCUserProvider.class);

    // Keycloak Session and model data
    private KeycloakSession ksession;
    private ComponentModel model;

    public KCUserProvider(KeycloakSession ksession, ComponentModel model) {
        this.ksession = ksession;
        this.model = model;
    }

    @Override
    public void close() {
    }

    @Override
    public List<UserModel> getUsers(RealmModel realm) {
        try {

            // Users from the DB
            List<User> users = new UserStorage(this.model).GetUsers(0, 5000);
            List<UserModel> cusers = new ArrayList<>();
            for (User u : users) {
                cusers.add(new KCUserAdapter(ksession, realm, model, u));
            }

            // Validate our password
            return cusers;

        } catch (Exception ex) {

            // Log the error
            log.error(String.format("Error while getting the users: %s", ex.getMessage()));

            // Return false
            return new ArrayList<>();
        }
    }

    @Override
    public List<UserModel> getUsers(RealmModel realm, int firstResult, int maxResults) {
        try {

            // Users from the DB
            List<User> users = new UserStorage(this.model).GetUsers(firstResult, maxResults);
            List<UserModel> cusers = new ArrayList<>();
            for (User u : users) {
                cusers.add(new KCUserAdapter(ksession, realm, model, u));
            }

            // Validate our password
            return cusers;

        } catch (Exception ex) {

            // Log the error
            log.error(String.format("Error while getting the users: %s", ex.getMessage()));

            // Return false
            return new ArrayList<>();
        }
    }

    @Override
    public List<UserModel> searchForUser(String search, RealmModel realm) {
        return searchForUser(search, realm, 0, 5000);
    }

    @Override
    public List<UserModel> searchForUser(String search, RealmModel realm, int firstResult, int maxResults) {
        // log.info("KCUSer || searchForUser: realm={}, search: {}", realm.getName(),
        // search);

        try {

            // Users from the DB
            List<User> users = new UserStorage(this.model).FindUsers(search, firstResult, maxResults);
            List<UserModel> cusers = new ArrayList<>();
            for (User u : users) {
                cusers.add(new KCUserAdapter(ksession, realm, model, u));
            }

            // Validate our password
            return cusers;

        } catch (Exception ex) {

            // Log the error
            log.error(String.format("Error while getting the users: %s", ex.getMessage()));

            // Return false
            return new ArrayList<>();
        }
    }

    @Override
    public List<UserModel> searchForUser(Map<String, String> params, RealmModel realm) {
        return searchForUser(params, realm, 0, 5000);
    }

    @Override
    public List<UserModel> searchForUser(Map<String, String> params, RealmModel realm, int firstResult,
            int maxResults) {
        return getUsers(realm, firstResult, maxResults);
    }

    @Override
    public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group) {
        return Collections.emptyList();
    }

    @Override
    public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group, int firstResult, int maxResults) {
        return Collections.emptyList();
    }

    @Override
    public List<UserModel> searchForUserByUserAttribute(String attrName, String attrValue, RealmModel realm) {
        return Collections.emptyList();
    }

    @Override
    public boolean supportsCredentialType(String credentialType) {
        return PasswordCredentialModel.TYPE.endsWith(credentialType);
    }

    @Override
    public boolean isConfiguredFor(RealmModel realm, UserModel user, String credentialType) {
        // In our case, password is the only type of credential, so we allways return
        // 'true' if
        // this is the credentialType
        return supportsCredentialType(credentialType);

    }

    @Override
    public boolean isValid(RealmModel realm, UserModel user, CredentialInput credentialInput) {

        // Validate our credential support
        // log.info("KCUSer || isValid(realm={},user={},credentialInput.type={})",
        // realm.getName(), user.getUsername(),
        // credentialInput.getType());
        if (!this.supportsCredentialType(credentialInput.getType())) {
            return false;
        }

        // Get our data
        StorageId sid = new StorageId(user.getId());
        String Email = sid.getExternalId();

        // Invalidate our user's cache (gets correct user's data on every request)
        if (user instanceof CachedUserModel) {
            ((CachedUserModel) user).invalidate();
        }

        try {

            // Validate our password
            return new UserStorage(this.model).PasswordValid(Email, credentialInput.getChallengeResponse());
        } catch (Exception ex) {

            // Log the error
            log.error(String.format("Error while validating the user: %s", ex.getMessage()));

            // Return false
            return false;
        }
    }

    @Override
    public UserModel getUserById(String id, RealmModel realm) {
        // log.info("KCUSer || getUserById({})", id);
        StorageId sid = new StorageId(id);
        return getUserByUsername(sid.getExternalId(), realm);
    }

    @Override
    public UserModel getUserByUsername(String username, RealmModel realm) {
        // log.info("KCUSer || getUserByUsername({})", username);

        // Get our connection
        UserStorage userStorage = new UserStorage(this.model);

        // Get our user
        User user = userStorage.GetUserByEmail(username);

        // Check if we have a valid user
        if (user != null)

            // Create our custom user
            return new KCUserAdapter(ksession, realm, model, user);

        // Throw an exception if whe user was not obtained
        throw new RuntimeException("The user was not found");
    }

    @Override
    public UserModel getUserByEmail(String email, RealmModel realm) {
        // log.info("KCUSer || getUserByEmail({})", email);

        // Get our connection
        UserStorage userStorage = new UserStorage(this.model);

        // Get our user
        User user = userStorage.GetUserByEmail(email);

        // Check if we have a valid user
        if (user != null)

            // Create our custom user
            return new KCUserAdapter(ksession, realm, model, user);

        // Throw an exception if whe user was not obtained
        throw new RuntimeException("The user was not found");
    }
}