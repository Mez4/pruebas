package com.fconfia.cv.usuarios;

import java.util.List;

import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.provider.ProviderConfigurationBuilder;
import org.keycloak.storage.UserStorageProviderFactory;

public class Fabrica implements UserStorageProviderFactory<Almacenamiento> {

    /// Configuration Keys
    public static final String CONFIG_KEY__SERVER = "CONFIG_KEY__SERVER";
    public static final String CONFIG_KEY__DB = "CONFIG_KEY__DB";
    public static final String CONFIG_KEY__PORT = "CONFIG_KEY__PORT";
    public static final String CONFIG_KEY__USER = "CONFIG_KEY__USER";
    public static final String CONFIG_KEY__PASSWORD = "CONFIG_KEY__PASSWORD";

    /** This value holds the configuration for this Provider */
    protected final List<ProviderConfigProperty> configMetadata;

    /** Horse-Factory */
    public Fabrica() {

        // Configuration MetaData
        configMetadata = ProviderConfigurationBuilder.create()

                // Hostname of our server/container
                .property()
                .name(CONFIG_KEY__SERVER)
                .label("JDBC HOST [MSSQL]")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("localhost")
                .helpText("IP o Dominio del servidor/contenedor")
                .add()

                // TCP-Port
                .property()
                .name(CONFIG_KEY__PORT)
                .label("Puerto [MSSQL]")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("1433")
                .helpText("Puerto TCP para la conexion")
                .add()

                // DB
                .property()
                .name(CONFIG_KEY__DB)
                .label("Base dedatos")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("")
                .helpText("Base de datos para usar")
                .add()

                // User
                .property()
                .name(CONFIG_KEY__USER)
                .label("Usuario")
                .type(ProviderConfigProperty.STRING_TYPE)
                .defaultValue("sa")
                .helpText("Usuario para la conexión")
                .add()

                // Password
                .property()
                .name(CONFIG_KEY__PASSWORD)
                .label("Contraseña")
                .type(ProviderConfigProperty.PASSWORD)
                .defaultValue("")
                .helpText("Contraseña")
                .add()

                // Build our configuration
                .build();
    }

    @Override
    public Almacenamiento create(KeycloakSession ksession, ComponentModel model) {
        return new Almacenamiento(ksession, model);
    }

    @Override
    public String getId() {
        return "kcu_confia";
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
        return this.configMetadata;
    }
}
