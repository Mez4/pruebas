package mx.com.lagunasoftware.kcuser;

import java.util.List;

import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;
import org.keycloak.storage.UserStorageProviderFactory;

public class KCUserProviderFactory implements UserStorageProviderFactory<KCUserProvider> {

    /** Our Factory providerId */
    public static final String PROVIDER_ID = "kcuser";

    /** This value holds the configuration for this Provider */
    protected final List<ProviderConfigProperty> configurationMetadata;

    /** Constructor for our Factory */
    public KCUserProviderFactory() {
        configurationMetadata = ProviderConfigurationBuilder.create()

                // Hostname of our server/container
                .property()
                .name(Variables.CONFIG_KEY__SERVER)
                .label("JDBC HOST for MySQL")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("localhost")
                .helpText("IP or Hostname of the server/container")
                .add()

                // TCP-Port
                .property()
                .name(Variables.CONFIG_KEY__PORT)
                .label("MySQL's PORT")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("3306")
                .helpText("TCP Port for connection")
                .add()

                // DB
                .property()
                .name(Variables.CONFIG_KEY__DB)
                .label("MySQL's Database")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("")
                .helpText("Database to use")
                .add()

                // User
                .property()
                .name(Variables.CONFIG_KEY__USER)
                .label("User to connect to MySQL")
                .type(ProviderConfigProperty.PASSWORD)
                .defaultValue("root")
                .helpText("Security User")
                .add()

                // Password
                .property()
                .name(Variables.CONFIG_KEY__PASSWORD)
                .label("Password of our user")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("")
                .helpText("Security Password")
                .add()

                // Build our configuration
                .build();
    }

    @Override
    public KCUserProvider create(KeycloakSession session, ComponentModel model) {
        return new KCUserProvider(session, model);
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getHelpText() {
        return "KCUser Storage project";
    }

    @Override
    public void close() {
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        return this.configurationMetadata;
    }
}