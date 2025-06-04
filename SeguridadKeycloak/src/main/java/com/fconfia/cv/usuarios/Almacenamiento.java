package com.fconfia.cv.usuarios;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.fconfia.cv.cls.Usuario;
import com.fconfia.cv.cls.UsuarioDao;
import com.fconfia.cv.cls.UsuarioDaoManejador;

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

// Clase de almacenamiento de usuarios
public class Almacenamiento implements UserStorageProvider,
        UserLookupProvider,
        CredentialInputValidator,
        UserQueryProvider
// ,
// CredentialInputUpdater,
// CredentialAuthentication
{

    // ########################################
    // Varaibles de la clase
    // ########################################
    private static final Logger log = LoggerFactory.getLogger(Almacenamiento.class);
    private final KeycloakSession session;
    private final ComponentModel model;
    private final UsuarioDao uManejador;

    // ########################################
    // Constructor de nuestra clase
    // ########################################
    public Almacenamiento(KeycloakSession session, ComponentModel model) {
        this.session = session;
        this.model = model;
        this.uManejador = new UsuarioDaoManejador(model);
    }

    // ########################################
    // UserStorageProvider
    // ########################################
    // Inicio

    // OnClose, logeamos la acción
    @Override
    public void close() {
        log.info("[I30] close()");
    }

    // Fin
    // ########################################
    // UserStorageProvider
    // ########################################

    // ########################################
    // User Lookup provider
    // ########################################
    // Inicio

    // Obtenemos nuestro usuario por el correo
    @Override
    public UserModel getUserByEmail(String pCorreo, RealmModel realm) {

        // Logeamos la acción
        log.info("[I48] getUserByEmail({})", pCorreo);

        try {

            // Obenemos nuestro usuario por email
            Usuario usuario = uManejador.obtenerPorCorreo(pCorreo);

            // Validamos si pudimos obtener el usuario
            if (usuario == null)
                return null;

            // Regresamos nuestro nuevo usuario
            return new UsuarioAbstracto.Builder(session, realm, model, usuario).build();
        } catch (Exception ex) {
            log.info("Error al obtener el usuario");
            return null;
        }
    }

    // Obtenemos nuestro usuario por el nombre de usaurio
    @Override
    public UserModel getUserByUsername(String pUsuario, RealmModel realm) {

        // Logeamos la acción
        log.info("[I41] getUserByUsername({})", pUsuario);

        // Obtenemos la conexión a la base de datos
        try {

            // Usuario
            Usuario usuario = uManejador.obtenerPorUsuario(pUsuario);

            // Validamos si pudimos obtener el usuario
            if (usuario == null)
                return null;

            // Regresamos nuestro nuevo usuario
            return new UsuarioAbstracto.Builder(session, realm, model, usuario).build();

        } catch (Exception ex) {
            log.info("Error al obtener el usuario");
            return null;
        }
    }

    // Fin
    // ########################################
    // User Lookup provider
    // ########################################

    // ########################################
    // CredentialInputValidator
    // ########################################
    // Inicio

    // Validamos el tipo de credenciales aceptadas por esta clase
    @Override
    public boolean supportsCredentialType(String credentialType) {

        // Logeamos la información
        log.info("[I57] supportsCredentialType({})", credentialType);

        // Agregmos soporte para OTP y password
        return PasswordCredentialModel.TYPE.endsWith(credentialType);
    }

    // Validamos el tipo de credenciales aceptadas por el usaurio
    @Override
    public boolean isConfiguredFor(RealmModel realm, UserModel user, String credentialType) {

        // Logeamos la acción
        log.info("[I57] isConfiguredFor(realm={},user={},credentialType={})", realm.getName(), user.getUsername(),
                credentialType);

        // Return our supported credentials
        return supportsCredentialType(credentialType);
    }

    // Validación de las credenciales del usuario
    @Override
    public boolean isValid(RealmModel realm, UserModel user, CredentialInput credentialInput) {

        // Logeamos en nuestro servidor
        log.info("[I57] isValid(realm={},user={},credentialInput.type={})", realm.getName(), user.getUsername(),
                credentialInput.getType());

        // Validamos si nuestro servicio soporta tipo de credencial
        if (!this.supportsCredentialType(credentialInput.getType())) {
            return false;
        }

        // Obtenemos el Id del almacenamiento
        StorageId sid = new StorageId(user.getId());

        // Obtenemos el nombre de usuario
        String username = sid.getExternalId();

        // log.info(String.format("[I57] Usuario :: %s", username));

        // Obtenemos la conexion
        try {

            // Logeamos algo de info
            log.info(String.format("GetCredentialInput :: %s", credentialInput.getChallengeResponse()));
            log.info("GetCredentialId :: " + credentialInput.getCredentialId());

            // Limpiamos el cache de nuestro usuario
            if (user instanceof CachedUserModel) {
                ((CachedUserModel) user).invalidate();
            }

            // Validamos nuestro password
            return uManejador.validarContrasena(username, credentialInput.getChallengeResponse());

        } catch (Exception ex) {

            // On error
            log.info("Error :: " + ex.getMessage());
            return false;
        }
    }

    // Fin
    // ########################################
    // CredentialInputValidator
    // ########################################

    // ########################################
    // UserQueryProvider
    // ########################################
    // Inicio

    // Obtenemos un usuario por el Id
    @Override
    public UserModel getUserById(String id, RealmModel realm) {

        // Session
        this.model.getName();

        // Logeamos la accion
        log.info("[I35] getUserById({})", id);

        // Obtenemos el Id
        StorageId sid = new StorageId(id);

        // Obtenemos el usuario por userName
        return getUserByUsername(sid.getExternalId(), realm);
    }

    // UserQueryProvider implementation
    @Override
    public int getUsersCount(RealmModel realm) {
        log.info("[I93] getUsersCount: realm={}", realm.getName());
        try {
            // Validamos nuestro password
            return uManejador.cantidad();

        } catch (Exception ex) {

            log.info("Error: " + ex.getMessage());
            return 0;
        }
    }

    // Obtenemos los usuarios
    @Override
    public List<UserModel> getUsers(RealmModel realm) {
        return getUsers(realm, 0, 250000); // Keep a reasonable maxResults
    }

    // Obtenemos los usaurios
    @Override
    public List<UserModel> getUsers(RealmModel realm, int firstResult, int maxResults) {

        // Logeamos la información
        log.info("[I113] getUsers: realm={}", realm.getName());

        // Obtenemos la conexion de base de datos
        try {

            // Generamos el query para consultar los usuarios
            List<UserModel> usuarios = new ArrayList<UserModel>();

            // Obtenemos los usuarios de la BD
            List<Usuario> usuariosBD = uManejador.obtenerPaginado(firstResult, maxResults);
            for (Usuario u : usuariosBD)
                usuarios.add(new UsuarioAbstracto.Builder(session, realm, model, u).build());

            // Regresamos los usuarios
            return usuarios;

        } catch (Exception ex) {

            // Logeamos el error
            log.info("Database error:" + ex.getMessage());
            return null;
        }
    }

    @Override
    public List<UserModel> searchForUser(String search, RealmModel realm) {
        return searchForUser(search, realm, 0, 5000);
    }

    @Override
    public List<UserModel> searchForUser(String search, RealmModel realm, int firstResult, int maxResults) {
        log.info("[I139] searchForUser: realm={}", realm.getName());

        try {

            // Generamos el query para consultar los usuarios
            List<UserModel> usuarios = new ArrayList<UserModel>();

            // Obtenemos los usuarios de la BD
            List<Usuario> usuariosBD = uManejador.buscarUsuario(search, maxResults);
            for (Usuario u : usuariosBD)
                usuarios.add(new UsuarioAbstracto.Builder(session, realm, model, u).build());

            // Regresamos los usuarios
            return usuarios;

        } catch (Exception ex) {

            // Logeamos el error
            log.info("Database error:" + ex.getMessage());
            return null;
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
    public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group, int firstResult, int maxResults) {
        return Collections.emptyList();
    }

    @Override
    public List<UserModel> getGroupMembers(RealmModel realm, GroupModel group) {
        return Collections.emptyList();
    }

    @Override
    public List<UserModel> searchForUserByUserAttribute(String attrName, String attrValue, RealmModel realm) {
        return Collections.emptyList();
    }

    // Fin
    // ########################################
    // UserQueryProvider
    // ########################################

    // Fin
    // ########################################
    // UserQueryProvider
    // ########################################

    // Fin
    // ########################################
    // UserQueryProvider
    // ########################################
}
