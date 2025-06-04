import React from 'react'

import * as Funciones from './/Funciones'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'
import ModalWin, { MODAL_TITLE_CLASS } from '../../../../../global/ModalWin'
import axios from 'axios'
import { GetServerUrl } from '../../../../../../global/variables'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'

import { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component'
import { FiRefreshCcw } from 'react-icons/fi'
import { ActionSelect, Card, CustomFieldText, Spinner } from '../../../../../global'
import { FaCommentDots, FaPlus, FaSearch, FaUserEdit, FaUserTie } from 'react-icons/fa'
import { FiltrarDatos } from '../../../../../../global/functions'
import ReactTooltip from 'react-tooltip';
import { CustomFieldCheckbox } from '../../../../../global/CustomFieldCheckbox'
import moment from 'moment'
import { toast } from 'react-toastify'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

type FormaNotasTipo = {
    oidc: IOidc
    fnCancelar(): any,
    actualizar(): any,
    ProspectoID: number,
    nombreP: string,
    initialValues: {
        ProspectoID: number,
        Motivo: string,
        TipoArchivadoID: number
    },
}
export const CFormArchivar = (props: FormaNotasTipo) => {

    const [loading, setLoading] = React.useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const DatosDefecto = {
        TipoDocumentoID: 0,
        NombreDocumento: '',
        Clave: '',
        Descripcion: '',
        DocumentoID: 0,
        PersonaID: 0,
        TipoPersonaID: 0,
        Ruta: '',
        Autorizado: false,
        rn: 0
    }
    let isMounted = React.useRef(true)
    const Datos: any[] = []
    const DatosMostrar: any[] = []
    const optTipoCancelacion: any[] = []

    const MySwal = withReactContent(Swal)

    const [state, setState] = React.useState({
        Datos,
        DatosMostrar,
        Filtro: '',
        Cargando: true,
        Error: false,
        Item: undefined,
        DataLoaded: false,
        optTipoCancelacion,
        Form:
        {
            Mostrar: false,
            Datos: DatosDefecto,
            Id: undefined

        },
        Mostrar: false,
        Nota: '',
    })

    const FnGetTipoCancelacion = () => {
            Funciones.FNTipoArchivado(props.oidc)
                .then((respuesta: any) => {
                    var cancelacion = respuesta.map((valor: any) => {
                        var obj = { value: valor.TipoArchivadoID, label: valor.Descripcion };
                        return obj
                    });
    
                    setState(s => ({ ...s, optTipoCancelacion: cancelacion }))
                })
                .catch(() => {
                    setState(s => ({ ...s, optTipoCancelacion: [] }))
                })
        }

const FNArchivar = (Motivo: string, TipoArchivadoID: number) => {
    Funciones.FNArchivarProspecto(props.oidc, props.ProspectoID, Motivo, TipoArchivadoID)
        .then((respuesta: any) => {
                toast.success("PROSPECTO ARCHIVADO CORRECTAMENTE")
                props.fnCancelar()
                props.actualizar()
                setLoading(false);
        })
                 .catch((error: any) => {
                console.log(error.response)
                if (error.response)
                    toast.error(`Response Error: ${error.response.data}`)
                else if (error.request)
                    toast.error(`Request ${error}`)
                else
                    toast.error(`${error}`)
                setState(e => ({ ...e, CargandoOverlay: false }))
            })
            }


    const fnCancelar = () => setState(s => ({...s, Mostrar: false}))



    // Use effect
    React.useEffect(() => {
        FnGetTipoCancelacion()

        // eslint-disable-next-line
    }, [])

    return (
        <ModalWin open={true} large center={true} >
            <ModalWin.Header>
                <h5 className={MODAL_TITLE_CLASS}>
                    ARCHIVAR PROSPECTO <br />   
                    PROSPECTO :&nbsp;{props.ProspectoID}&nbsp;{props.nombreP}
                </h5>
                <button type="button" className="delete" onClick={() => {
                   props.fnCancelar()
                }} />
            </ModalWin.Header>
            <ModalWin.Body>
            <>
                           <Formik
                               initialValues={props.initialValues}
                               enableReinitialize
                               validationSchema={Yup.object().shape({
                                TipoArchivadoID: Yup.number().required("Seleccione el Tipo de Archivado").moreThan(0, 'Seleccione el Tipo de Archivado'),
                               })} 
                               onSubmit={(values: any) => {
           
                                   MySwal.fire({
                                       title: '<strong>Archivar Prospecto</strong>',
                                       icon: 'question',
                                       html:
                                           <div className="text-center">
                                               Se archivará el prospecto ¿desea continuar?
                                           </div>,
                                       showCloseButton: false,
                                       showCancelButton: true,
                                       showConfirmButton: true,
                                       focusConfirm: false,
                                       cancelButtonText: 'Cancelar',
                                       confirmButtonText: 'Aceptar',
                                       confirmButtonAriaLabel: 'Aceptar',
                                       cancelButtonAriaLabel: ''
                                   }).then((result) => {
                                       if (result.isConfirmed) {
                                           FNArchivar(values.Motivo, values.TipoArchivadoID)
           
                                       }
                                   })
           
                               }}>
                               {({ values }) => (
                                   <Form>
                                       <div className="column is-full-desktop is-full-mobile">
                                           <ActionSelect
                                               disabled={false}
                                               label="Tipo de Archivado"
                                               name="TipoArchivadoID"
                                               placeholder="Elige un Tipo de Archivado"
                                               options={state.optTipoCancelacion}
                                               addDefault={true}
                                           />
                                       </div>
                                       <div className="column is-full-desktop is-full-mobile">
                                           <CustomFieldText disabled={loading} label="Motivo"
                                           name="Motivo" placeholder="Descripción(Opcional)" />
                                       </div>
           
                                       {loading && <Spinner />}
                                       {!loading &&
                                           <div className="text-end">
           
                                               <button type="submit" className="ms-2 btn btn-success waves-effect waves-light" >
                                                   Archivar Prospecto
                                               </button>
                                           </div>
                                       }
                                   </Form>
                               )}
                           </Formik>
                       </>
            </ModalWin.Body>
        </ModalWin>
    )
}