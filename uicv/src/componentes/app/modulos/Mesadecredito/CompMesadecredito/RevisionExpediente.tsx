import React, { useState } from 'react'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../interfaces/oidc/IOidc'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import * as Funciones from './RevisionExpediente/Funciones'


// Icons
import {  FaPencilAlt, FaPlus, FaSearch } from 'react-icons/fa'

// Custom components
import { Card, Spinner } from '../../../../global'

import { FiRefreshCcw } from 'react-icons/fi'
import { FiltrarDatos } from '../../../../../global/functions'
import { FcApproval, FcAssistant, FcBriefcase, FcBusinessman, FcCallback, FcCallTransfer, FcCheckmark, FcClock, FcDocument, FcFile, FcFinePrint, FcHeadset, FcInspection } from 'react-icons/fc'


import { FormaAsignacion } from './RevisionExpediente/FormaAsignacion'
import { FormaNotas } from './RevisionExpediente/FormaNotas'
import { FormaTiempo } from './RevisionExpediente/FormaTiempos'
import { FormaDocumento } from './RevisionExpediente/FormaDocumento' 
import { FormaReferenciaTitular } from './RevisionExpediente/FormaReferenciaTitular'
import { FromaReferenciaAval } from './RevisionExpediente/FromaReferenciaAval'
import { FormaVerificaTitular } from './RevisionExpediente/FormaVerificaTitular' 
import { FormaVerificaAval } from './RevisionExpediente/FormaVerificaAval' 
import { FormaDictamen } from './RevisionExpediente/FormaDictamen'
import { FormaConsolidacion } from './RevisionExpediente/FormaConsolidacion' 

import * as FnAnalista from '../../general/CompGeneral/Analistas/Funciones'



