
import React from 'react'
// import Select from 'react-select'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import CustomFieldDatePicker from './CustomFieldDatePicker';
import { ActionSelect, CustomFieldDatePicker2, CustomFieldText, CustomFieldText2 } from '.';
import { FaFileExcel, FaFilter } from 'react-icons/fa';
import { Directores, Distribuidores, Grupos, Productos, Sucursales, Zonas } from '../selectores';
import { IEstado } from '../../interfaces/redux/IEstado';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { useParams } from 'react-router';

const useAppSelector: TypedUseSelectorHook<IEstado> = useSelector

type IntField = {
    Tipo: string;
    Label: string;
    Selector: string;
    Disabled?: boolean;
    Options?: any[] | string;
}

type IntFieldDrawer = {
    fields: IntField[],
    initialValues: any,
    setState?(prev: any): void
    onSubmit(values: any): void
    LoadingMod: boolean
    FnExportarData(): void
    Exportar?: boolean
}

const DataTypeInput = {
    date: 'D',
    input: 'I',
    selCustom: 'SX',
    selDv: 'SD',
    selDvBuscar: 'SDB',
    selDirector: 'SDi',
    selSucursal: 'SS',
    selProducto: 'SP',
    selGrupo: 'SG',
    selZona: 'SZ',
    sinComponente: 'X',
}

const FieldDrawer = ({ Exportar = false, fields = [], initialValues, setState, onSubmit, LoadingMod, FnExportarData }: IntFieldDrawer) => {
    const estado = useAppSelector<IEstado>(estado => estado)
    const { productoId } = useParams<{ productoId: string | undefined }>()


    const directorSelector = fields.find(comp => comp.Tipo == DataTypeInput.selDirector)?.Selector || 'DirectorID'

    const productoSelector = fields.find(comp => comp.Tipo == DataTypeInput.selProducto)?.Selector || 'ProductoID'

    const zonaSelector = fields.find(comp => comp.Tipo == DataTypeInput.selZona)?.Selector || 'ZonaID'

    const grupoSelector = fields.find(comp => comp.Tipo == DataTypeInput.selGrupo)?.Selector || 'GrupoID'

    const sucursalSelector = fields.find(comp => comp.Tipo == DataTypeInput.selSucursal)?.Selector || 'SucursalID'

    const valueIDisNumber = (val) => val != undefined || isNaN(val)

    return (<>
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => onSubmit(values)}
        >{({ values, setValues }) => (<>
            <Form>
                <FilterTemplate>
                    {fields.map((field, i) => field.Tipo != DataTypeInput.sinComponente ? <div key={i} className='column is-12-mobile is-12-tablet is-4-desktop'>
                        {field.Tipo == DataTypeInput.date && <CustomFieldDatePicker
                            name={field.Selector}
                            label={field.Label}
                            disabled={false}
                            key={`${field.Selector}${i}`}
                        />}
                        {field.Tipo == DataTypeInput.selDirector && <Directores
                            valor={values[field.Selector] || productoId}
                            oidc={estado.oidc}
                            isSingle
                            name={field.Selector}
                            disabled={field.Disabled || false}
                            key={`${field.Selector}${i}`}
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.selProducto && <Productos
                            valor={values[field.Selector] || productoId}
                            oidc={estado.oidc}
                            ui={estado.UI}
                            isSingle
                            disabled={field.Disabled || false}
                            ProductosIds={values[field.Selector] || productoId}
                            key={`${field.Selector}${i}`}
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.selZona && <Zonas
                            name={field.Selector}
                            key={`${field.Selector}${i}`}
                            DirectorID={values[directorSelector]}
                            cargar={true}
                            oidc={estado.oidc}
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.selSucursal && <Sucursales
                            IsAction
                            Permiso={valueIDisNumber(values[zonaSelector] == undefined)}
                            ZonaID={valueIDisNumber(values[zonaSelector]) ? values[zonaSelector] : 0}
                            valor={values[field.Selector]}
                            label={field.Label}
                            name={field.Selector}
                            disabled={field.Disabled || false}
                            key={`${field.Selector}${i}`}
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.selDv && <Distribuidores
                            RequiereSuc
                            SucursalID={values[sucursalSelector]}
                            valor={values[field.Selector]}
                            label={field.Label}
                            name={field.Selector}
                            disabled={field.Disabled || false}
                            key={`${field.Selector}${i}`}
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.selGrupo && <Grupos
                            SucursalID={values[sucursalSelector] ? values[sucursalSelector] : 0}
                            Accion={true}
                            GrupoID={values[field.Selector]}
                            label={field.Label}
                            name={field.Selector}
                            disabled={field.Disabled || false}
                            oidc={estado.oidc}
                            cargar={false}
                        />}
                        {field.Tipo == DataTypeInput.selDvBuscar && <Distribuidores
                            buscar={true}
                            SucursalID={values[sucursalSelector]}
                            valor={values[field.Selector]}
                            label={field.Label}
                            name={field.Selector}
                            disabled={field.Disabled || false}
                            key={`${field.Selector}${i}`}
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.input && <CustomFieldText2
                            name={field.Selector}
                            label={field.Label}
                            disabled={field.Disabled || false}
                            key={`${field.Selector}${i}`}
                            datoType='text'
                            {...field}
                        />}
                        {field.Tipo == DataTypeInput.selCustom && <ActionSelect
                            label={field.Label}
                            name={field.Selector}
                            options={field.Options ? (
                                Array.isArray(field.Options) ? field.Options
                                    : (Array.isArray(JSON.parse(field.Options)) ? JSON.parse(field.Options) : [])
                            ) : []}
                            addDefault={false}
                            disabled={LoadingMod}
                            accion={(val) => setValues(prev => ({ ...prev, [field.Selector]: val }))}
                        />}
                    </div> : null)}

                    <div className="text-end column is-12-mobile is-12-tablet is-12-desktop">
                        <button disabled={LoadingMod} className={`btn btn-lg ${LoadingMod ? 'btn-secondary' : 'btn-primary'}`} type="submit" >
                            Buscar
                        </button>
                        <button disabled={LoadingMod || !Exportar} type="button" className={`btn  ml-2 btn-lg ${(!Exportar || LoadingMod) ? 'btn-secondary' : 'btn-success'}`} onClick={() => FnExportarData()} >
                            Excel <FaFileExcel size="20px" style={{ marginTop: -2 }} />
                        </button>
                    </div>
                </FilterTemplate>

            </Form>
        </>)}</Formik>
    </>)
}

export const FilterTemplate = ({ children }) => {
    return (
        <div
            style={{
                backgroundColor: "#F0F0F0",
                padding: "1em",
                borderRadius: "15px",
            }}
        >
            <div>
                <div>
                    <label><FaFilter /> FILTROS</label>
                </div>
            </div>

            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                    display: "inline-block",
                }}
            >
                <div className="columns is-left is-mobile is-multiline">
                    {children}
                </div>
            </div>
        </div>)
}

export default FieldDrawer
