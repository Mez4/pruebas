import React, { useEffect, useState } from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../global/ModalWin'
import * as Funciones from './CatalogoGestoresCobranza/Funciones'

//import * as FnCatTipoDocumento from '../../catalogos/CompCatalogos/CatalogoGestoresCobranza/Funciones'


// Icons
import { FaPencilAlt, FaPlus, FaSearch, FaCircle } from 'react-icons/fa'


// Custom components
import { Card, Spinner } from '../../../../global'
import { CFormConfirmar } from './CatalogoGestoresCobranza/CFormConfirmar'
import { CFormUpd } from './CatalogoGestoresCobranza/CFormUpd'
import { CForm } from './CatalogoGestoresCobranza/CForm'
import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { PropsNotForwarded } from '../../../../../node_modules_local/react-csv/lib/metaProps'
import { toast } from 'react-toastify'


type CatalogosType = {
    oidc: IOidc
}

const CatalogoGestoresCobranza = (props: CatalogosType) => {
    // Controll our mounted state
    let isMounted = React.useRef(true)
    const [valido, setValido] = useState(true)

    const DatosDefecto = { PersonaID: 0, NombreCompleto: '', MesaCobranzaID: 0, mesaCobranza: '', Activo: true, MesaAnteriorId:0 }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optProdMesa: any[] = []
    const optPersonas: any[] = []
    const optVivienda: any[] = []
    const optGestores :  any[] = []
    
    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        optProdMesa,
        optPersonas,
        optGestores,
        optVivienda,
        Filtro: '',
        Cargando: true,
        Error: false,
        Form:
        {
            Mostrar: false,
            MostrarE: false,
            Datos: DatosDefecto,
            Id: undefined
        }
    })

    const validacion = () => {
        setState(s => ({...s, Cargando:true}))
        Funciones.FNValidacionAltaGestorCobranza(props.oidc, true).then((respuesta) => {
            console.log('ES valido', respuesta);
            setState(s => ({...s, Cargando:false}))
            setValido(true);

        }).catch((error:any) => {
             console.log('Es un error');
             setState(s => ({...s, Cargando:false}))
             setValido(false)
        })
    }    


    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                console.log(isMounted.current)
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))
               
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
                
            })
    }
    

    const FnGetMesaCredito = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetMesaCobranza(props.oidc)
            .then((respuesta: any) => {
                var MesaCredito = respuesta.map((valor: any) => {
                    var obj = { value: valor.MesaCobranzaID, label: valor.MesaCobranzaDesc };
                    return obj

                });

                setState(s => ({ ...s, optProdMesa: MesaCredito }))
            })
            .catch(() => {
                setState(s => ({ ...s, optProdMesa: [] }))
            })
    }

    const FnGetPersonas = () => {
        setState(s => ({ ...s }))
        Funciones.FnGetGestores(props.oidc)
            .then((respuesta: any) => {
                var personas = respuesta.map((valor: any) => {
                    var obj = { value: valor.PersonaID, label: valor.NombreCompleto };
                    return obj

                });
                let personasFiltro =  personas.filter((obj, pos) => {
                    return personas.map(mapObj => mapObj.value).indexOf(obj.value) === pos;
                })
                
                setState(s => ({ ...s, optPersonas: personasFiltro }))
            })
            .catch(() => {
                setState(s => ({ ...s, optPersonas: [] }))
            })
    }

    const gestoresMesa = () => {
        setState((s) => ({ ...s }));
        Funciones.getGestoresMesa(props.oidc)
          .then((respuesta: any) => {
            var Gestores = respuesta.map((valor: any) => {
              var obj = {
                value: valor.GestorCobranzaID,
                label: [valor.NombreCompleto, ' - ', valor.ExternoDesc]
              };
              return obj;
            });
            let Gestoresregistrados = Gestores.filter((obj, pos, arr) => {
              return (
                Gestores.map((mapObj) => mapObj.value).indexOf(obj.value) === pos
              );
            });
            setState((s) => ({ ...s, optGestores: Gestoresregistrados }));
          })
          .catch(() => {
            setState((s) => ({ ...s, optGestores:[] }));
          });
      };
      

    const Columns = React.useMemo(() => {

        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'Id',
                    selector: 'PersonaID',
                    sortable: true,
                    // width:'30%'
                },

                {
                    name: 'Nombre Completo',
                    selector: 'NombreCompleto',
                    sortable: true,
                    // center: true,
                    cell: (props) =>

                        <span >
                            {props.NombreCompleto}
                        </span>
                },
                {
                    name: 'Mesa Cobranza',
                    selector: 'mesaCobranza',
                    sortable: true,
                    // center: true,
                    // cell: (props) =>

                    //     <span >
                    //         {props.mesaCredito.Nombre}
                    //     </span>
                },
                {
                    name: 'Tipo de gestor',
                    selector: 'Tipo de gestor',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Externo ? <strong style={{color:"orange"}}>Externo</strong> : <strong style={{color:"blue"}}>Interno</strong>}</span>
                },
                {
                    name: 'Activo',
                    selector: 'Activo',
                    sortable: true,
                    center: true,
                    cell: (props) => <span>{props.Activo ? <FaCircle color="green" title="Activo" /> : <FaCircle color="red" title="Inactivo" />}</span>
                },
                {
                    name : 'Acciones',
                    selector:"Acciones",
                    sortable : false,
                    center: true,
                    // omit: valido == false,
                    cell:(props) => (
                        <button
                        className="asstext"
                        type={"button"}
                        onClick={() =>{ setState(s => ({...s,
                        Form: {...state.Form, MostrarE:true, 
                                Datos:{PersonaID: props.PersonaID, NombreCompleto: props.NombreCompleto, MesaCobranzaID: props.MesaCobranzaID, mesaCobranza: props.mesaCobranza, Activo: props.Activo, MesaAnteriorId:props.MesaCobranzaID}
                                }
                                // setValues(s => [...s, {...s, MesaCobranzaIdOld : props.initialValues.MesaCobranzaID} ])
                        }))
                        }}
                        >
                            <FaPencilAlt /> 
                        </button>
                    )
                },
            ]
        return colRet
    }, [state.Form])

    useEffect(() => {
        // validacion()
    }, [])
    // Use effect
    React.useEffect(() => {

        FNGetLocal()
        FnGetMesaCredito()
        FnGetPersonas()
        gestoresMesa()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    // On use effect
    React.useEffect(() => {
        setState(s => ({ ...s, DatosMostrar: FiltrarDatos(s.Datos, Columns, state.Filtro) }))
        // eslint-disable-next-line
    }, [state.Datos, state.Filtro])

    // /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, MostrarE: false, Datos: { PersonaID: 0, NombreCompleto: '', MesaCobranzaID: 0, mesaCobranza: '', Activo: true, MesaAnteriorId:0 } } })
    }

    // /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.PersonaID === item.PersonaID ? item : Dato), Form: { ...state.Form, Mostrar: false, MostrarE: false, Datos: { PersonaID: 0, NombreCompleto: '', MesaCobranzaID: 0, mesaCobranza: '', Activo: true, MesaAnteriorId:0 } } })
    /** funcion para cancelar la forma */
    const fnCancelar = () => setState({ ...state, Form: { ...state.Form, Mostrar: false, MostrarE: false } })

    const fnCFormConfirmar = () => setState({ ...state, Form: { ...state.Form, Mostrar: true } })
    const fnCFormEditar = () => setState({...state, Form:{...state.Form, MostrarE: true}})

    const fnValidacion = (valida:boolean) => {
        // Funciones.FNValidacionAltaGestorCobranza(props.oidc,valida)
        //     .then((respuesta: any) => {
                setState({ ...state, Form: { Mostrar: true,MostrarE: false, Datos: DatosDefecto, Id: undefined } })
            // })
            // .catch((error: any) => {
            //     if (error.response)
            //         toast.error(`Response Error: ${error.response.data}`)
            //     else if (error.request)
            //         toast.error(`Request ${error}`)
            //     else
            //         toast.error(`${error}`)
            // })
    }

    return (
        <div className="row">
            <div className="col-12">
                <Card Title="GESTORES DE COBRANZA">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Gestor" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />


                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        {valido &&
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => fnValidacion(false)}
                                                        ><FaPlus />
                                                        </button>
                                        }

                                                        <button className="btn btn-outline-secondary" type="button" onClick={() => FNGetLocal()}><FiRefreshCcw /></button>
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
                                        keyField={"PersonaID"}
                                        defaultSortField={"PersonaID"}
                                        columns={Columns}
                                    />
                                    <ModalWin open={state.Form.Mostrar} center large >
                                        <ModalWin.Header>
                                            <h5 className={MODAL_TITLE_CLASS}>AGREGAR GESTOR</h5>
                                            {/* <button type="button" className="delete" onClick={fnCancelar}></button> */}
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {
                                                <CFormConfirmar
                                                oidc={props.oidc}
                                                initialValues={state.Form.Datos}
                                                Id={state.Form.Id}
                                                optPersonas={state.optPersonas}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
                                                fnCFormConfirmar={fnCFormConfirmar}
                                                FNGetLocal={FNGetLocal}
                                            />
                                            }

                                        </ModalWin.Body>
                                    </ModalWin>

                                    <ModalWin open={state.Form.MostrarE} center large>
                                        <ModalWin.Header>
                                        <h5 className={MODAL_TITLE_CLASS}>EDITAR GESTOR</h5>
                                        </ModalWin.Header>
                                        <ModalWin.Body>
                                            {<CFormUpd
                                                oidc={props.oidc}
                                                id={state.Form.Id}
                                                initialValues={state.Form.Datos}
                                                // optProdMesa={state.optProdMesa}
                                                optPersonas={state.optPersonas}
                                                cbGuardar={cbAgregar}
                                                fnCancelar={fnCancelar}
                                                cbActualizar={cbActualizar}
                                                
                                            ></CFormUpd>}
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
export default connect(mapStateToProps, mapDispatchToProps)(CatalogoGestoresCobranza);
