package com.fconfia.cv.usuarios;

import java.util.List;
import java.util.Map;

import com.fconfia.cv.cls.Usuario;

import org.keycloak.common.util.MultivaluedHashMap;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.storage.adapter.AbstractUserAdapter;

public class UsuarioAbstracto extends AbstractUserAdapter {

    /** Propiedades basicas de un usuario para keycloak */
    private final Integer id;
    private final String usuario;
    private final String correo;
    private final String nombre;
    private final boolean bloqueado;
    private final boolean validacion;

    /** Propiedades basicas de un usuario para keycloak */
    private final Integer empresaId;
    private final String empresaNombre;
    private final String Producto;
    private final Integer ProductoId;
    private final Integer GrupoId;

    /** Atributos para la authenticación de nuestros usuarios */
    private final boolean masterUser;
    private final boolean systemUser;
    private final boolean supportUser;

    /* Acceso de app */
    private final boolean DistribuidorValidado;
    private final boolean AccesoAppVales;
    private final boolean AccesoAppCobranza;

    /* Id del distribuidor */
    private final Integer DistribuidorID;
    private final Integer GestorCobranzaID;

    /** Attributos del objeto de persona */
    private final String objetoPersona;

    /** Clase del usuario */
    private UsuarioAbstracto(KeycloakSession session, RealmModel realm, ComponentModel storageProviderModel,
            Usuario pUsuario) {

        // Support our class
        super(session, realm, storageProviderModel);

        // Definimos las propiedades basicas de nuestro usuario
        this.id = pUsuario.getUsuarioID();
        this.usuario = pUsuario.getUsuario();
        this.correo = pUsuario.getCorreo();
        this.nombre = pUsuario.getNombre();
        this.bloqueado = pUsuario.getBloqueado();
        this.validacion = pUsuario.getValidacion();

        // Detalle de empreas
        this.empresaId = pUsuario.getEmpresaId();
        this.empresaNombre = pUsuario.getEmpresaNombre();
        this.Producto = pUsuario.getProducto();
        this.ProductoId = pUsuario.getProductoId();
        this.GrupoId = pUsuario.getGrupoId();

        // Definimos los permisos
        this.masterUser = pUsuario.getMasterUser();
        this.systemUser = pUsuario.getSystemUser();
        this.supportUser = pUsuario.getSupportUser();

        // Accesos app
        this.DistribuidorValidado = pUsuario.getDistribuidorValidado();
        this.AccesoAppVales = pUsuario.getAccesoAppVales();
        this.AccesoAppCobranza = pUsuario.getAccesoAppCobranza();
        this.DistribuidorID = pUsuario.getDistribuidorID();
        this.GestorCobranzaID = pUsuario.getGestorCobranzaID();

        // Define
        this.objetoPersona = String.format(
                "{ \"Id\":%s, \"Nombre\":\"%s\", \"ApellidoPaterno\":\"%s\", \"ApellidoMaterno\":\"%s\", \"TelefonoMovil\":\"%s\" }",
                pUsuario.getPersonaPersonaID(), pUsuario.getPersonaNombre(), pUsuario.getPersonaApellidoPaterno(),
                pUsuario.getPersonaApellidoPaterno(), pUsuario.getPersonaTelefonoMovil());
    }

    // ################################################
    // Información basica del usuario
    // ################################################

    public Integer getUsuarioId() {
        return this.id;
    }

    @Override
    public boolean isEmailVerified() {
        return this.validacion;
    }

    @Override
    public String getUsername() {
        return usuario;
    }

    @Override
    public String getFirstName() {
        return nombre;
    }

    @Override
    public String getLastName() {
        return "";
    }

    @Override
    public String getEmail() {
        return correo;
    }

    @Override
    public boolean isEnabled() {
        return !this.bloqueado;
    }

    // ################################################
    // Roles pricipales
    // ################################################

    public boolean getMasterUser() {
        return this.masterUser;
    }

    public boolean getSystemUser() {
        return this.systemUser;
    }

    public boolean getSupportUser() {
        return this.supportUser;
    }

    // ################################################
    // Empresas... LEO
    // ################################################
    public Integer getEmpresaId() {
        return this.empresaId;
    }

    public String getEmpresaNombre() {
        return this.empresaNombre;
    }

    public String getProducto() {
        return this.Producto;
    }

    public Integer getProductoId() {
        return this.ProductoId;
    }

    public Integer getGrupoId() {
        return this.GrupoId;
    }

    public Integer getDistribuidorID() {
        return this.DistribuidorID;
    }

    // ################################################
    // Apps... LEO
    // ################################################
    public Boolean getDistribuidorValidado() {
        return this.DistribuidorValidado;
    }

    public Boolean getAccesoAppVales() {
        return this.AccesoAppVales;
    }

    public Boolean getAccesoAppCobranza() {
        return this.AccesoAppCobranza;
    }

    public Integer getGestorCobranzaID() {
        return this.GestorCobranzaID;
    }

    // ################################################
    // Información de la persona
    // ################################################
    @Override
    public Map<String, List<String>> getAttributes() {
        MultivaluedHashMap<String, String> attributes = new MultivaluedHashMap<>();

        // Agregamos los atributos basicos del usuario
        attributes.add(UserModel.USERNAME, getUsername());
        attributes.add(UserModel.EMAIL, getEmail());
        attributes.add(UserModel.FIRST_NAME, getFirstName());
        attributes.add(UserModel.LAST_NAME, getLastName());
        attributes.add(UserModel.LOCALE, "es");

        // Agregamos los roles basicos como atributos
        attributes.add("UsuarioId", String.valueOf(getUsuarioId()));
        attributes.add("MasterUser", String.valueOf(getMasterUser()));
        attributes.add("SystemUser", String.valueOf(getSystemUser()));
        attributes.add("SupportUser", String.valueOf(getSupportUser()));
        attributes.add("UsuarioID", String.valueOf(getUsuarioId()));

        // Atributos de empresa
        attributes.add("empresaId", String.valueOf(getEmpresaId()));
        attributes.add("empresaNombre", String.valueOf(getEmpresaNombre()));
        attributes.add("Producto", String.valueOf(getProducto()));
        attributes.add("ProductoId", String.valueOf(getProductoId()));
        attributes.add("GrupoId", String.valueOf(getGrupoId()));

        attributes.add("DistribuidorValidado", String.valueOf(getDistribuidorValidado()));
        attributes.add("AccesoAppVales", String.valueOf(getAccesoAppVales()));
        attributes.add("AccesoAppCobranza", String.valueOf(getAccesoAppCobranza()));
        attributes.add("DistribuidorID", String.valueOf(getDistribuidorID()));
        attributes.add("GestorCobranzaID", String.valueOf(getGestorCobranzaID()));

        // Agregamos el objeto de la persona
        attributes.add("Persona", this.objetoPersona);

        // Regresamos los atributos
        return attributes;
    }

    static class Builder {

        // Detalle de sesión de keycloak
        private final KeycloakSession session;
        private final RealmModel realm;
        private final ComponentModel storageProviderModel;

        // Mapeamos el usuario
        private Usuario usuario;

        // Constructor
        Builder(KeycloakSession session, RealmModel realm, ComponentModel storageProviderModel, Usuario pUsuario) {
            this.session = session;
            this.realm = realm;
            this.storageProviderModel = storageProviderModel;
            this.usuario = pUsuario;
        }

        // Build
        UsuarioAbstracto build() {
            return new UsuarioAbstracto(session, realm, storageProviderModel, usuario);
        }
    }
}