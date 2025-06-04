import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './CreditoNiveles/Funciones'
import * as FnTasasTipos from './CreditoTasaTipo/Funciones'
import * as FnEmpresas from '../../general/CompGeneral/Empresa/Funciones'
import * as FnAgrupacion from '../../bancos/CompBancos/BancoAgrupacion/Funciones'
import * as FnCuentasContables from '../../tesoreria/CompTesoreria/CatalogoCuentasContables/Funciones'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'

// Icons
import { FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner, ImgViewer } from '../../../../global'
import { CForm } from './CreditoNiveles/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import * as FnPersona from "../../catalogos/CompCatalogos/CatalogoDirectores/Funciones";
import { DescripcionDistribuidor } from '../../../../../global/variables'

type CatalogosType = {
    oidc: IOidc
}

const CreditoNiveles = (props: CatalogosType) => {
    let isMounted = React.useRef(true)
    const DatosDefecto = {
        EmpresaId: 0,
        Producto: '',
        Activo: false,
        TasaTipoId: '',
        DiasPago: '',
        DiaParaCorte: 0,
        PrioridadCobranza: 0,
        RequiereDistribuidor: false,
        RequiereGrupo: false,
        ValidaDisponible: false,
        Restructura: false,
        GeneraDesembolso: false,
        SeguroFinanciado: false,
        Canje: false,
        DesglosarIVA: false,
        EdadMinima: 0,
        EdadMaxima: 0,
        CapitalAlFinal: false,
        CargoFinanciado: false,
        CargoAlInicio: false,
        ActivaCredito: false,
        CreditosLiquidadosReq: false,
        PermisoEspecial: false,
        ValidarCondiciones: false,
        AplicaIVAInteres: false,
        AplicaIVASeguro: false,
        AplicaIVAManejoCuenta: false,
        AdicProductoId: '',
        CuentaMaestraId: 0,
        CtaCapitalId: '',
        CtaInteresNormalId: '',
        CtaInteresMoraId: '',
        CtaIvaId: '',
        CtaInteresNormDeudorId: '',
        CtaInteresNormAcreedorId: '',
        CtaInteresMoraDeudorId: '',
        CtaInteresMoraAcreedorId: '',
        Logo: '',
        file: null,
        NombreCompleto: "",
        PersonaResponsableId: 0,
    }
    const DatosDefecto2 = {
        DistribuidorNivel: '',
        PorcComisionBase: 0,
        CapitalColocadoMinimo: 0,
        CapitalColocadoMaximo: 0,
        ImporteProteccionSaldo: 0,
        importeMaxCanje: 0,
        maximoPrestamoPersonal: 0,
        maximoImporteCanjeCliente: 0,
        maximoImporteCanjeAval: 0
    }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optEmpresas: any[] = []
    const optTiposTasas: any[] = []
    const optProductos: any[] = []
    const optAgrupaciones: any[] = []
    const optCuentasContables: any[] = []
    const optPersona: any[] = [];
    const Personas: any[] = [];
    const DatosPersona: {} = {};
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Datos2: DatosDefecto2,
            Id: undefined
        },
        optProductos,
        optEmpresas,
        optTiposTasas,
        optAgrupaciones,
        optCuentasContables,

        isUpdate: false,
        optPersona,
        Personas,
        DatosPersona,
        DirectorID: 0,
    })

    const FNGetLocal = () => {
        /* setState(s => ({ ...s, Cargando: true })) */
        Funciones.GetLocal2(props.oidc)
            .then((respuesta: any) => {
                console.log("DATOS", respuesta)
                // if (isMounted.current === true) {
                var productos = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
                    return obj
                });

                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, optProductos: productos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [], optProductos: [] }))
                // }
            })
    }
    const FNGetProd = () => {
        /* setState(s => ({ ...s, Cargando: true })) */
        Funciones.GetProd(props.oidc)
            .then((respuesta: any) => {
                console.log("DATOS", respuesta)
                // if (isMounted.current === true) {
                var productos = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
                    return obj
                });

                setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, optProductos: productos }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, Cargando: false, Error: true, Datos: [], optProductos: [] }))
                // }
            })
    }

    const FnGetTasasTipos = () => {
        FnTasasTipos.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var tasatipo = respuesta.map((valor: any) => {
                    var obj = { value: valor.TasaTipoId, label: valor.TasaTipo };
                    return obj
                });

                setState(s => ({ ...s, optTiposTasas: tasatipo }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optTiposTasas: [] }))
                // }
            })
    }

    const FnGetEmpresas = () => {
        FnEmpresas.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var empresas = respuesta.map((valor: any) => {
                    var obj = { value: valor.empresaId, label: valor.empresaNombre };
                    return obj
                });

                setState(s => ({ ...s, optEmpresas: empresas }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optEmpresas: [] }))
                // }
            })
    }

    const FnGetAgrupacion = () => {
        FnAgrupacion.FNGet(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var agrupaciones = respuesta.map((valor: any) => {
                    var obj = { value: valor.AgrupacionID, label: valor.Descripcion };
                    return obj
                });

                setState(s => ({ ...s, optAgrupaciones: agrupaciones }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optAgrupaciones: [] }))
                // }
            })
    }

    const FnGetCuentasContables = () => {
        FnCuentasContables.FNGetContable(props.oidc)
            .then((respuesta: any) => {
                // if (isMounted.current === true) {

                var CuentasContables = respuesta.map((valor: any) => {
                    var obj = { value: valor.CuentaID, label: valor.Nombre };
                    return obj
                });

                setState(s => ({ ...s, optCuentasContables: CuentasContables }))
                // }
            })
            .catch(() => {
                // if (isMounted.current === true) {
                setState(s => ({ ...s, optCuentasContables: [] }))
                // }
            })
    }

    const fnGetPersona = (
        PersonaID: number,
        NombreCompleto: string,
        callback: any
    ) => {
        let Datos = { PersonaID, NombreCompleto }
        FnPersona.getByNameProd(props.oidc, Datos)
            .then((respuesta: any) => {

                var personas = respuesta.map((valor: any) => {
                    var obj = { value: valor.DirectorID, label: valor.NombreCompleto };
                    return obj;
                });
                setState((s) => ({ ...s, optPersona: personas, Personas: respuesta }));
                callback(personas);
            })
            .catch(() => {
                setState((s) => ({ ...s, optPersona: [], Personas: [] }));

                callback([]);
            });
    };

    const fnGetDatosPersona = (DirectorID?: number) => {
        let persona = state.Personas.find((Dato) => Dato.DirectorID === DirectorID);
        setState((s) => ({
            ...s,
            DatosPersona: persona ? persona : {},
            DirectorID: DirectorID as number,
        }));
    };

    useEffect(() => {
        fnGetDatosPersona(state.Form.Datos.PersonaResponsableId);
    }, [state.Form.Datos.PersonaResponsableId]);


    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'DistribuidorNivelID', sortable: true, },
                { name: 'Nivel', selector: 'DistribuidorNivel', sortable: true, },
                { name: 'Comision Base', selector: 'PorcComisionBase', sortable: true, },
                { name: 'Capital Minimo', selector: 'CapitalColocadoMinimo', sortable: true, },
                { name: 'Capital Maximo', selector: 'CapitalColocadoMaximo', sortable: true, },
                { name: 'Proteccion Saldo', selector: 'ImporteProteccionSaldo', sortable: true, },
                { name: 'Maximo Canje', selector: 'importeMaxCanje', sortable: true, },
                { name: 'Maximo Prestamo Personal', selector: 'maximoPrestamoPersonal', sortable: true, },
                { name: 'Maximo Canje Cliente ', selector: 'maximoImporteCanjeCliente', sortable: true, },
                { name: 'Maximo Canje Aval', selector: 'maximoImporteCanjeAval', sortable: true, },
                {
                    name: 'Acciones', sortable: false,
                    cell: (props) =>
                        <button title='Editar' className="asstext" type={"button"} onClick={() => {
                            console.log(props)
                            setState(s => ({
                                ...s,
                                Form: {
                                    ...s.Form,
                                    Mostrar: true,
                                    Datos2: {
                                        DistribuidorNivelID: props.DistribuidorNivelID,
                                        DistribuidorNivel: props.DistribuidorNivel,
                                        PorcComisionBase: props.PorcComisionBase,
                                        CapitalColocadoMinimo: props.CapitalColocadoMinimo,
                                        CapitalColocadoMaximo: props.CapitalColocadoMaximo,
                                        ImporteProteccionSaldo: props.ImporteProteccionSaldo,
                                        importeMaxCanje: props.importeMaxCanje,
                                        maximoPrestamoPersonal: props.maximoPrestamoPersonal,
                                        maximoImporteCanjeCliente: props.maximoImporteCanjeCliente,
                                        maximoImporteCanjeAval: props.maximoImporteCanjeAval
                                    },
                                    Id: props.DistribuidorNivelID
                                },
                                isUpdate: true
                            }))
                        }}>
                            <FaPencilAlt />
                        </button>
                },
            ]
        return colRet
    }, [])

    React.useEffect(() => {
        if (isMounted.current === true) {
            FNGetLocal()
            FnGetTasasTipos()
            FnGetEmpresas()
            FnGetAgrupacion()
            FnGetCuentasContables()
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) =>
        setState({
            ...state, Datos: [...state.Datos, item], Form: {
                ...state.Form, Mostrar: false,
                Datos2: DatosDefecto2
            }, isUpdate: false
        })

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState(s => ({
            ...s, Datos: state.Datos.map(Dato => Dato.DistribuidorNivelID === item.DistribuidorNivelID ? item : Dato), Form: {
                ...state.Form, Mostrar: false,
                Datos2: DatosDefecto2
            }, isUpdate: false
        }))

    /** funcion para cancelar la forma */
    const fnCancelar = () => setState(s => ({ ...s, Form: { ...state.Form, Mostrar: false, Datos: DatosDefecto }, isUpdate: false }))

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="Niveles Distribuidores">
                    <Card.Body>
                        <Card.Body.Content>
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                                <div>
                                    <DataTable
                                        subHeader
                                        subHeaderComponent=
                                        {
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control" placeholder="Buscar Nivel" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button title='Nuevo' className="btn btn-outline-secondary" type="button"
                                                            onClick={() => {
                                                                setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Datos2: DatosDefecto2, Id: undefined }, isUpdate: false })
                                                            }
                                                            }
                                                        ><FaPlus /></button>
                                                        <button title='Refrescar' className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        data={state.DatosMostrar}
                                        striped
                                        pagination
                                        dense
                                        noHeader
                                        responsive
                                        keyField={"ProductoID"}
                                        defaultSortField={"ProductoID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} xlarge={true} >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>
                                                {(state.Form.Id) ? "Editar Producto" : "Agregar Producto"}
                                            </h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            <CForm
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optEmpresas={state.optEmpresas}
                                                optTiposTasas={state.optTiposTasas}
                                                optProductos={state.optProductos}
                                                optAgrupaciones={state.optAgrupaciones}
                                                optCuentasContables={state.optCuentasContables}
                                                cbActualizar={cbActualizar}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                optPersona={state.optPersona}
                                                fnGetPersona={fnGetPersona}
                                                DatosPersona={state.DatosPersona}
                                                intialValues2={state.Form.Datos2}
                                            />
                                        </ModalWin.Body>
                                    </ModalWin>
                                </div>
                            }
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CreditoNiveles)