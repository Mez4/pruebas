import React from 'react'
import { ModalWin, AsistenteFormik } from '../../../../../global'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'

// Formik
// import * as Yup from 'yup'
import * as Funciones from './Funciones'
import { FormasProspecto } from '../../../../../formas'
import { DBConfia_Prospeccion } from '../../../../../../interfaces_db/DBConfia/Prospeccion'

/** Tipo de nuestro componente */
type FormaAgregarTipo = {

    // Basico
    oidc: IOidc
    Id?: number,
    Item?: DBConfia_Prospeccion.IProspectosDatosSocioeconomicos_VW,
    Vehiculos?: DBConfia_Prospeccion.IRelacionAutoMoto[],
    Experiencia?: DBConfia_Prospeccion.IProspectosExperienciaVentas_VW[],

    // Callbacks
    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,

    // Modal controls
    mostrar: boolean,
}
/**
 * Forma para agregar un usuario en el sistema (Debe de incluir una persona por defecto)
 * @param (FormaAgregarTipo) props Propiedades del control
 */
export const AgregarCaptura = (props: FormaAgregarTipo) => {
    const [Vehiculos, setVehiculos] = React.useState([] as object[])
    const [Experiencia, setExperiencia] = React.useState([])

    const actualizaVehiculos = (lol) => {
        console.log('lol', lol)
        setVehiculos(lol)
    }

    const actualizaExperiencia = (lol) => {
        console.log('cat', lol)
        setExperiencia(lol)
    }
    // Render our component 
    return (
        <ModalWin open={props.mostrar} large>
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    {props.Id ? `Continuar Alta` : "Error"}
                </h5>
            </ModalWin.Header>
            <ModalWin.Body>
                <AsistenteFormik
                    MostrarPasos={true}
                    Pasos={[
                        FormasProspecto.FormaDatosVivienda({ Prefijo: 'ProspectoPersona_', Titulo: 'Vivienda', SubTitulo: 'Información de Vivienda', Habitantes: props.Item?.numeroPersonasHabitan, TieneOtraVivienda: props.Item?.TieneOtraVivienda, TipoViviendaID: props.Item?.TipoViviendaID, TipoOtraViviendaID: props.Item?.TipoOtraViviendaID, AsentID: props.Item?.AsentamientoID, BC: props.Item?.EstatusConsultaBuroID }),
                        FormasProspecto.FormaDatosEconomicosIE({ Prefijo: 'ProspectoPersona_', Titulo: 'Ingresos/Egresos', SubTitulo: 'Información de Ingresos y egresos', DependientesEconomicos: props.Item?.DependientesEconomicos }),
                        FormasProspecto.FormaDatosEconomicosAuto({ Prefijo: 'ProspectoPersona_', Titulo: 'Auto/Moto', SubTitulo: 'Información de vehiculos', accion: actualizaVehiculos, Vehs: props.Vehiculos, TieneVeh: props.Item?.tieneAutoMoto }),
                        FormasProspecto.FormaDatosEconomicosExVentas({ Prefijo: 'ProspectoPersona_', Titulo: 'Experiencia en Ventas', SubTitulo: 'Información de experiencia en ventas', accion: actualizaExperiencia, Exps: props.Experiencia, TieneExp: props.Item?.tieneExperiencia }),
                        FormasProspecto.FormaDatosTipoDv({ Prefijo: 'ProspectoPersona_', Titulo: 'Tipo Socio(a)', SubTitulo: 'Indicar Tipo de Socio(a) para el origen del Prospecto', TipoDvID: props.Item?.DistribuidorTiposID }),
                    ]}

                    // Provisionar esta variable para mostrar datos de edicion
                    Datos={{
                        ProspectoPersona_RFC: props.Item?.RFC
                        , ProspectoPersona_ValorVivienda: props.Item?.valorAproximado
                        , ProspectoPersona_HabitantesVivienda: props.Item?.numeroPersonasHabitan
                        , ProspectoPersona_TipoViviendaID: props.Item?.TipoViviendaID
                        , ProspectoPersona_OtraVivienda: props.Item?.TieneOtraVivienda
                        , ProspectoPersona_ValorOtraVivienda: props.Item?.valorAproximadoOtra
                        , ProspectoPersona_TipoOtraViviendaID: props.Item?.TipoOtraViviendaID
                        , ProspectoPersona_AsentamientoIDOtraVivienda: props.Item?.AsentamientoID
                        , ProspectoPersona_CalleOtraVivienda: props.Item?.calle
                        , ProspectoPersona_LocalidadOtraVivienda: props.Item?.localidad
                        , ProspectoPersona_NumeroExteriorOtraVivienda: props.Item?.numeroExterior
                        //-----------------------------------------------------------
                        , ProspectoPersona_IngresoSueldo: props.Item?.ingresoSueldo
                        , ProspectoPersona_IngresoGananciasDV: props.Item?.gananciasDV
                        , ProspectoPersona_IngresoConyuge: props.Item?.ingresoConyuge
                        , ProspectoPersona_IngresoOtro: props.Item?.otrosIngresos
                        , ProspectoPersona_EgresoAlimentacion: props.Item?.AlimetacionEgreso
                        , ProspectoPersona_EgresoTarjeta: props.Item?.TarjetasEgreso
                        , ProspectoPersona_EgresoVivienda: props.Item?.RentaPagoViviendaEgreso
                        , ProspectoPersona_EgresosServiciosDomesticos: props.Item?.ServiciosDomesticosEgreso
                        , ProspectoPersona_EgresoOtros: props.Item?.OtroEgreso
                        , ProspectoPersona_EgresoDependientes: props.Item?.DependientesEconomicos
                        //-----------------------------------------------------------
                        , ProspectoPersona_TieneAutoMoto: props.Item?.tieneAutoMoto//(props.Vehiculos?.length ?? 0) > 0 ? 'true' : 'false'
                        //-----------------------------------------------------------
                        , ProspectoPersona_TieneExperiencia: props.Item?.tieneExperiencia
                        //-----------------------------------------------------------
                        , ProspectoPersona_DistribuidorTiposID: props.Item?.DistribuidorTiposID
                    }}

                    // Personalizacion [Botones]
                    CLASE__BOTONES__DIV={'d-grid gap-2 d-md-flex justify-content-md-end'}
                    CLASE__BOTONES__CANCELAR={'btn btn-danger btn-sm'}
                    CLASE__BOTONES__TERMINAR={'btn btn-confia btn-sm'}
                    CLASE__BOTONES__SIGUIENTE={'btn btn-confia btn-sm'}
                    CLASE__BOTONES__ANTERIOR={'btn btn-warning btn-sm'}

                    // Personalizacion [Listado]
                    CLASE__LISTADO_PASOS__PROGRESO={'bg-info'}
                    CLASE__LISTADO_PASOS__TERMINADO={'bg-success'}
                    CLASE__LISTADO_PASOS__LI__TITULO={`card-title mb-0`}

                    // Funciones
                    FN__CANCELAR={props.fnCancelar}
                    PROMESA__PROCESAR={(Datos: any) => {

                        const DatosEconomicos = {
                            prospectoID: props.Id,
                            rfc: Datos.ProspectoPersona_RFC,
                            tipoViviendaID: parseInt(Datos.ProspectoPersona_TipoViviendaID),
                            habitantes: parseInt(Datos.ProspectoPersona_HabitantesVivienda),
                            valorAproxVivienda: parseFloat(Datos.ProspectoPersona_ValorVivienda),
                            otraVivienda: Datos.ProspectoPersona_OtraVivienda === 'true',
                            valorAproxOtra: parseFloat(Datos.ProspectoPersona_ValorOtraVivienda) || 0,
                            tipoOtraViviendaID: parseInt(Datos.ProspectoPersona_TipoOtraViviendaID) || 0,
                            asentamientoIDOtra: parseInt(Datos.ProspectoPersona_AsentamientoIDOtraVivienda) || 0,
                            calleOtraVivienda: Datos.ProspectoPersona_CalleOtraVivienda,
                            localidadOtraVivienda: Datos.ProspectoPersona_LocalidadOtraVivienda,
                            numeroOtraVivienda: Datos.ProspectoPersona_NumeroExteriorOtraVivienda,

                            ingresoSueldo: parseFloat(Datos.ProspectoPersona_IngresoSueldo),
                            ingresoGananciasDV: parseFloat(Datos.ProspectoPersona_IngresoGananciasDV),
                            ingresoConyuge: parseFloat(Datos.ProspectoPersona_IngresoConyuge),
                            ingresoOtro: parseFloat(Datos.ProspectoPersona_IngresoOtro),
                            egresoAlimentacion: parseFloat(Datos.ProspectoPersona_EgresoAlimentacion),
                            egresotarjetas: parseFloat(Datos.ProspectoPersona_EgresoTarjeta),
                            egresoVivienda: parseFloat(Datos.ProspectoPersona_EgresoVivienda),
                            egresoDomestico: parseFloat(Datos.ProspectoPersona_EgresosServiciosDomesticos),
                            egresoOtros: parseFloat(Datos.ProspectoPersona_EgresoOtros),
                            dependientesEconomicos: parseInt(Datos.ProspectoPersona_EgresoDependientes),

                            tieneVehiculo: Datos.ProspectoPersona_TieneAutoMoto.toString() === 'true',
                            vehiculos: Vehiculos,

                            tieneExperiencia: Datos.ProspectoPersona_TieneExperiencia.toString() === 'true',
                            experiencias: Experiencia,

                            distribuidorTipoID: parseInt(Datos.ProspectoPersona_DistribuidorTiposID),
                        }

                        console.log('??', Datos)
                        console.log('Vehicles', Vehiculos)
                        console.log('Exp', Experiencia)
                        console.log('Item', props.Item)

                        // Regresamos la nueva promesa
                        if (!props.Item?.TipoVivienda)
                            return Funciones.FNAgregarDatosEconomicos(props.oidc, { ...DatosEconomicos })
                        else
                            return Funciones.FNEditarDatosEconomicos(props.oidc, { ...DatosEconomicos })
                        //return new Promise(() => null) //Funciones.FNAgregar(props.oidc, Datos)
                    }}
                    // {
                    //return new Promise((resolve, reject) => {
                    //    alert(JSON.stringify(Datos))
                    //   reject('DEBUG')
                    // })
                    // }
                    // }
                    FN__LIMPIAR={(Datos: any, DatosPromesa: any) => props.cbGuardar(DatosPromesa)}
                    FN__ERROR={(error) => {
                        if (error.response)
                            alert(`Response Error: ${JSON.stringify(error.response)}`)
                        else if (error.request)
                            alert(`Request ${error}`)
                        else
                            alert(`${error}`)
                    }}
                />
            </ModalWin.Body>
        </ModalWin>
    )
}
