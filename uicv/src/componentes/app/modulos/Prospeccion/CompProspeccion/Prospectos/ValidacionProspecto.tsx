import React from 'react'

import { FaCheckCircle, FaClock, FaDotCircle, FaExclamationTriangle } from 'react-icons/fa'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { Card, ModalWin, Spinner } from '../../../../../global'
import { toast } from 'react-toastify'
import { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import * as Funciones from './Funciones'

// Datos necesarios para el perfil
type PerfilProspectoTipo = {
    oidc: IOidc,
    Procesos: []
    Id: number
    cbValidar(item: any): any 
}

export const ValidacionProspecto = (props: PerfilProspectoTipo) => {

    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const ProcPendietes: any[] = []
    const [state, setState] = React.useState({
        Datos,
        ProcPendietes,
        Cargando: true,
        Error: false,
        confirm: false,
    })

    const FNGetLocal = () => {

        setState(s => ({ ...s, Cargando: true }))
        console.log(props.Procesos)
        let respuesta = props.Procesos.filter((x: any) => x.StatusProcesoID < 8)
        let pendiente = props.Procesos.filter((x: any) => x.StatusProcesoID < 8 && !x.Validado && x.CapturaObligatoria)
        console.log(pendiente)
        setState(s => ({ ...s, Cargando: false, Error: false, Datos: respuesta, ProcPendietes: pendiente }))
    }

    React.useEffect(() => {
        FNGetLocal()
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line
    }, [])

    const Columns = React.useMemo(() => {
        let colRet: IDataTableColumn[] =
            [
                {
                    name: 'ID',
                    selector: 'StatusProcesoID',
                    sortable: true,
                    width: '10%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <span>
                                {props.StatusProcesoID}
                            </span>
                        </div>
                },
                {
                    name: 'PROCESO (Prospeccion)',
                    selector: 'Descripcion',
                    sortable: true,
                    width: '58%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'start'}}>
                            {props.Descripcion}
                        </div>
                },{
                    name: 'VALIDADO',
                    selector: 'Validado',
                    sortable: true,
                    center: true,
                    width: '15%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            {props.Validado ? <FaCheckCircle color='#58db83' size={20}/> : <FaClock color='gray' size={20}/>}
                        </div>
                },{
                    name: 'REQUERIDO',
                    selector: 'CapturaObligatoria',
                    sortable: true,
                    center: true,
                    width: '15%',
                    cell: (props) => 
                        <div style={{width: '100%', textAlign: 'center'}}>
                            {props.CapturaObligatoria ? <FaDotCircle color='#58db83' size={20}/> : <FaDotCircle color='gray' size={20}/>}
                        </div>
                },
            ]
        return colRet
    }, [state.Datos])

    const fnValidar = ( )=> {
        setState(s => ({ ...s, Cargando: true, confirm: false }))
        
        if(state.ProcPendietes.length > 0){
            toast.error(`ES NECESARIO VALIDAR CADA PROCESO ANTES DE ENVIAR AL PROSPECTO A MESA DE CRÉDITO`)
            toast.info(`ESTE PROSPECTO TIENE ${state.ProcPendietes.length} PROCESOS REQUERIDOS PENDIETES DE VALIDAR`)
        }else{
            Funciones.FNValidarProspecto(props.oidc, props.Id)
            .then((respuesta: any) => {
                setState(s => ({ ...s, Cargando: false }))
                props.cbValidar(respuesta)
            })
            .catch((error: any) => {
                if (error.response) 
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                
                setState(s => ({ ...s, Cargando: false }))
            })
        }
        
        setState(s => ({ ...s, Cargando: false }))
    }

    const closeMdl = () => setState(s=>({...s, confirm: false}))
    const confirm = () => setState(s=>({...s, confirm: true}))
    return (
        <>
        <div className="row">
            <div className="col-12">
                <Card>
                    <Card.Body>
                        <Card.Body.Content>
                            <h5>Resumen de procesos del prospecto</h5>
                        {state.ProcPendietes.length > 0 && <div className='text-end'><span style={{color: 'red'}}>* ESTE PROSPECTO TIENE PROCESOS REQUERIDOS PENDIENTES DE VALIDACIÓN</span></div>}
                            {state.Cargando && <Spinner />}
                            {state.Error && <span>Error al cargar los datos...</span>}
                            {!state.Cargando && !state.Error &&
                            <div>
                                <DataTable
                                    data={state.Datos}
                                    striped
                                    dense
                                    noHeader
                                    responsive
                                    keyField={"StatusProcesoID"}
                                    defaultSortField={"StatusProcesoID"}
                                    columns={Columns}
                                />
                                <br/>
                                <div style={{textAlign: 'end'}}>
                                    <button disabled={state.ProcPendietes.length > 0} type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={confirm}>VALIDAR PROSPECTO</button>
                                </div>
                            </div>}
                            
                        </Card.Body.Content>
                    </Card.Body>
                </Card>
            </div>
        </div >
        {state.confirm && <ModalWin open={state.confirm} center >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    CONFIRMACION DE VALIDACIÓN
                </h5>
                <button type="button" className="delete" onClick={() => {
                    closeMdl()
                }} />
            </ModalWin.Header>
            <ModalWin.Body>
                <div style={{padding: '1em'}}>
                    <span >¿Esta Seguro(a) de Enviar a este Prospecto a Mesa de Crédito para su revisión? </span><br/><br/>
                    <FaExclamationTriangle />
                    <span > Atención: Una vez validado y enviado NO podrá hacer modificaciones a este Prospecto, a menos que Mesa de Crédito lo solicite.</span><br/>
                </div>
                <div style={{textAlign: 'end'}}>
                    <button type="button" className="ms-2 btn btn-success waves-effect waves-light" onClick={fnValidar}>CONTINUAR Y VALIDAR REFERENCIAS</button>
                </div>
            </ModalWin.Body>
        </ModalWin>}
        </>
    )
}
