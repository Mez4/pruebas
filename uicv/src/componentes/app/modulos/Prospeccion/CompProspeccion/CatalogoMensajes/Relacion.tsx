import React from 'react'
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { connect } from 'react-redux'
import { IEstado } from '../../../../../../interfaces/redux/IEstado'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import * as Funciones from './../CatalogoMensajes/Funciones'
import ReactTooltip from 'react-tooltip'
import { Card, Spinner } from '../../../../../global'
import { FaCircle } from 'react-icons/fa'

type CatalogosType = {
    oidc: IOidc
    fnSelectMensaje(mensajeID: number, mensajeName: string): any
    Mostrar: boolean
    fnCancelar(): any
}

const Relacion = (props: CatalogosType) => {

 // Controll our mounted state
 let isMounted = React.useRef(true)

 const DatosDefecto = { MensajeID: 0, Mensaje: ''}
 const Datos: any[] = []
 const Datos2: any[] = []
 const Datos3: any[] = []
 const Datos4: any[] = []
 const Datos5: any[] = []
 const Datos6: any[] = []
 const Datos7: any[] = []
 const docs1: any[] = []
 const docs7: any[] = []
 const DatosMostrar: any[] = []
 const [stateM, setStateM] = React.useState({
     Datos,
     Datos2,
     Datos3,
     Datos4,
     Datos5,
     Datos6,
     Datos7,
     docs1,
     docs7,
     DatosMostrar,
     Filtro: '',
     Cargando: true,
     Error: false,
     Form:
     {
         Mostrar: false,
         Datos: DatosDefecto,
         Id: undefined
     }
 })

 const FNGetLocal = () => {

     setStateM(s => ({ ...s, Cargando: true }))
     Funciones.FNGetResumen(props.oidc, stateM.Form.Datos.MensajeID)
         .then((respuesta: any) => {
             if (isMounted.current === true) {
                 console.log(respuesta);
                 let tabla1: any[] = respuesta.filter(x => x.StatusProcesoID === 10)
                 let tabla2: any[] = respuesta.filter(x => x.StatusProcesoID === 11)
                 let tabla3: any[] = respuesta.filter(x => x.StatusProcesoID === 12)
                 let tabla4: any[] = respuesta.filter(x => x.StatusProcesoID === 13)
                 let tabla5: any[] = respuesta.filter(x => x.StatusProcesoID === 14)
                 let tabla6: any[] = respuesta.filter(x => x.StatusProcesoID === 15)
                 let tabla7: any[] = respuesta.filter(x => x.StatusProcesoID === 16)

                 let muestra1: any[] = []
                 let muestra7: any[] = []

                 let docs1: any[] = []
                 let docs7: any[] = []

                 let MensajeID = 0
                 let MensajeID7 = 0

                 tabla1.forEach((e: any) => {
                    if (MensajeID == 0) {
                        let detalle: any = {MensajeID: e.MensajeID, Mensaje: e.Mensaje} 
                        muestra1.push(detalle)
                        docs1.push({MensajeID: e.MensajeID, Mensaje: e.Mensaje, TipoDocumentoID: e.TipoDocumentoID, NombreDocumento: e.NombreDocumento})
                        MensajeID = e.MensajeID
                    }else{
                        if (MensajeID === e.MensajeID) {
                            docs1.push({MensajeID: e.MensajeID, Mensaje: e.Mensaje, TipoDocumentoID: e.TipoDocumentoID, NombreDocumento: e.NombreDocumento})
                        }else{
                            let detalle: any = {MensajeID: e.MensajeID, Mensaje: e.Mensaje} 
                            muestra1.push(detalle)
                            docs1.push({MensajeID: e.MensajeID, Mensaje: e.Mensaje, TipoDocumentoID: e.TipoDocumentoID, NombreDocumento: e.NombreDocumento})
                            MensajeID = e.MensajeID
                        }
                    }
                 })

                 tabla7.forEach((e: any) => {
                    if (MensajeID7 == 0) {
                        let detalle: any = {MensajeID: e.MensajeID, Mensaje: e.Mensaje} 
                        muestra7.push(detalle)
                        docs7.push({MensajeID: e.MensajeID, Mensaje: e.Mensaje, TipoDocumentoID: e.TipoDocumentoID, NombreDocumento: e.NombreDocumento})
                        MensajeID7 = e.MensajeID
                    }else{
                        if (MensajeID7 === e.MensajeID) {
                            docs7.push({MensajeID: e.MensajeID, Mensaje: e.Mensaje, TipoDocumentoID: e.TipoDocumentoID, NombreDocumento: e.NombreDocumento})
                        }else{
                            let detalle: any = {MensajeID: e.MensajeID, Mensaje: e.Mensaje} 
                            muestra7.push(detalle)
                            docs7.push({MensajeID: e.MensajeID, Mensaje: e.Mensaje, TipoDocumentoID: e.TipoDocumentoID, NombreDocumento: e.NombreDocumento})
                            MensajeID7 = e.MensajeID
                        }
                    }
                 })
                 
                 setStateM(s => ({ ...s, Cargando: false, Error: false, 
                    Datos: muestra1, 
                    Datos2: tabla2, 
                    Datos3: tabla3, 
                    Datos4: tabla4, 
                    Datos5: tabla5, 
                    Datos6: tabla6, 
                    Datos7: muestra7, 
                    docs1: docs1,
                    docs7: docs7,
                }))
             }
         })
         .catch((error) => {
             console.log("###e", error)
             if (isMounted.current === true) {
                 setStateM(s => ({ ...s, Cargando: false, Error: true, Datos: [] }))
             }
         })
 }

 // Use effect
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
                name: 'MENSAJE / NOTA',
                selector: 'Mensaje',
                cell: (props) =>
                <>
                    <div>
                        <div data-tip data-for={`A_${props.MensajeID}`}>
                            <FaCircle size={8}/> <strong>{props.Mensaje}</strong>
                        </div>
                        <ReactTooltip id={`A_${props.MensajeID}`} type="info" effect="solid">
                            <strong>{props.Mensaje}</strong>
                        </ReactTooltip>
                    </div>
                </>
            },
        ]
    return colRet
}, [stateM.Form])

 // On use effect
 React.useEffect(() => {
     setStateM(s => ({ ...s, DatosMostrar: s.Datos }))
     // eslint-disable-next-line
 }, [stateM.Datos, stateM.Filtro])

 return (
    <ModalWin open={props.Mostrar} center xlarge>
        <ModalWin.Header>
            <h5 className={MODAL_TITLE_CLASS}>RESUMEN</h5>
            <button type="button" className="delete" onClick={() => { props.fnCancelar() }} />
        </ModalWin.Header>
        <ModalWin.Body>
            <div className="row">
                <div className="col-sm-0 col-md-3 col-lg-3 col-xl-3"></div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'REVISION BURO DE CREDITO'}>
                        <Card.Body>
                            <Card.Body.Content>
                            {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos2} striped dense noHeader responsive columns={Columns} />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-sm-0 col-md-3 col-lg-3 col-xl-3"></div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'VERIFICA TITULAR'}>
                        <Card.Body>
                            <Card.Body.Content>
                            {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos5} striped dense noHeader responsive columns={Columns} />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'VERIFICA AVAL'}>
                        <Card.Body>
                            <Card.Body.Content>
                            {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos6} striped dense noHeader responsive columns={Columns} />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'REVISION REFERENCIAS TITULAR'}>
                        <Card.Body>
                            <Card.Body.Content>
                            {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos3} striped dense noHeader responsive columns={Columns} />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'REVISION REFERENCIAS AVAL'}>
                        <Card.Body>
                            <Card.Body.Content>
                            {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos4} striped dense noHeader responsive columns={Columns} />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'REVISION DE DOCUMENTOS'}>
                        <Card.Body>
                            <Card.Body.Content>
                                {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos} striped dense noHeader responsive 
                                    columns={[
                                        {
                                            name: 'MENSAJE / NOTA',
                                            selector: 'Mensaje',
                                            cell: (props) =>
                                            <>
                                                <div>
                                                    <div data-tip data-for={`A_${props.MensajeID}`}>
                                                        <FaCircle size={8}/> <strong>{props.Mensaje}</strong>
                                                    </div>
                                                    <ReactTooltip id={`A_${props.MensajeID}`} type="info" effect="solid">
                                                        <strong>{props.Mensaje}</strong>
                                                    </ReactTooltip>
                                                    <table style={{marginBottom: '0px', marginLeft: '1em'}}>
                                                        <tbody>
                                                            {stateM.docs1.map((c: any, cId: number) =>
                                                                {return c.MensajeID === props.MensajeID && <tr key={'crd_' + cId}>
                                                                    <div style={{fontSize: '.8em', padding: '0px'}}>- {c.NombreDocumento}</div>
                                                                </tr>}
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        },
                                    ]} 
                                />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Card Title={'REVISION DE DOCUMENTOS AVALES'}>
                        <Card.Body>
                            <Card.Body.Content>
                            {stateM.Cargando && <Spinner />}
                                {stateM.Error && <span>Error al cargar los datos...</span>}
                                {!stateM.Cargando && !stateM.Error && <DataTable data={stateM.Datos7} striped dense noHeader responsive 
                                    columns={[
                                        {
                                            name: 'MENSAJE / NOTA',
                                            selector: 'Mensaje',
                                            cell: (props) =>
                                            <>
                                                <div>
                                                    <div data-tip data-for={`A_${props.MensajeID}`}>
                                                        <FaCircle size={8}/> <strong>{props.Mensaje}</strong>
                                                    </div>
                                                    <ReactTooltip id={`A_${props.MensajeID}`} type="info" effect="solid">
                                                        <strong>{props.Mensaje}</strong>
                                                    </ReactTooltip>
                                                    <table className='table' style={{marginBottom: '0px', marginLeft: '1em'}}>
                                                        <tbody>
                                                            {stateM.docs7.map((c: any, cId: number) =>
                                                                {return c.MensajeID === props.MensajeID && <tr key={'crd_' + cId}>
                                                                    <div style={{fontSize: '.8em', padding: '0px'}}>- {c.NombreDocumento}</div>
                                                                </tr>}
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        },
                                    ]} 
                                />}
                            </Card.Body.Content>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModalWin.Body>
    </ModalWin>     
 )
}

const mapStateToProps = (state: IEstado) => ({
    oidc: state.oidc
})

const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(Relacion);