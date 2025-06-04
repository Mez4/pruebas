package com.fconfia.cv.cls;

import java.util.List;

public interface UsuarioDao {

    Usuario obtenerPorUsuario(String Usuario);

    Usuario obtenerPorCorreo(String Correo);

    boolean validarContrasena(String Usuario, String Contrasena);

    int cantidad();

    List<Usuario> obtenerPaginado(int PrimerRegistro, int UltimoRegistro);

    List<Usuario> buscarUsuario(String Busqueda, int Cantidad);
}