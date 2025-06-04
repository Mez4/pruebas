import React from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import { CustomFieldText, Spinner } from '../../../../../global'
import * as Funciones from './Funciones'
import DataTable from 'react-data-table-component'
import _ from 'lodash'
import { FaRegSquare, FaCheckSquare } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { IOidc } from '../../../../../../interfaces/oidc/IOidc'


type CFormType = {
    Seguridad: IOidc,
    Id?: number,
    initialValues: {
        activo: boolean;
        clave: string;
        nombre: string;
        directorMesa: {};
        productos: any[];
        analistas: any[];
        directorId: number;
        productoId?: number;
        analistaId?: number;
    },

    cbActualizar(item: any): any,
    cbGuardar(item: any): any
    fnCancelar(): any,
    opcionesProducto: { value: number, label: string }[]
    opcionesUsuario: { value: number, label: string }[]

}

export const CForm = (props: CFormType) => {


    type directorType = {
        value: string,
        label: string,
        activo: boolean
    }
    type analistaType = {
        value: string,
        label: string,
        activo: boolean

    }

    type productoType = {
        productoCredito:
        {
            productoId: number,
            nombre?: string
        },
        activo: boolean
    }

    type analistasTypeFormatoPost = {
        activo: boolean,
        usuarioAnalista:
        {
            usuarioID: number
        }
    }


    const dSeleccionadosDefecto: directorType[] = []
    const dSeleccionadosProductosDefecto: productoType[] = []
    let directorGuardado: directorType[] = []
    let directorCambiado: directorType[] = []
    let dSeleccionadosAnalistas: analistasTypeFormatoPost[] = []

    let dIsDisable: boolean = false;

    // Loading
    const [loading, setLoading] = React.useState(false)
    let [dSeleccionados, SetdSeleccionados] = React.useState(dSeleccionadosDefecto)
    let [dDirectorGurdado, setDirectorGuardado] = React.useState(directorGuardado)
    let [dSeleccionadosProductos, SetdSeleccionadosProductos] = React.useState(dSeleccionadosProductosDefecto)
    const [dPorps, setDprops] = React.useState(props)
    const [dDirectorCambiado, setDirectorCambiado] = React.useState(directorCambiado)
    const [dIsDisabled, setIsDisabled] = React.useState(dIsDisable)


    let selectRef: any = null;

    const usuarioDirector = {
        usuarioDirector: {
            usuarioID: 0
        }

    }

    const mostrarBotonMetodoAc = (item: any) => {
        console.log(" " + props.initialValues.activo)
        var i = 0;
        var index = 0;
        dSeleccionados.forEach((res: any) => {
            if (res.usuarioAnalista.usuarioID === item.usuarioAnalista.usuarioID) {
                console.log("entro i " + i)
                index = i
            }
            i++
        })

        dSeleccionados.splice(index, 1)
        console.log(dDirectorGurdado + " " + dDirectorCambiado)
        if (dDirectorGurdado.length > 0) {
            let usuario: any = dDirectorGurdado
            if (item.usuarioAnalista.usuarioID === usuario[0].value) {
                toast.error("El analista que quieres desactivar, es el director")
            } else {
                item.activo = !item.activo
            }
        } else {
            let usuario: any = props.initialValues.directorMesa
            if (item.usuarioAnalista.usuarioID === usuario.usuarioDirector.usuarioID) {
                toast.error("El analista que quieres desactivar, es el director")
            } else {
                item.activo = !item.activo
            }
        }


        let director2: directorType = { ...item }

        SetdSeleccionados(dSeleccionados => ([...dSeleccionados, director2]))

    }

    const mostrarBotonMetodo = (item: any) => {
        console.log(" " + props.initialValues.activo)
        var i = 0;
        var index = 0;
        dSeleccionados.forEach((res: any) => {
            if (res.value === item.value) {
                console.log("entro i " + i)
                index = i
            }
            i++
        })

        dSeleccionados.splice(index, 1)
        console.log(dDirectorGurdado + " " + dDirectorCambiado)
        if (dDirectorGurdado.length > 0) {
            let usuario: any = dDirectorGurdado
            if (item.value === usuario[0].value) {
                toast.error("El analista que quieres desactivar, es el director")
            } else {
                item.activo = !item.activo
            }
        } else {
            let usuario: any = props.initialValues.directorMesa
            if (item.usuarioAnalista.usuarioID === usuario.usuarioDirector.usuarioID) {
                toast.error("El analista que quieres desactivar, es el director")
            } else {
                item.activo = !item.activo
            }
        }


        let director2: directorType = { ...item }

        SetdSeleccionados(dSeleccionados => ([...dSeleccionados, director2]))

    }

    const mostrarBotonMetodoProductos = (item: any) => {
        console.log(" " + props.initialValues.activo)
        var i = 0;
        var index = 0;
        dSeleccionadosProductos.forEach((res: any) => {
            if (res.productoCredito.productoId === item.productoCredito.productoId) {
                index = i
            }
            i++
        })

        dSeleccionadosProductos.splice(index, 1)

        if (props.initialValues.productos.length <= 1) {
            props.initialValues.productos.map((respuesta: any) => {

                if (respuesta.activo === false) {
                    item.activo = !item.activo
                } else {
                    toast.error("El producto no se puede desactivar, ya que es el unico asignado")
                }

            })
        } else {
            item.activo = !item.activo
        }

        let director2: productoType = { ...item }

        SetdSeleccionadosProductos(dSeleccionadosProductos => ([...dSeleccionadosProductos, director2]))

    }

    const cambiarEstadoActivo = () => {
        console.log(" antes de actualizar activo " + props.initialValues.activo)
        props.initialValues.activo = !props.initialValues.activo
        console.log(" despues de actualizar activo " + props.initialValues.activo)
        let a: boolean = props.initialValues.activo
        setIsDisabled(a)
        if (props.initialValues.activo === false) {
            if (props.initialValues.analistas.length > 0) {
                props.initialValues.analistas.forEach((res: any) => {
                    res.activo = false
                })
                if (props.initialValues.productos.length > 0) {
                    props.initialValues.productos.forEach((res: any) => {
                        res.activo = false
                    })
                }
            }
        } else {
            let array: any[] = []
            let director: any = props.initialValues.directorMesa

            array.push(director)

            if (array.length > 0) {
                props.initialValues.analistas.forEach((res: any) => {
                    if (res.usuarioAnalista.usuarioID === director.usuarioDirector.usuarioID) {
                        res.activo = true
                    }
                })
            }
        }
        setDprops({ ...dPorps, initialValues: props.initialValues })
    }


    const directorSeleccionado = (item: any) => {
        if (item !== null) {
            if (item.value === 0)
                return
        } else {
            return
        }
        // Creamos el tipo a agregar
        let director: directorType = { ...item }

        // Agregamos al estado
        if (dSeleccionados.filter(d => d.value === director.value).length <= 0) {
            director.activo = true
            if (dDirectorGurdado.length === 0) {
                setDirectorGuardado(dDirectorGurdado => ([...dDirectorGurdado, item]))
                SetdSeleccionados(dSeleccionados => ([...dSeleccionados, director]))
            } else {
                _.remove(dSeleccionados, function (car) {
                    return car.value === dDirectorGurdado[0].value
                });
                dDirectorGurdado.pop()
                setDirectorGuardado(dDirectorGurdado => ([...dDirectorGurdado, item]))
                SetdSeleccionados(dSeleccionados => ([...dSeleccionados, director]))


            }
        }
        let index = props.opcionesUsuario.findIndex((res: any) => {
            return res.value === item.value
        })
        props.initialValues.directorId = index
        setDprops(dPorps => ({ ...dPorps, initialValues: props.initialValues }))
    }

    const directorSeleccionadoActualizar = (item: any) => {
        if (item !== undefined || item !== null) {
            if (item.value === 0)
                return
        } else {
            return
        }

        // Creamos el tipo a agregar
        let director: directorType = { ...item }
        let director2: any
        if (dDirectorGurdado.length === 0) {
            director2 = { ...props.initialValues.directorMesa }
        } else {

            director2 = { usuarioDirector: { nombre: dDirectorGurdado[0].label, usuarioID: dDirectorGurdado[0].value } }
        }
        let director3: directorType = { ...item }

        // Agregamos al estado

        if (props.initialValues.analistas.filter(d => d.usuarioAnalista.usuarioID === director.value).length <= 0) {

            director.activo = true

            console.log(director2.usuarioDirector)
            director3.label = director2.usuarioDirector.nombre
            director3.value = director2.usuarioDirector.usuarioID
            director3.activo = true
            dDirectorGurdado.push(director3)
            setDirectorGuardado(dDirectorGurdado => ([...dDirectorGurdado, director3]))
            if (dDirectorGurdado.length === 0) {
                let directorNuevo = {
                    activo: true,
                    mesaCreditoAnalista: {
                        mesaCreditoId: props.Id
                    },
                    usuarioAnalista: {
                        usuarioID: director.value,
                        nombre: director.label
                    }

                }
                props.initialValues.analistas.push(directorNuevo)
                setDirectorGuardado(dDirectorGurdado => ([...dDirectorGurdado, item]))
                setDprops(dPorps => ({ ...dPorps, initialValues: props.initialValues }))
            } else {
                let directorC: any = {};
                let directorCTieneValores = 0
                if (dDirectorCambiado.length === 0) {
                    props.initialValues.analistas.forEach((res: any) => {
                        if (res.usuarioAnalista.usuarioID === dDirectorGurdado[0].value) {
                            res.activo = false
                            directorC = res
                            directorCTieneValores = 1
                        }
                    })
                }
                /* _.remove(props.initialValues.analistas, function(car) {
                    return car.usuarioAnalista.usuarioID === dDirectorGurdado[0].value 
                });*/
                if (directorCTieneValores !== 0) {
                    setDirectorCambiado(dDirectorCambiado => ([...dDirectorCambiado, directorC]))
                } else {
                    _.remove(props.initialValues.analistas, function (car) {
                        return car.usuarioAnalista.usuarioID === dDirectorGurdado[0].value
                    });
                }
                dDirectorGurdado.pop()
                setDirectorGuardado([])
                setDirectorGuardado(dDirectorGurdado => ([...dDirectorGurdado, item]))
                let directorNuevo = {
                    activo: true,
                    mesaCreditoAnalista: {
                        mesaCreditoId: props.Id
                    },
                    usuarioAnalista: {
                        usuarioID: director.value,
                        nombre: director.label
                    }

                }
                props.initialValues.analistas.push(directorNuevo)

                let index = props.opcionesUsuario.findIndex((res: any) => {
                    return res.value === item.value
                })
                props.initialValues.directorId = index
                setDprops(dPorps => ({ ...dPorps, initialValues: props.initialValues }))

            }
        }
    }


    const productoSeleccionado = (item: any) => {
        if (item !== null || item !== undefined) {

            if (item.value === 0)
                return
        } else {
            return
        }
        // Creamos el tipo a agregar
        let producto: any = { ...item }
        let productoAGuardar: any =
        {
            productoCredito:
            {
                productoId: 0,
                nombre: ""
            },
            activo: true
        }
        // Agregamos al estado
        if (dSeleccionadosProductos.filter(d => d.productoCredito.productoId === producto.value).length <= 0) {
            producto.activo = true

            productoAGuardar.productoCredito.productoId = producto.value
            productoAGuardar.productoCredito.nombre = producto.label
            productoAGuardar.activo = producto.activo

            SetdSeleccionadosProductos(dSeleccionadosProductos => ([...dSeleccionadosProductos, productoAGuardar]))

        }
    }

    const productoSeleccionadoActualizar = (item: any) => {

        if (item !== undefined || item !== null) {
            if (item.value === 0)
                return
        } else {
            return
        }
        // Creamos el tipo a agregar
        let producto: analistaType = { ...item }

        // Agregamos al estado
        if (props.initialValues.productos.filter(d => d.productoCredito.productoId === producto.value).length <= 0) {
            let productoAGuardar: any =
            {
                productoCreditoMesa:
                {
                    mesaCreditoId: props.Id
                },
                productoCredito: {
                    productoId: producto.value,
                    producto: producto.label
                },
                activo: true
            }

            props.initialValues.productos.push(productoAGuardar)

            setDprops(dPorps => ({ ...dPorps, initialValues: props.initialValues }))

        }
    }


    const analistaSeleccionado = (item: any) => {
        if (item !== undefined || item !== null) {

            if (item.value === 0)
                return
        } else {
            return
        }
        // Creamos el tipo a agregar
        let analista: analistaType = { ...item }

        // Agregamos al estado
        if (dSeleccionados.filter(d => d.value === analista.value).length <= 0) {
            analista.activo = true
            SetdSeleccionados(dSeleccionados => ([...dSeleccionados, analista]))

        }
    }

    const analistaSeleccionadoActualizar = (item: any) => {

        if (item.value === 0)
            return

        // Creamos el tipo a agregar
        let analista: analistaType = { ...item }
        let analistaActualizarType = {
            mesaCreditoAnalista: {
                mesaCreditoId: 0
            },
            usuarioAnalista: {
                usuarioID: "",
                nombre: ""
            },
            activo: false
        }
        // Agregamos al estado
        if (props.initialValues.analistas.filter(d => d.usuarioAnalista.usuarioID === analista.value).length <= 0) {
            analistaActualizarType.activo = true
            if (props.Id !== undefined) {
                analistaActualizarType.mesaCreditoAnalista.mesaCreditoId = props.Id
            }
            analistaActualizarType.usuarioAnalista.usuarioID = analista.value
            analistaActualizarType.usuarioAnalista.nombre = analista.label
            props.initialValues.analistas.push(analistaActualizarType)

            setDprops(dPorps => ({ ...dPorps, initialValues: props.initialValues }))

        }
    }


    // Return the component

    return (
        <Formik
            initialValues={props.initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
                nombre: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(12, "Maximo 12 caracteres"),
                clave: Yup.string().required("Campo obligatorio").min(3, "Minimo 3 caracteres").max(3, "Maximo 3 caracteres")
                //directores: Yup.array().required("Campo obligatorio"),
                //productos: Yup.array().required("Campo obligatorio")
            })}
            onSubmit={(values: any) => {
                console.log(values.activo)
                if (props.Id === undefined) {
                    if (dSeleccionadosProductos.length <= 0 && values.activo === true) {
                        toast.error("Almenos debes de tener un producto seleccionado")
                    } else {
                        if (dSeleccionadosProductos.filter((d: any) => d.activo === true).length <= 0 && values.activo === true) {
                            toast.error("Almenos debes de tener un producto activo")
                        } else {
                            console.log(" " + dDirectorGurdado)
                            // Set our form to a loading state
                            setLoading(true)
                            console.log(`values`, values)

                            // Finish the callback
                            if (props.Id === undefined) {
                                if (dSeleccionados.length > 0) {
                                    dSeleccionados.forEach(res => {
                                        let analistaFormato: any = {
                                            activo: res.activo,
                                            usuarioAnalista:
                                            {
                                                usuarioID: res.value
                                            }
                                        }
                                        dSeleccionadosAnalistas.push(analistaFormato)
                                    })


                                    values.analistas = dSeleccionadosAnalistas


                                    dDirectorGurdado.map((res: any) => {
                                        usuarioDirector.usuarioDirector.usuarioID = res.value
                                    })
                                    values.directorMesa = usuarioDirector
                                }
                                if (dSeleccionadosProductos.length > 0) {
                                    /* dSeleccionadosProductos.forEach(res => {
                                        // delete res.productoCredito.nombre
                                     })*/
                                    values.productos = dSeleccionadosProductos
                                    //dSeleccionadosProductos = []
                                    //SetdSeleccionadosProductos(dSeleccionadosProductos)
                                }

                                delete values.directorId
                                delete values.productoId
                                delete values.analistaId
                                console.log("Se va a agregar el siguiente registro " + values)

                                Funciones.FNAdd(props.Seguridad, values)
                                    .then((respuesta: any) => {
                                        setLoading(false)
                                        props.cbGuardar(respuesta)
                                        setDprops(state => ({ ...state, initialValues: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } }))
                                        SetdSeleccionados([])
                                        SetdSeleccionadosProductos([])
                                        if (props.Id === undefined) {

                                            //if(dSeleccionados.length > 0)
                                            console.log("----> " + dSeleccionados)
                                            dSeleccionados.splice(0, dSeleccionados.length)
                                            dSeleccionadosAnalistas.splice(0, dSeleccionadosAnalistas.length)
                                            dSeleccionadosProductos.splice(0, dSeleccionadosProductos.length)
                                            dDirectorGurdado.splice(0, dDirectorGurdado.length)
                                            dDirectorCambiado.splice(0, dDirectorCambiado.length)
                                        }
                                        props.fnCancelar()
                                    })
                                    .catch((error: any) => {
                                        toast.error(error.response.data.errors)
                                        //alert("Error al guardar el tipo documento" + JSON.stringify(error))
                                        setLoading(false)
                                    })
                            } else {

                                if (dDirectorCambiado.length > 0) {
                                    let directorCa: any = {
                                        directorMesaId: values.directorMesa.directorMesaId,
                                        usuarioDirector: {
                                            usuarioID: dDirectorGurdado[0].value
                                        }
                                    }
                                    console.log(directorCa)
                                    values.directorMesa = directorCa
                                }
                                //Esto se encuentra unicamente para un producto, ya que al momento,
                                //no se tiene  contemplado el como funcionaria con varios.

                                let productosArreglo: any[] = []

                                let producto: any =
                                {
                                    productosId: values.productos[0].productosId,
                                    productoCreditoMesa: {
                                        mesaCreditoId: props.Id
                                    },
                                    productoCredito: {
                                        productoId: values.productos[0].productoCredito.productoId
                                    },
                                    activo: values.productos[0].activo
                                }
                                productosArreglo.push(producto)


                                values.productos = productosArreglo
                                console.log(values)
                                let arregloDeAnalistas: any[] = []
                                values.analistas.forEach((res: any) => {
                                    if (res.usuAnalistaMesaID === undefined) {
                                        delete res.usuarioAnalista.nombre
                                        delete res.usuarioAnalista.usuario
                                        arregloDeAnalistas.push(res)
                                    } else {


                                        let analista: any = {
                                            usuAnalistaMesaID: res.usuAnalistaMesaID,
                                            activo: res.activo,
                                            usuarioAnalista: {
                                                usuarioID: res.usuarioAnalista.usuarioID
                                            },
                                            mesaCreditoAnalista: {
                                                mesaCreditoId: props.Id
                                            }
                                        }
                                        arregloDeAnalistas.push(analista)
                                    }

                                })
                                values.analistas = arregloDeAnalistas;
                                delete values.productoId
                                delete values.directorId
                                delete values.analistaId

                                Funciones.FNUpdate(props.Seguridad, props.Id, { ...values })

                                    .then((respuesta: any) => {
                                        setLoading(false)
                                        props.cbActualizar(respuesta)
                                        SetdSeleccionadosProductos(dSeleccionadosProductos => ({ ...dSeleccionadosProductos, dSeleccionadosProductosDefecto }))
                                        setDprops(state => ({ ...state, initialValues: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } }))
                                        if (props.Id === undefined) {

                                            //if(dSeleccionados.length > 0)
                                            console.log("----> " + dSeleccionados)
                                            dSeleccionados.splice(0, dSeleccionados.length)
                                            dSeleccionadosAnalistas.splice(0, dSeleccionadosAnalistas.length)
                                            dSeleccionadosProductos.splice(0, dSeleccionadosProductos.length)
                                            dDirectorGurdado.splice(0, dDirectorGurdado.length)
                                            dDirectorCambiado.splice(0, dDirectorCambiado.length)
                                        }
                                        props.fnCancelar()
                                    })
                                    .catch((error: any) => {
                                        toast.error(error.response.data.errors)
                                        //alert("Error al guardar la mesa de credito" + JSON.stringify(error))
                                        setLoading(false)
                                    })
                            }
                        }
                    }
                } else {
                    if (values.productos.length <= 0 && values.activo === true) {
                        toast.error("Almenos debes de tener un producto seleccionado")
                    } else {
                        if (values.productos.filter((d: any) => d.activo === true).length <= 0 && values.activo === true) {
                            toast.error("Almenos debes de tener un producto activo")
                        } else {
                            // Set our form to a loading state
                            setLoading(true)
                            console.log(`values`, values)

                            // Finish the callback
                            if (props.Id === undefined) {
                                if (dSeleccionados.length > 0) {
                                    dSeleccionados.forEach(res => {
                                        let analistaFormato: any = {
                                            activo: res.activo,
                                            usuarioAnalista:
                                            {
                                                usuarioID: res.value
                                            }
                                        }
                                        dSeleccionadosAnalistas.push(analistaFormato)
                                    })


                                    values.analistas = dSeleccionadosAnalistas
                                    dDirectorGurdado.map((res: any) => {
                                        usuarioDirector.usuarioDirector.usuarioID = res.value
                                    })
                                    values.directorMesa = usuarioDirector
                                }
                                if (dSeleccionadosProductos.length > 0) {
                                    dSeleccionadosProductos.forEach(res => {
                                        delete res.productoCredito.nombre
                                    })
                                    values.productos = dSeleccionadosProductos
                                }

                                delete values.directorId
                                delete values.productoId
                                delete values.analistaId
                                console.log("Se va a agregar el siguiente registro " + values)

                                Funciones.FNAdd(props.Seguridad, values)
                                    .then((respuesta: any) => {
                                        setLoading(false)
                                        props.cbGuardar(respuesta)
                                        setDprops(state => ({ ...state, initialValues: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } }))
                                        if (props.Id === undefined) {

                                            //if(dSeleccionados.length > 0)
                                            console.log("----> " + dSeleccionados)
                                            dSeleccionados.splice(0, dSeleccionados.length)
                                            dSeleccionadosAnalistas.splice(0, dSeleccionadosAnalistas.length)
                                            dSeleccionadosProductos.splice(0, dSeleccionadosProductos.length)
                                            dDirectorGurdado.splice(0, dDirectorGurdado.length)
                                            dDirectorCambiado.splice(0, dDirectorCambiado.length)
                                        }
                                        props.fnCancelar()

                                    })
                                    .catch((error: any) => {
                                        toast.error(error.response.data.errors)
                                        //alert("Error al guardar el tipo documento" + JSON.stringify(error))
                                        setLoading(false)
                                    })
                            } else {

                                if (dDirectorCambiado.length > 0) {
                                    let directorCa: any = {
                                        directorMesaId: values.directorMesa.directorMesaId,
                                        usuarioDirector: {
                                            usuarioID: dDirectorGurdado[0].value
                                        }
                                    }
                                    console.log(directorCa)
                                    values.directorMesa = directorCa
                                }
                                //Esto se encuentra unicamente para un producto, ya que al momento,
                                //no se tiene  contemplado el como funcionaria con varios.

                                let productosArreglo: any[] = []

                                values.productos.forEach((res: any) => {
                                    let producto: any =
                                    {
                                        productosId: res.productosId,
                                        productoCreditoMesa: {
                                            mesaCreditoId: props.Id
                                        },
                                        productoCredito: {
                                            productoId: res.productoCredito.productoId
                                        },
                                        activo: res.activo
                                    }
                                    productosArreglo.push(producto)

                                })

                                values.productos = productosArreglo
                                console.log(values)
                                let arregloDeAnalistas: any[] = []
                                values.analistas.forEach((res: any) => {
                                    if (res.usuAnalistaMesaID === undefined) {
                                        delete res.usuarioAnalista.nombre
                                        delete res.usuarioAnalista.usuario
                                        arregloDeAnalistas.push(res)
                                    } else {


                                        let analista: any = {
                                            usuAnalistaMesaID: res.usuAnalistaMesaID,
                                            activo: res.activo,
                                            usuarioAnalista: {
                                                usuarioID: res.usuarioAnalista.usuarioID
                                            },
                                            mesaCreditoAnalista: {
                                                mesaCreditoId: props.Id
                                            }
                                        }
                                        arregloDeAnalistas.push(analista)
                                    }

                                })
                                values.analistas = arregloDeAnalistas;
                                delete values.productoId
                                delete values.directorId
                                delete values.analistaId

                                Funciones.FNUpdate(props.Seguridad, props.Id, { ...values })

                                    .then((respuesta: any) => {
                                        setLoading(false)
                                        props.cbActualizar(respuesta)
                                        setDprops(state => ({ ...state, initialValues: { activo: false, clave: '', nombre: '', directorMesa: {}, productos: [], analistas: [], directorId: 0, productoId: 0, analistaId: 0 } }))
                                        if (props.Id === undefined) {

                                            //if(dSeleccionados.length > 0)
                                            console.log("----> " + dSeleccionados)
                                            dSeleccionados.splice(0, dSeleccionados.length)
                                            dSeleccionadosAnalistas.splice(0, dSeleccionadosAnalistas.length)
                                            dSeleccionadosProductos.splice(0, dSeleccionadosProductos.length)
                                            dDirectorGurdado.splice(0, dDirectorGurdado.length)
                                            dDirectorCambiado.splice(0, dDirectorCambiado.length)
                                        }
                                        props.fnCancelar()
                                    })
                                    .catch((error: any) => {
                                        toast.error(error.response.data.errors)
                                        //alert("Error al guardar la mesa de credito" + JSON.stringify(error))
                                        setLoading(false)
                                    })
                            }
                        }
                    }
                }

            }}>
            <Form>

                <React.Fragment>
                    <CustomFieldText disabled={loading}
                        label="Nombre" name="nombre" placeholder="Nombre" />
                    <CustomFieldText disabled={loading}
                        label="Clave" name="clave" placeholder="Clave" />

                    {props.Id === undefined ?
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor="directorId">Director</label>
                            <Field name="directorId" className="form-select"  >
                                {(control: any) => (
                                    <select
                                        disabled={!props.initialValues.activo}
                                        name="directorId"
                                        className="form-select"
                                        placeholder="Seleccione un director"
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("directorId", parseInt(value.target.value))
                                            let director = props.opcionesUsuario.find((res: any) => {
                                                return res.value === parseInt(value.target.value)
                                            })
                                            value = director
                                            if (props.Id) {
                                                directorSeleccionadoActualizar(value)
                                            } else {
                                                directorSeleccionado(value)
                                            }
                                        }
                                        }
                                    >
                                        <option value="0">{"Selecciona un director"}</option>
                                        {props.opcionesUsuario.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="directorId" className="text-danger" />
                        </div> :
                        <div className="mb-3">
                            <label className="form-label mb-0" htmlFor="directorId">Director</label>
                            <Field name="directorId" className="form-select"  >
                                {(control: any) => (
                                    <select
                                        disabled={!props.initialValues.activo}
                                        name="directorId"
                                        className="form-select"
                                        placeholder="Seleccione un director"
                                        value={props.initialValues.directorId}
                                        onChange={(value: any) => {
                                            control.form.setFieldValue("directorId", parseInt(value.target.value))
                                            control.form.setFieldValue("directorId", parseInt(value.target.value))
                                            let director = props.opcionesUsuario.find((res: any) => {
                                                return res.value === parseInt(value.target.value)
                                            })
                                            value = director
                                            if (props.Id) {
                                                directorSeleccionadoActualizar(value)
                                            } else {
                                                directorSeleccionado(value)
                                            }
                                        }
                                        }
                                    >
                                        <option value="0">{"Selecciona un director"}</option>
                                        {props.opcionesUsuario.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                    </select>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="directorId" className="text-danger" />
                        </div>
                    }

                    <div className="mb-3">
                        <label className="form-label mb-0" htmlFor="productoId">Producto</label>
                        <Field name="productoId" className="form-select">
                            {(control: any) => (
                                <select
                                    className="form-select"
                                    ref={ref => {
                                        selectRef = ref;
                                    }}
                                    disabled={!props.initialValues.activo}
                                    name="productoId"
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("productoId", parseInt(value.target.value))
                                        let producto = props.opcionesProducto.find((res: any) => {
                                            return res.value === parseInt(value.target.value)
                                        })
                                        value = producto
                                        if (props.Id) {
                                            productoSeleccionadoActualizar(value)

                                        } else {
                                            productoSeleccionado(value)

                                        }
                                    }
                                    }

                                >
                                    <option value="0">{"Seleccione un producto"}</option>
                                    {props.opcionesProducto.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                </select>
                            )}
                        </Field>
                        <ErrorMessage component="div" name="productoId" className="text-danger" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label mb-0" htmlFor="analistaId">Analista</label>
                        <Field name="analistaId" className="form-select">
                            {(control: any) => (
                                <select
                                    className="form-select"
                                    disabled={!props.initialValues.activo}
                                    name="analistaId"
                                    onChange={(value: any) => {
                                        control.form.setFieldValue("analistaId", parseInt(value.target.value))

                                        let analista = props.opcionesUsuario.find((res: any) => {
                                            return res.value === parseInt(value.target.value)
                                        })
                                        value = analista
                                        if (props.Id) {
                                            analistaSeleccionadoActualizar(value)
                                        } else {
                                            analistaSeleccionado(value)
                                        }
                                    }
                                    }
                                >
                                    <option value="0">{"Seleccione un Analista"}</option>
                                    {props.opcionesUsuario.map((optn, index) => <option key={index} value={optn.value} label={optn.label} />)}
                                </select>
                            )}
                        </Field>
                        <ErrorMessage component="div" name="analistaId" className="text-danger" />
                    </div>

                    {props.Id === undefined ?
                        <div>
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                <Field disabled={loading} type="checkbox" className="form-check-input" id="activo" name="activo" onClick={() => { cambiarEstadoActivo() }} />
                                <label className="form-check-label" htmlFor="activo">Activo</label>
                            </div>
                            <ErrorMessage component="div" name="activo" className="text-danger" />
                        </div> : <div>
                            <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                                <Field disabled={loading} type="checkbox" className="form-check-input" id="activo" name="activo" onChange={() => cambiarEstadoActivo()} />
                                <label className="form-check-label" htmlFor="activo">Activo</label>
                            </div>
                            <ErrorMessage component="div" name="activo" className="text-danger" />
                        </div>
                    }
                    <label className="form-label mb-0" htmlFor="analistaId">Analistas Asignados</label>
                    {props.initialValues.analistas.length > 0 ?
                        <DataTable
                            data={props.initialValues.analistas}
                            striped
                            pagination
                            dense
                            noHeader
                            responsive
                            keyField={"usuarioAnalista.usuarioID"}
                            defaultSortField={"usuarioAnalista.usuarioID"}
                            columns={[
                                {
                                    name: 'Id',
                                    selector: 'usuarioAnalista.usuarioID',
                                    sortable: true,
                                    wrap: true,
                                },
                                {
                                    name: 'Nombre',
                                    selector: 'usuarioAnalista.nombre',
                                    sortable: true,
                                    wrap: true,
                                },
                                {
                                    name: 'Activo',
                                    selector: 'activo',
                                    sortable: true,
                                    wrap: true,
                                    cell: (props) => <span>{props.activo ? "SI" : "No"}</span>
                                },
                                {
                                    name: 'Activar/Desactivar',
                                    sortable: false,
                                    wrap: true,
                                    center: true,
                                    cell: (propss) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                            console.log("props ")
                                            if (props.initialValues.activo === true)
                                                mostrarBotonMetodoAc(propss)
                                            else
                                                toast.warning("La mesa se encuentra desactivada")

                                        }}>
                                            {
                                                propss.activo ?
                                                    <FaCheckSquare /> : null ?? <FaRegSquare />


                                            }
                                        </button>
                                }
                            ]}
                        /> :
                        <DataTable
                            data={dSeleccionados}
                            striped
                            pagination
                            dense
                            noHeader
                            responsive
                            keyField={"value"}
                            defaultSortField={"value"}
                            columns={[
                                {
                                    name: 'Id',
                                    selector: 'value',
                                    sortable: true,
                                    wrap: true,
                                },
                                {
                                    name: 'Nombre',
                                    selector: 'label',
                                    sortable: true,
                                    wrap: true,
                                },
                                {
                                    name: 'Activo',
                                    selector: 'activo',
                                    wrap: true,
                                    sortable: true,
                                    cell: (props) => <span>{props.activo ? "SI" : "No"}</span>
                                },
                                {
                                    name: 'Activar/Desactivar',
                                    sortable: false,
                                    wrap: true,
                                    center: true,
                                    cell: (props) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                            console.log("props " + props)
                                            mostrarBotonMetodo(props)
                                        }}>
                                            {
                                                props.activo ?
                                                    <FaCheckSquare /> : null ?? <FaRegSquare />


                                            }
                                        </button>
                                }
                            ]}
                        />
                    }
                    <label className="form-label mb-0" htmlFor="analistaId">Productos</label>

                    {props.initialValues.productos.length > 0 ?
                        <DataTable
                            data={props.initialValues.productos}
                            striped
                            pagination
                            dense
                            noHeader
                            responsive
                            keyField={"productoCredito.productoId"}
                            defaultSortField={"productoCredito.productoId"}
                            columns={[
                                {
                                    name: 'Id',
                                    selector: 'productoCredito.productoId',
                                    sortable: true,
                                    wrap: true,
                                },
                                {
                                    name: 'Nombre',
                                    selector: 'productoCredito.producto',
                                    sortable: true,
                                    wrap: true,
                                },
                                {
                                    name: 'Activo',
                                    selector: 'activo',
                                    sortable: true,
                                    wrap: true,
                                    cell: (props) => <span>{props.activo ? "SI" : "No"}</span>
                                },
                                {
                                    name: 'Activar/Desactivar',
                                    sortable: false,
                                    wrap: true,
                                    center: true,
                                    cell: (propss) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                            console.log("propss " + propss)
                                            if (props.initialValues.activo === true)
                                                mostrarBotonMetodoProductos(propss)
                                            else
                                                toast.warning("La mesa se encuentra desactivada")
                                        }}

                                        >

                                            {
                                                propss.activo ?
                                                    <FaCheckSquare /> : null ?? <FaRegSquare />


                                            }
                                        </button>
                                }
                            ]}
                        /> :
                        <DataTable
                            data={dSeleccionadosProductos}
                            striped
                            pagination
                            dense
                            noHeader
                            responsive
                            keyField={"productoCredito.productoId"}
                            defaultSortField={"productoCredito.productoId"}
                            columns={[
                                {
                                    name: 'Id',
                                    selector: 'productoCredito.productoId',
                                    sortable: true,
                                    wrap: true,

                                },
                                {
                                    name: 'Nombre',
                                    selector: 'productoCredito.nombre',
                                    sortable: true,
                                    wrap: true,

                                },
                                {
                                    name: 'Activo',
                                    selector: 'activo',
                                    sortable: true,
                                    wrap: true,
                                    cell: (props) => <span>{props.activo ? "SI" : "No"}</span>
                                },
                                {
                                    name: 'Activar/Desactivar',
                                    sortable: false,
                                    center: true,
                                    wrap: true,
                                    cell: (props) =>
                                        <button className="asstext" type={"button"} onClick={() => {
                                            console.log("props " + props)
                                            mostrarBotonMetodoProductos(props)
                                        }}>
                                            {
                                                props.activo ?
                                                    <FaCheckSquare /> : null ?? <FaRegSquare />


                                            }
                                        </button>
                                }
                            ]}
                        />
                    }
                    {loading && <Spinner />}
                    {!loading &&
                        <div className="text-end">
                            <button type="reset" className="btn btn-danger waves-effect waves-light" onClick={() => {
                                if (props.Id === undefined) {

                                    //if(dSeleccionados.length > 0)
                                    console.log("----> " + dSeleccionados)
                                    dSeleccionados.splice(0, dSeleccionados.length)
                                    dSeleccionadosAnalistas.splice(0, dSeleccionadosAnalistas.length)
                                    dSeleccionadosProductos.splice(0, dSeleccionadosProductos.length)
                                    dDirectorGurdado.splice(0, dDirectorGurdado.length)
                                    dDirectorCambiado.splice(0, dDirectorCambiado.length)
                                }
                                props.fnCancelar()
                            }}>
                                Cancelar
                            </button>
                            <button type="submit" className="ms-2 btn btn-success waves-effect waves-light">Ok</button>
                        </div>
                    }
                </React.Fragment>
            </Form>
        </Formik>
    )
}