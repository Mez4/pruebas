import Ract, { useState, useEffect } from 'react'
import { CustomFieldText2 } from '../../global'
import { OrientacionVialidadesTipo, VialidadesTipo, ViviendasTipo, ControlAsentamientos, BuscarAsentamiento } from '../../selectores'
import Yup from '../../../global/yupLocale'
import ModalWin, { MODAL_TITLE_CLASS } from '../../global/ModalWin'

/** Tipo del componente */
type DireccionTipo = {
    Prefijo: string,
    Titulo: string,
    SubTitulo: string,
}
/**
 * Este componente se utiliza para generar direcciones, pide el prefijo, ya que una forma puede pedir multiples direcciones
 * @returns Componente de React
 */
export const FormaDireccion = ({ Prefijo, Titulo, SubTitulo }: DireccionTipo) => {

    // Valores iniciales
    const InitialValues: any = {}
    InitialValues[`${Prefijo}NombreVialidad`] = ''
    InitialValues[`${Prefijo}vialidadTipoId`] = ''
    InitialValues[`${Prefijo}orientacionVialidadTipoId`] = ''
    InitialValues[`${Prefijo}NumeroExterior`] = ''
    InitialValues[`${Prefijo}NumeroInterior`] = ''
    InitialValues[`${Prefijo}ReferenciaGeografica`] = ''
    InitialValues[`${Prefijo}AsentamientoID`] = ''
    InitialValues[`${Prefijo}viviendaTipoId`] = ''

    // Generamos un objeto dinamico de validacion
    const ValSchemaObjecet: any = {}
    ValSchemaObjecet[`${Prefijo}NombreVialidad`] = Yup.string().required().min(3).max(120)
    ValSchemaObjecet[`${Prefijo}vialidadTipoId`] = Yup.number().typeError('Error').required().min(1)
    /* ValSchemaObjecet[`${Prefijo}orientacionVialidadTipoId`] = Yup.number().required().min(0) */
    ValSchemaObjecet[`${Prefijo}NumeroExterior`] = Yup.string().required().min(1) //Yup.string().required().min(1).max(120)
/*     ValSchemaObjecet[`${Prefijo}NumeroInterior`] = Yup.string().min(0).max(120)
 */    ValSchemaObjecet[`${Prefijo}ReferenciaGeografica`] = Yup.string().max(120)//.required().min(10)
    ValSchemaObjecet[`${Prefijo}AsentamientoID`] = Yup.number().required('Seleccione un Asentamiento').moreThan(0, 'Seleccione un Asentamiento')
    /*     ValSchemaObjecet[`${Prefijo}viviendaTipoId`] = Yup.number().required().min(1)
     */
    //Asentamiento
    const [showAsentamiento, setShowAsentamiento] = useState(false)

    const [AsentamientoID, setAsentamientoID] = useState(0)
    const [vialidadTipo, setVialidadTipo] = useState(0)
    const [orientacionVialidadesTipo, setOrientacionVialidadesTipo] = useState(0)
    const [viviendasTipo, setViviendasTipo] = useState(0)

    const fnOpen = () => setShowAsentamiento(true)

    const fnCancelar = () => setShowAsentamiento(false)

    const cbAceptar = (id: number) => {
        setShowAsentamiento(false);
        setAsentamientoID(id);
    }

    const vialidadTipoSelected = (val: number) => setVialidadTipo(val)
    const orientacionVialidadesTipoSelected = (val: number) => setOrientacionVialidadesTipo(val)
    const viviendasTipoSelected = (val: number) => setViviendasTipo(val)

    // We return our component
    return {
        InitialValues,
        Propiedades: {},
        Titulo,
        SubTitulo,
        ValidationSchema: Yup.object().shape(ValSchemaObjecet),
        Componente: (cprops: any) => (
            <div>
                <div className={"row"}>
                    <div className={"col-sm-12 col-md-3"}>
                        <VialidadesTipo {...cprops} name={`${Prefijo}vialidadTipoId`} accion={vialidadTipoSelected} valor={vialidadTipo} />
                    </div>
                    <div className={"col-sm-12 col-md-6"}>
                        <CustomFieldText2 disabled={cprops.Cargando} label={'Vialidad'} datoType='text' name={`${Prefijo}NombreVialidad`} placeholder={'Vialidad'} />
                    </div>
                    <div className={"col-sm-12 col-md-3"}>
                        {/*                         <OrientacionVialidadesTipo {...cprops} name={`${Prefijo}orientacionVialidadTipoId`} accion={orientacionVialidadesTipoSelected} valor={orientacionVialidadesTipo}/>
 */}                    </div>
                </div>
                <hr className={"mt-1 mb-3"} />
                <div className={"row"}>
                    <div className={"col-sm-12 col-md-6"}>
                        <CustomFieldText2 disabled={cprops.Cargando} label={'#Exterior'} datoType='text' name={`${Prefijo}NumeroExterior`} placeholder={'Número Exterior'} />
                    </div>
                    <div className={"col-sm-12 col-md-6"}>
                        <CustomFieldText2 disabled={cprops.Cargando} label={'#Interior'} datoType='text' name={`${Prefijo}NumeroInterior`} placeholder={'Número Interior (Opcional)'} />
                    </div>
                </div>
                <CustomFieldText2 disabled={cprops.Cargando} label={'Referencias'} datoType='text' name={`${Prefijo}ReferenciaGeografica`} placeholder={'Referencias y Tipo De Viviendas (Opcional)'} />
                {/* <CustomFieldText2 disabled={cprops.Cargando} label={'Asentamiento'} name={`${Prefijo}AsentamientoID`} placeholder={'Asentamiento'} /> */}
                <ControlAsentamientos name={`${Prefijo}AsentamientoID`} valor={AsentamientoID} fnOpen={fnOpen} />
                {/*                 <ViviendasTipo {...cprops} name={`${Prefijo}viviendaTipoId`} accion={viviendasTipoSelected} valor={viviendasTipo}/>
 */}
                <ModalWin zIndex={4001} open={showAsentamiento}>
                    <ModalWin.Header>
                        <h5 className={MODAL_TITLE_CLASS}>
                            {"Buscar Asentamiento"}
                        </h5>
                    </ModalWin.Header>
                    <ModalWin.Body>
                        {showAsentamiento &&
                            <BuscarAsentamiento
                                initialValues={{
                                    EstadoId: 0,
                                    MunicipioId: 0,
                                    TipoAsentamientoId: 0,
                                    CodigoPostalID: 0,
                                    AsentamientoID: 0
                                }}
                                cbAceptar={cbAceptar}
                                fnCancelar={fnCancelar}
                            />}
                    </ModalWin.Body>
                </ModalWin>
            </div>
        )
    }
}