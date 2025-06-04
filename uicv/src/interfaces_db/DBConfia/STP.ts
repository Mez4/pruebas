export namespace DBConfia_STP {
        
    export interface ICatalogoCausasDevolucion {
              
        CausaDevolucionID: number
      
        Clave: number
      
        Descripcion: string
      
        Abreviatura: string

    }
    export interface ICatalogoEstadoCobranza {
              
        EstadoCobranzaID: number
      
        Clave: string
      
        Estado: string
      
        Descripcion: string

    }
    export interface ICatalogoEstadoDispersion {
              
        EstadoDispersionID: number
      
        Clave: string
      
        Estado: string
      
        Descripcion: string

    }
    export interface ICatalogoEstadoTraspasos {
              
        EstadoTraspasoID: number
      
        Clave: string
      
        Estado: string
      
        Descripcion: string

    }
    export interface ICatalogoInstituciones {
              
        InstitucionID: number
      
        Clave: number
      
        Participante: string

    }
    export interface ICatalogoPlazas {
              
        PlazaID: number
      
        NumeroPlaza: string
      
        Nombre: string

    }
    export interface ICatalogoRespuestaRegistraOrden {
              
        RespuestaID: number
      
        Clave: string
      
        Descripcion: string

    }
    export interface ICatalogoTipoCuenta {
              
        TipoCuentaID: number
      
        Clave: number
      
        Descripcion: string

    }
    export interface ICatalogoTipoPago {
              
        TipoPagoID: number
      
        Clave: number
      
        Descripcion: string

    }
    export interface IConciliacionV2 {
              
        ConciliacionID: number
      
        FechaConsulta: string
      
        FechaOperativa: string
      
        UsuarioConsulta: number

    }
    export interface IConciliacionV2Detalle {
              
        ConciliacionDetalleID: number
      
        ConciliacionID: number
      
        idEF: number
      
        claveRastreo?: string
      
        claveRastreoDevolucion?: string
      
        conceptoPago?: string
      
        cuentaBeneficiario?: string
      
        cuentaOrdenante?: string
      
        empresa?: string
      
        estado?: string
      
        fechaOperacion: string
      
        institucionContraparte?: string
      
        institucionOperante?: string
      
        medioEntrega: string
      
        monto: string
      
        nombreBeneficiario?: string
      
        nombreOrdenante?: string
      
        nombreCep?: string
      
        rfcCep?: string
      
        sello?: string
      
        rfcCurpBeneficiario?: string
      
        referenciaNumerica: string
      
        rfcCurpOrdenante?: string
      
        tipoCuentaBeneficiario: string
      
        tipoCuentaOrdenante: string
      
        tsCaptura: string
      
        tsLiquidacion: string
      
        causaDevolucion?: string
      
        urlCEP?: string

    }
    export interface IConsultaOrdenes {
              
        OrdenID: number
      
        UsuarioID: number
      
        FechaRegistro: string
      
        TipoConsulta: number
      
        FechaConsultada?: string

    }
    export interface IConsultaOrdenesDetalle {
              
        OrdenDetalle: number
      
        OrdenID: number
      
        CLavePago?: string
      
        ClaveRastreo?: string
      
        ConceptoPago?: string
      
        CuentaBeneficiario?: string
      
        CuentaOrdenante?: string
      
        Empresa?: string
      
        Estado?: string
      
        FechaOperacion?: string
      
        FolioOrigen?: string
      
        IdCliente?: string
      
        IdEf?: string
      
        InstitucionContraparte?: number
      
        InstitucionOperante?: number
      
        MedioEntrega?: number
      
        Monto?: number
      
        NombreBeneficiario?: string
      
        NombreOrdenante?: string
      
        Prioridad?: number
      
        ReferenciaNumerica?: string
      
        CurpRfcBeneficiario?: string
      
        CurpRfcOrdenante?: string
      
        TipoCuentaBeneficiario?: number
      
        TipocuentaOrdenante?: number
      
        TipoPago?: number
      
        Topologia?: string
      
        TsCaptura?: string
      
        Usuario?: string

    }
    export interface IConsultaOrdenesDetalle_VW {
              
        OrdenDetalle: number
      
        OrdenID: number
      
        CLavePago?: string
      
        ClaveRastreo?: string
      
        ConceptoPago?: string
      
        CuentaBeneficiario?: string
      
        CuentaOrdenante?: string
      
        Empresa?: string
      
        Estado?: string
      
        FechaOperacion?: string
      
        FolioOrigen?: string
      
        IdCliente?: string
      
        IdEf?: string
      
        InstitucionContraparte?: number
      
        InstitucionOperante?: number
      
        MedioEntrega?: number
      
        Monto?: number
      
        NombreBeneficiario?: string
      
        NombreOrdenante?: string
      
        Prioridad?: number
      
        ReferenciaNumerica?: string
      
        CurpRfcBeneficiario?: string
      
        CurpRfcOrdenante?: string
      
        TipoCuentaBeneficiario?: number
      
        TipocuentaOrdenante?: number
      
        TipoPago?: number
      
        Topologia?: string
      
        TsCaptura?: string
      
        Usuario?: string
      
        TipoCuentaBeneficiarioDesc?: string
      
        TipoCuentaOrdenanteDesc?: string
      
        InstitucionContraparteDesc?: string
      
        InstitucionOperanteDesc?: string

    }
    export interface IDispersiones {
              
        DispersionID: number
      
        ClaveDispersionSTP: number
      
        ClaveRastreo: string
      
        ConceptoPago: string
      
        CuentaBeneficiario: string
      
        CuentaOrdenante: string
      
        Empresa: string
      
        FechaOperacion: string
      
        FechaRegistro: string
      
        FechaActualizacion?: string
      
        Firma: string
      
        FolioOrigen: string
      
        InstitucionContraparte: number
      
        InstitucionOperante: number
      
        Monto: number
      
        NombreBeneficiario: string
      
        NombreOrdenante: string
      
        ReferenciaNumerica: string
      
        CurpRfcBeneficiario: string
      
        CurpRfcOrdenante: string
      
        TipoCuentaBeneficiario: number
      
        TipoCuentaOrdenante: number
      
        TipoPago: number
      
        UsuarioDispersaID: number
      
        ClaveEstatus?: string
      
        CausaDevolucion?: string
      
        CreditoID: number
      
        BancoClaveSTP?: number

    }
    export interface IDispersiones_VW {
              
        DispersionID: number
      
        ClaveDispersionSTP: number
      
        ClaveRastreo: string
      
        ConceptoPago: string
      
        CuentaBeneficiario: string
      
        CuentaOrdenante: string
      
        Empresa: string
      
        FechaOperacion: string
      
        FechaRegistro: string
      
        FechaActualizacion?: string
      
        Firma: string
      
        FolioOrigen: string
      
        InstitucionContraparte: number
      
        InstitucionOperante: number
      
        Monto: number
      
        NombreBeneficiario: string
      
        NombreOrdenante: string
      
        ReferenciaNumerica: string
      
        CurpRfcBeneficiario: string
      
        CurpRfcOrdenante: string
      
        TipoCuentaBeneficiario: number
      
        TipoCuentaOrdenante: number
      
        TipoPago: number
      
        UsuarioDispersaID: number
      
        ClaveEstatus?: string
      
        CausaDevolucion?: string
      
        CreditoID: number
      
        BancoClaveSTP?: number
      
        EstadoDispersionID?: number
      
        Capital?: number
      
        NombreCompleto?: string
      
        ClaveEstatusDisp?: string
      
        EstadoDisp?: string
      
        DescripcionDisp?: string
      
        ClaveTipoCuenta?: number
      
        DescripcionTipoCuenta?: string
      
        ClaveBanco?: number
      
        BancoNombre?: string

    }
    export interface ILogEventos {
              
        EventoID: number
      
        TipoEventoID: number
      
        Origen?: string
      
        IP?: string
      
        FechaRegistro: string
      
        BodyRequest?: string

    }
    export interface ISaldosCuentas {
              
        SaldoCuentaID: number
      
        Cuenta: string
      
        Saldo: number
      
        CargosPendientes: number
      
        FechaConsulta: string

    }
    export interface ITipoEvento {
              
        TipoEventoID: number
      
        Descripcion: string

    }
}