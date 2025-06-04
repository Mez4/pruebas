export namespace DBConfia_Prospectos {
        
    export interface IDocumentos {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idTipoDocumento: number
      
        idMesaCredito: number
      
        ruta: string
      
        status: string
      
        idDistribuidora?: number
      
        motivo?: string

    }
    export interface IDocumentosRegresados {
              
        id: number
      
        idDocumento: number
      
        observacion: string
      
        fechaCreacion?: string

    }
    export interface IDocumentosRequeridos {
              
        id: number
      
        claveTipoDocumento: string
      
        status: string

    }
    export interface IDomicilio {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idMesaCredito: number
      
        calle: string
      
        numeroInterior?: string
      
        numeroExterior: string
      
        idAsentamiento: number
      
        localidad: string
      
        cp?: string
      
        idMunicipio?: number
      
        idEstado?: number

    }
    export interface IEgresos {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idMesaCredito: number
      
        tipoGastoVivienda: string
      
        alimentacion: number
      
        tarjetaCreido: number
      
        rentaPagoVivienda: number
      
        serviciosDomesticos: number
      
        otros: number
      
        egresoTotal: number

    }
    export interface IEmpresasExperiencia {
              
        id: number
      
        descripcion: string
      
        status: string

    }
    export interface IEstadoBuro {
              
        id: number
      
        idEstado: number
      
        abreviaturaBuro: string

    }
    export interface IEstatusVivienda {
              
        id: number
      
        descripcion: string
      
        status: string

    }
    export interface IExperienciaVentas {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idMesaCredito: number
      
        idEmpresa: number
      
        fechaIngreso: string
      
        limiteCredito: number
      
        creditoDisponible: number
      
        status: string

    }
    export interface IInformacionLaboral {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idMesaCredito: number
      
        tipoPersona: string
      
        empresa: string
      
        idOcupacion: number
      
        sueldo: number
      
        antiguedad: string
      
        telefono: string
      
        calle: string
      
        numeroInterior: string
      
        numeroExterior: string
      
        idAsentamiento: number
      
        idMunicipio: number
      
        localidad: string
      
        cp: string

    }
    export interface IInformacionOtraVivienda {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        idTipoVivienda: number
      
        idMesaCredito: number
      
        idEstado: number
      
        idMunicipio: number
      
        idAsentamiento: number
      
        calle: string
      
        localidad: string
      
        numero: string
      
        direccion: string
      
        valorAproximado: number
      
        cp: string
      
        status: string

    }
    export interface IInformacionVivienda {
              
        id: number
      
        idPersona: number
      
        idMesaCredito: number
      
        idTipoPersona: number
      
        idTipoVivienda: number
      
        tieneOtraVivienda: string
      
        numeroPersonasHabitan: string
      
        valorAproximado: number

    }
    export interface IIngresos {
              
        id: number
      
        idPersona: number
      
        idMesaCredito: number
      
        idTipoPersona: number
      
        ingresoSueldo: number
      
        gananciasDV: number
      
        ingresoConyuge: number
      
        otrosIngresos: number
      
        ingresoTotal: number

    }
    export interface IPromotorProspecto {
              
        creditoPromotorID: number
      
        ProspectoID: number
      
        Reasignar?: boolean

    }
    export interface IProspectos {
              
        id: number
      
        nombre: string
      
        segundoNombre: string
      
        primerApellido: string
      
        segundoApellido: string
      
        fechaNacimiento: string
      
        resultadoBuroCredito: string
      
        idUsuario: number
      
        idConsulta: number
      
        idSucursal: number
      
        idMesaCredito: number
      
        comoSeEntero: string
      
        idSexo: string
      
        curp: string
      
        rfc: string
      
        correo: string
      
        telefono: string
      
        celular: string
      
        idEstadoCivil: string
      
        dependientesEconomicos: number
      
        nombreConyuge: string
      
        primerApellidoConyuge: string
      
        segundoApellidoConyuge: string
      
        tieneAutoMoto: string
      
        tieneDependientes: string
      
        tieneExperiencia: string
      
        statusProceso?: string
      
        status?: string
      
        fechaCreacion: string
      
        fechaUltimaActualizacion?: string

    }
    export interface IReferencias {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        numeroReferencia: number
      
        nombre: string
      
        primerApellido: string
      
        segundoApellido: string
      
        parentesco: string
      
        celular: string
      
        domicilio: string
      
        edad: string
      
        status?: string
      
        idDistribuidora?: number

    }
    export interface IRelacionAutoMoto {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        modelo: string
      
        marca: string
      
        status: string

    }
    export interface IRelacionProspectoDistribuidora {
              
        id: number
      
        idProspecto: number
      
        idDistribuidora: number
      
        fechaActualizacion?: string
      
        fechaCreacion?: string

    }
    export interface IStatusProceso {
              
        id: number
      
        descripcion: string
      
        status: string

    }
    export interface ITipoDocumento {
              
        id: number
      
        clave: string
      
        orden: number
      
        status: string

    }
    export interface ITipoPersona {
              
        id: number
      
        clave: string
      
        descripcion: string

    }
    export interface ITipoVivienda {
              
        id: number
      
        descripcion: string
      
        status: string

    }
    export interface ITuberia {
              
        id: number
      
        idPersona: number
      
        idTipoPersona: number
      
        proceso: string
      
        resultado: string

    }
    export interface IUsuariosPermitidos {
              
        id: number
      
        idUsuario: number

    }
    export interface IUsuarioSucursal {
              
        id: number
      
        idUsuario: number
      
        idSucursal: number

    }
}