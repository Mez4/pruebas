package com.fconfia.cv.cls;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;

import org.keycloak.component.ComponentModel;
import org.mindrot.jbcrypt.BCrypt;

public class UsuarioDaoManejador implements UsuarioDao {

    /** MSSQL Database connection variable */
    private Connection con;

    /** Logger Instance */
    private static final Logger log = LoggerFactory.getLogger(UsuarioDaoManejador.class);

    /** JDBC Connection string to our application */
    private final String MSSQL_CONNECTION_STRING;

    /** JDBC User */
    private final String MSSQL_USER;

    /** JDBC Password */
    private final String MSSQL_PASSWORD;

    private static final String COLUMNAS = "UsuarioID, Usuario, Nombre, Correo, Bloqueado, Validacion, MasterUser, SystemUser, SupportUser, PersonaPersonaID, PersonaNombre, PersonaApellidoPaterno, PersonaApellidoMaterno, PersonaTelefonoMovil, empresaId, empresaNombre, ProductoId, Producto, GrupoId, DistribuidorValidado, AccesoAppVales, AccesoAppCobranza, DistribuidorID, GestorCobranzaID";
    private static final String QUERY_BASE = String.format("SELECT %s FROM Seguridad.UsuariosVW", COLUMNAS);

    /** Parse the user from the MSSQL-View */
    private Usuario parseUser(ResultSet pRS) {
        try {
            Usuario usuario = new Usuario(
                    pRS.getInt("UsuarioID"),
                    pRS.getString("Usuario"),
                    pRS.getString("Nombre"),
                    pRS.getString("Correo"),
                    pRS.getBoolean("Bloqueado"),
                    pRS.getBoolean("Validacion"),
                    pRS.getBoolean("MasterUser"),
                    pRS.getBoolean("SystemUser"),
                    pRS.getBoolean("SupportUser"),
                    pRS.getLong("PersonaPersonaID"),
                    pRS.getString("PersonaNombre"),
                    pRS.getString("PersonaApellidoPaterno"),
                    pRS.getString("PersonaApellidoMaterno"),
                    pRS.getString("PersonaTelefonoMovil"),
                    pRS.getInt("empresaId"),
                    pRS.getString("empresaNombre"),
                    pRS.getString("Producto"),
                    pRS.getInt("ProductoId"),
                    pRS.getInt("GrupoId"),
                    pRS.getBoolean("DistribuidorValidado"),
                    pRS.getBoolean("AccesoAppVales"),
                    pRS.getBoolean("AccesoAppCobranza"),
                    pRS.getInt("DistribuidorID"),
                    pRS.getInt("GestorCobranzaID"));
            return usuario;
        } catch (Exception e) {
            log.error(String.format("Error while parsing the user {}", e.getMessage()));
            return null;
        }
    }

    public UsuarioDaoManejador(ComponentModel config) {

        // Details
        this.MSSQL_USER = config.get(Variables.CONFIG_KEY__USER);
        this.MSSQL_PASSWORD = config.get(Variables.CONFIG_KEY__PASSWORD);
        this.MSSQL_CONNECTION_STRING = String.format("jdbc:sqlserver://%s:%s;DatabaseName=%s;integratedSecurity=false;",
                config.get(Variables.CONFIG_KEY__SERVER),
                config.get(Variables.CONFIG_KEY__PORT),
                config.get(Variables.CONFIG_KEY__DB));
    }

