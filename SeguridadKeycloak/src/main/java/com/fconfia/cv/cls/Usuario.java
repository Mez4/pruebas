package com.fconfia.cv.cls;

public class Usuario {

    public Usuario(Integer pUsuarioID, String pUsuario, String pNombre, String pCorreo, boolean pBloqueado,
            boolean pValidacion, boolean pMasterUser, boolean pSystemUser, boolean pSupportUser,
            long pPersonaPersonaID, String pPersonaNombre,
            String pPersonaApellidoPaterno, String pPersonaApellidoMaterno, String pPersonaTelefonoMovil,
            Integer pEmpresaId, String pEmpresaNombre, String pProducto, Integer pProductoId, Integer pGrupoId,
            Boolean pDistribuidorValidado, Boolean pAccesoAppVales, Boolean pAccesoAppCobranza,
            Integer pDistribuidorID, Integer pGestorCobranzaID) {

        // User data
        this.usuarioId = pUsuarioID;
        this.usuario = pUsuario;
        this.nombre = pNombre;
        this.correo = pCorreo;
        this.bloqueado = pBloqueado;
        this.validacion = pValidacion;

        // System users
        this.masterUser = pMasterUser;
        this.systemUser = pSystemUser;
        this.supportUser = pSupportUser;

        // Datos de persona
        this.empresaId = pEmpresaId;
        this.empresaNombre = pEmpresaNombre;
        this.Producto = pProducto;
        this.ProductoId = pProductoId;
        this.GrupoId = pGrupoId;

        // Detalle de JSON
        this.personaPersonaID = pPersonaPersonaID;
        this.personaNombre = pPersonaNombre;
        this.personaApellidoPaterno = pPersonaApellidoPaterno;
        this.personaApellidoMaterno = pPersonaApellidoMaterno;
        this.personaTelefonoMovil = pPersonaTelefonoMovil;

        // Detalle...
        this.DistribuidorValidado = pDistribuidorValidado;
        this.AccesoAppVales = pAccesoAppVales;
        this.AccesoAppCobranza = pAccesoAppCobranza;

        // Detalle del distribuidorId
        this.DistribuidorID = pDistribuidorID;
        this.GestorCobranzaID = pGestorCobranzaID;
    }

    // #########################################
    // UsuarioID
    // #########################################
    private final Integer usuarioId;

    public Integer getUsuarioID() {
        return this.usuarioId;
    }

    // #########################################
    // Usuario
    // #########################################
    private final String usuario;

    public String getUsuario() {
        return usuario;
    }

    // #########################################
    // Nombre
    // #########################################
    private final String nombre;

    public String getNombre() {
        return this.nombre;
    }

    // #########################################
    // Correo
    // #########################################
    private final String correo;

    public String getCorreo() {
        return this.correo;
    }

    // #########################################
    // Bloqueado
    // #########################################
    private final Boolean bloqueado;

    public Boolean getBloqueado() {
        return this.bloqueado;
    }

    // #########################################
    // Bloqueado
    // #########################################
    private final Boolean validacion;

    public Boolean getValidacion() {
        return this.validacion;
    }

    // #########################################
    // MasterUser
    // #########################################
    private final Boolean masterUser;

    public Boolean getMasterUser() {
        return this.masterUser;
    }

    // #########################################
    // SystemUser
    // #########################################
    private final Boolean systemUser;

    public Boolean getSystemUser() {
        return this.systemUser;
    }

    // #########################################
    // SupportUser
    // #########################################
    private final Boolean supportUser;

    public Boolean getSupportUser() {
        return this.supportUser;
    }

    // #########################################
    // EmpresaId
    // #########################################
    private final Integer empresaId;

    public Integer getEmpresaId() {
        return this.empresaId;
    }

    // #########################################
    // EmpresaNombre
    // #########################################
    private final String empresaNombre;

    public String getEmpresaNombre() {
        return this.empresaNombre;
    }

    // #########################################
    // Producto
    // #########################################
    private final String Producto;

    public String getProducto() {
        return this.Producto;
    }

    // #########################################
    // ProductoId
    // #########################################
    private final Integer ProductoId;

    public Integer getProductoId() {
        return this.ProductoId;
    }

    // #########################################
    // GrupoId
    // #########################################
    private final Integer GrupoId;

    public Integer getGrupoId() {
        return this.GrupoId;
    }

    // #########################################
    // DistribuidorValidado
    // #########################################
    private final Boolean DistribuidorValidado;

    public Boolean getDistribuidorValidado() {
        return this.DistribuidorValidado;
    }

    // #########################################
    // AccesoAppVales
    // #########################################
    private final Boolean AccesoAppVales;

    public Boolean getAccesoAppVales() {
        return this.AccesoAppVales;
    }

    // #########################################
    // AccesoAppCobranza
    // #########################################
    private final Boolean AccesoAppCobranza;

    public Boolean getAccesoAppCobranza() {
        return this.AccesoAppCobranza;
    }

    // #########################################
    // Detalle de persona, JSON
    // #########################################
    private final long personaPersonaID;

    public long getPersonaPersonaID() {
        return this.personaPersonaID;
    }

    // #########################################
    // DistribuidorId
    // #########################################
    private final Integer DistribuidorID;

    public Integer getDistribuidorID() {
        return this.DistribuidorID;
    }

    // #########################################
    // GestorCobranzaID
    // #########################################
    private final Integer GestorCobranzaID;

    public Integer getGestorCobranzaID() {
        return this.GestorCobranzaID;
    }

    private final String personaNombre;

    public String getPersonaNombre() {
        return this.personaNombre;
    }

    private final String personaApellidoPaterno;

    public String getPersonaApellidoPaterno() {
        return this.personaApellidoPaterno;
    }

    private final String personaApellidoMaterno;

    public String getPersonaApellidoMaterno() {
        return this.personaApellidoMaterno;
    }

    private final String personaTelefonoMovil;

    public String getPersonaTelefonoMovil() {
        return this.personaTelefonoMovil;
    }
}