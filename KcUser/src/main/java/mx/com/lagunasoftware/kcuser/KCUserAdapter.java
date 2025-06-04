package mx.com.lagunasoftware.kcuser;

import java.util.List;
import java.util.Map;

import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.storage.adapter.AbstractUserAdapter;

public class KCUserAdapter extends AbstractUserAdapter {

    /** Local User */
    private final User user;

    /**
     * Creates a Custom Keycloak User
     * 
     * @param session              Session in which the user will live
     * @param realm                Realm on which the user is created
     * @param storageProviderModel Model
     * @param user                 User from which get the data
     */
    public KCUserAdapter(KeycloakSession session, RealmModel realm, ComponentModel storageProviderModel, User user) {
        super(session, realm, storageProviderModel);
        this.user = user;
    }

    @Override
    public String getUsername() {
        return this.user.getEmail();
    }

    @Override
    public String getFirstName() {
        return this.user.getName();
    }

    @Override
    public String getLastName() {
        return String.format("%s %s", this.user.getLastName(),
                this.user.getLastNameSecond() == null ? "" : this.user.getLastNameSecond());
    }

    @Override
    public String getEmail() {
        return this.user.getEmail();
    }

    @Override
    public boolean isEmailVerified() {
        return this.user.getValidated();
    }

    @Override
    public Map<String, List<String>> getAttributes() {

        // Generate an attribute array
        MultivaluedHashMap<String, String> attributes = new MultivaluedHashMap<>();

        // Map the basic user attributes
        attributes.add(UserModel.USERNAME, getUsername());
        attributes.add(UserModel.EMAIL, getEmail());
        attributes.add(UserModel.FIRST_NAME, getFirstName());
        attributes.add(UserModel.LAST_NAME, getLastName());

        // Map our custom user attribute
        attributes.add("MASTER", this.user.getMasterUser().toString().toUpperCase());

        return attributes;
    }
}