    @Override
    public Usuario obtenerPorUsuario(String pUsuario) {

        try {

            // Configuramos nuestro query
            String query = String.format(QUERY_BASE + " WHERE Usuario = ?");

            // Initialize our connection
            this.con = DriverManager.getConnection(MSSQL_CONNECTION_STRING, MSSQL_USER, MSSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(query);

            // Set our variables
            statement.setString(1, pUsuario);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Read our values into our user variable
            Usuario user = parseUser(rs);

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

    @Override
    public Usuario obtenerPorCorreo(String pCorreo) {

        try {

            // Configuramos nuestro query
            String query = String.format(QUERY_BASE + " WHERE Correo = ?");

            // Initialize our connection
            this.con = DriverManager.getConnection(MSSQL_CONNECTION_STRING, MSSQL_USER, MSSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(query);

            // Set our variables
            statement.setString(1, pCorreo);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Read our values into our user variable
            Usuario user = parseUser(rs);

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

    @Override
    public boolean validarContrasena(String pUsuario, String pContrasena) {

        try {

            // Configuramos nuestro query
            String query = String.format("SELECT Contrasena FROM Seguridad.UsuariosVW WHERE Usuario = ?");

            // Initialize our connection
            this.con = DriverManager.getConnection(MSSQL_CONNECTION_STRING, MSSQL_USER, MSSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(query);

            // Set our variables
            statement.setString(1, pUsuario);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            rs.next();

            // Obtenemos el usuario de la base de datos
            String contrasenaBD = rs.getString("Contrasena");

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            log.info("Query de la base de datos");
            log.info(contrasenaBD);

            log.info("Password del usuario");
            log.info(pContrasena);

            // Validamos
            return BCrypt.checkpw(pContrasena, contrasenaBD);

        } catch (Exception ge) {

            // Mostrar en consola
            log.info(ge.getMessage());

            // Regresamos null
            return false;
        }
    }

    @Override
    public int cantidad() {

        try {

            // Find User Query
            String countQuery = String.format("SELECT COUNT(0) FROM Seguridad.UsuariosVW__V2");

            // Initialize our connection
            this.con = DriverManager.getConnection(MSSQL_CONNECTION_STRING, MSSQL_USER, MSSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(countQuery);

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

        } catch (Exception ge) {

            // Mostrar en consola
            log.info(ge.getMessage());

            // Regresamos null
            return 0;
        }
    }

    @Override
    public List<Usuario> obtenerPaginado(int pPrimerRegistro, int pUltimoRegistro) {

        try {

            // LOG THE INFO
            log.info("Obteniendo usuarios con CustomStorageSPI");

            // GET THE USERS
            List<Usuario> usuarios = new ArrayList<Usuario>();

            // Configuramos nuestro query
            String query = String.format(QUERY_BASE + " ORDER BY UsuarioID OFFSET %d ROWS FETCH NEXT %d ROWS ONLY",
                    pPrimerRegistro, pUltimoRegistro);

            // Initialize our connection
            this.con = DriverManager.getConnection(MSSQL_CONNECTION_STRING, MSSQL_USER, MSSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(query);

            log.info(query);

            // // Details
            // statement.setInt(1, pPrimerRegistro);
            // statement.setInt(2, pPrimerRegistro);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            log.info("Registros:");

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            while (rs.next()) {
                usuarios.add(parseUser(rs));
            }

            // Close the ResultSet and the connection
            rs.close();
            con.close();

            // Return our uset
            return usuarios;

        } catch (Exception ge) {

            // Mostrar en consola
            log.info(ge.getMessage());

            // Regresamos null
            return Collections.emptyList();
        }
    }

    @Override
    public List<Usuario> buscarUsuario(String pBusqueda, int pCantidad) {

        try {

            // Usuarios
            List<Usuario> usuarios = new ArrayList<Usuario>();

            // Configuramos nuestro query
            String query = QUERY_BASE
                    + " WHERE Email LIKE %?% OR Nombre LIKE %?% ORDER BY UsuarioID OFFSET 0 ROWS FETCH NEXT ? ROWS ONLY";

            // Initialize our connection
            this.con = DriverManager.getConnection(MSSQL_CONNECTION_STRING, MSSQL_USER, MSSQL_PASSWORD);

            // Prepare qour query execution
            PreparedStatement statement = con.prepareStatement(query);

            // Set our variables
            statement.setString(1, pBusqueda);
            statement.setString(2, pBusqueda);
            statement.setInt(3, pCantidad);

            // Get our Result's Set
            ResultSet rs = statement.executeQuery();

            // Move to the next result row (this will only work if we have some value, on a
            // Exception it will go to the catch method)
            while (rs.next()) {
                usuarios.add(parseUser(rs));
            }

            // Regresamos el listado
            return usuarios;

        } catch (Exception ge) {

            // Mostrar en consola
            log.info(ge.getMessage());

            // Regresamos null
            return Collections.emptyList();
        }
    }
}