type CatalogosType = {
    oidc: IOidc
    SolicitudMesaCreditoID :0
}
const RevisionExpediente = (props: CatalogosType) => {
 

    // Controll our mounted state
    let isMounted = React.useRef(true)

    // Basic variables
    const DatosDefecto = { UsuarioID: '',MesaCreditoID : 0, PersonaID : 0,Activa: false }
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optAnalistas: any[] = []
    const optDistribuidoresNiveles: any[] = [] 
    const optDistribuidoresEstatus: any[] = [] 
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
            Id: undefined
        },
        FormaAsignacion: false ,
        FormaNotas:false,
        FormaTiempo:false,
        FormaDocumento:false ,
        FormaReferenciaTitular : false ,
        FromaReferenciaAval :false ,
        FormaVerificaTitular :false ,
        FormaVerificaAval :false ,
        FormaDictamen : false ,
        FormaConsolidacion : false , 
        Item: undefined,
        Id:0,
        optAnalistas,
        optDistribuidoresNiveles,
        optDistribuidoresEstatus, 
        analistaselected :0,
     
    })

    const fnCancelar = () => setState(s => ({ ...s, FormaAsignacion: false,FormaNotas :false,FormaTiempo:false ,FormaDocumento:false ,FormaReferenciaTitular :false ,FromaReferenciaAval:false ,FormaVerificaTitular:false,FormaVerificaAval:false,FormaDictamen:false ,FormaConsolidacion :false }))

    const fnAsignacion = (Item: any) => setState(s => ({ ...s, FormaAsignacion: true, Item} ))

    const fnNotas = (Item: any) => setState(s => ({ ...s, FormaNotas: true,Item }))

    const fnTiempos =  (Item: any) => setState(s => ({ ...s, FormaTiempo: true,Item}))

    const fnDocumentos = (Item: any) => setState(s => ({ ...s, FormaDocumento: true,Item} ))

    const fnReferenciaTitular = (Item: any) => setState(s => ({ ...s, FormaReferenciaTitular: true,Item}))

    const fnReferenciaAval = (Item: any) => setState(s => ({ ...s, FromaReferenciaAval: true,Item}))

    const fnVerificaTitular = (Item: any) => setState(s => ({ ...s, FormaVerificaTitular: true,Item}))

    const fnVerificaAval = (Item: any) => setState(s => ({ ...s, FormaVerificaAval: true,Item}))

    const fnDictamen = (Item: any) => setState(s => ({ ...s, FormaDictamen: true,Item}))

    const fnConsolidacion =  (Item: any) => setState(s => ({ ...s, FormaConsolidacion: true,Item}))
    
    



    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        Funciones.FNGet(props.oidc)
            .then((respuesta: any) => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta }))

                }

              
            })
            .catch(() => {
                if (isMounted.current === true) {
                    setState(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
                }
            })
    }


    const FnGetAnalista = () => {
        FnAnalista.FNGet(props.oidc)
            .then((respuesta: any) => {
                var analistas = respuesta.map((valor: any) => {
                    var obj = { value: valor.analistaID, label: valor.analista };
                    return obj
                });
                setState(s => ({ ...s, optAnalistas: analistas }))
            })
            .catch(() => {       
                setState(s => ({ ...s, optAnalistas: [] }))
            })
    }
    const FnDistribuidoresNiveles = () => {
        FnAnalista.FNGetDistribuidoresNiveles(props.oidc)
            .then((respuesta: any) => {
                var DistribuidoresNiveles = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidorNivelID, label: valor.DistribuidorNivel };
                    return obj
                });
                setState(s => ({ ...s, optDistribuidoresNiveles: DistribuidoresNiveles }))
            })
            .catch(() => {       
                setState(s => ({ ...s, optDistribuidoresNiveles: [] }))
            })
    }
    const FnDistribuidoresEstatus = () => {
        FnAnalista.FNGetDistribuidoresEstatus(props.oidc)
            .then((respuesta: any) => {
                var DistribuidoresEstatus = respuesta.map((valor: any) => {
                    var obj = { value: valor.DistribuidoresEstatusID, label: valor.DistribuidoresEstatus };
                    return obj
                });
                setState(s => ({ ...s, optDistribuidoresEstatus: DistribuidoresEstatus }))
            })
            .catch(() => {       
                setState(s => ({ ...s, optDistribuidoresEstatus: [] }))
            })
    }







    // Define the columns
    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                { name: 'Id', selector: 'SolicitudMesaCreditoID', sortable: true, },
                {
                    name: 'Asignacion', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnAsignacion(props)} title={`Asigna analista a solicitud de credito`} className="asstext text-danger"><FaPencilAlt /></button>
                    
                },
                { name: 'Asignada a', selector: 'Asignado_A', sortable: true, },
                {
                    name: 'Notas', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnNotas(props)} title={`Agregar una nota a la Validacion`} className="asstext text-danger"><FcFile  size = '32px'/></button>
                },
                { name: 'Sucursal', selector: 'Sucursal', sortable: true, },
                { name: 'Prospecto', selector: 'Prospecto', sortable: true, },
                {
                    name: 'Tiempos', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnTiempos(props)} title={`Ver Tiempos de atencion`} className="asstext text-danger"><FcClock  size = '32px'/></button>
                },
                {
                    name: 'Registro De Aval', sortable: false,
                    cell: (props) => 
                    
                    <button title={`Registro De Aval`} className="asstext text-danger"><FcBusinessman  size = '32px'/></button>
                },
                {
                    name: 'Buro Credito', sortable: false,
                    cell: (props) => 
                    
                    <button  title={`Ver Buro de Credito`} className="asstext text-danger"><FcApproval  size = '32px'/></button>
                },
                {
                    name: 'Documentos', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnDocumentos(props)} title={`Ver Documentos de solicitud de credito`} className="asstext text-danger"><FcFinePrint  size = '32px'/></button>
                },
                {
                    name: 'Referencia Titular', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnReferenciaTitular(props)} title={`Ver Referenicia Titular`} className="asstext text-danger"><FcCallback  size = '32px'/></button>
                },
                {
                    name: 'Referencia Aval', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnReferenciaAval(props)} title={`Ver Referenicia Aval`} className="asstext text-danger"><FcCallTransfer  size = '32px'/></button>
                },
                {
                    name: 'Verifica Titular', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnVerificaTitular(props)} title={`Ver Informacion Titular`} className="asstext text-danger"><FcHeadset  size = '32px'/></button>
                },
                {
                    name: 'Verifica Aval', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnVerificaAval(props)} title={`Ver Informacion Aval`} className="asstext text-danger"><FcAssistant  size = '32px'/></button>
                },
                {
                    name: 'Dictamen', sortable: false,
                    cell: (props) => 
                    
                    <button onClick={() => fnDictamen(props)} title={`Dictamen Solicitud`} className="asstext text-danger"><FcBriefcase  size = '32px'/></button>
                },
                {
                    name: 'Consolidacion', sortable: false,
                    cell: (props) => 
                    
                    <button   onClick={() => fnConsolidacion(props)}   title={`Consolidacion Solicitud`} className="asstext text-danger"><FcCheckmark  size = '32px'/></button>
                },
                
                    
            ]
        return colRet
    }, [])

    // Use effect
    React.useEffect(() => {
        FNGetLocal()
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

    React.useEffect(() => {
        if (isMounted.current === true) {
            FnGetAnalista()
            FnDistribuidoresNiveles()
            FnDistribuidoresEstatus()
          
        }
        return () => {
            isMounted.current = false
        }
    
    }, [])



    /** funcion Callback al agregar un item */
    const cbAgregar = (item: any) => {
        setState({ ...state, Datos: [...state.Datos, item], Form: { ...state.Form, Mostrar: false, Datos: {UsuarioID: '',MesaCreditoID : 0, PersonaID : 0,Activa: false } } })
    }

    /** funcion Callback al actualizar un item */
    const cbActualizar = (item: any) =>
        setState({ ...state, Datos: state.Datos.map(Dato => Dato.UsuarioAnalistaMesaID === item.UsuarioAnalistaMesaID ? item : Dato), Form: { ...state.Form, Mostrar: false, Datos: {UsuarioID: '',MesaCreditoID : 0, PersonaID : 0,Activa: false } } })


    return (
      
        <div className="row mt-sm0">
            <div className="col-12">
                <Card Title="Revision Expendiente En Mesa De Credito">
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
                                                        <input type="text" className="form-control" placeholder="Buscar Prospecto" value={state.Filtro} onChange={e => setState(s => ({ ...s, Filtro: e.target.value }))} />
                                                        <span className="input-group-text"><FaSearch /> </span>
                                                        <button className="btn btn-outline-secondary" type="button"
                                                            onClick={() => setState({ ...state, Form: { Mostrar: true, Datos: DatosDefecto, Id: undefined } })}
                                                        ><FaPlus /></button>
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
                                        keyField={"UsuarioAnalistaMesaID"}
                                        defaultSortField={"UsuarioID"}
                                        columns={Columns}
                                    />
                                   
                                     <FormaAsignacion oidc={props.oidc} Item={state.Item} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaAsignacion} optAnalistas={state.optAnalistas}  />
                                     <FormaNotas oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar}  mostrar={state.FormaNotas}   />
                                     <FormaTiempo oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaTiempo}    />
                                     <FormaDocumento oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaDocumento} />
                                     <FormaReferenciaTitular oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaReferenciaTitular}   />
                                     <FromaReferenciaAval oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FromaReferenciaAval}   />
                                     <FormaVerificaTitular oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaVerificaTitular}   />
                                     <FormaVerificaAval oidc={props.oidc} Item={state.Item} SolicitudMesaCreditoID={0} cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaVerificaAval}   />
                                     <FormaDictamen oidc={props.oidc} Item={state.Item}  cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaDictamen}  optAnalistas={state.optAnalistas} />
                                     <FormaConsolidacion oidc={props.oidc} Item={state.Item}  cbActualizar={cbActualizar} fnCancelar={fnCancelar} mostrar={state.FormaConsolidacion}  optDistribuidoresNiveles={state.optDistribuidoresNiveles} optDistribuidoresEstatus={state.optDistribuidoresEstatus} />
                                     
                                      

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


export default connect(mapStateToProps, mapDispatchToProps)(RevisionExpediente)
