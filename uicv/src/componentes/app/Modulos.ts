import { FaList, FaMoneyBill, FaCoins, FaUserShield, FaCreditCard, FaCubes, FaTicketAlt, FaClipboardList, FaUserPlus } from "react-icons/fa"
type ModuloType = {
    Nombre: string,
    Etiqueta: string,
    Icono: any,
    Ruta: string
}

// ZONE_ROLES
export const Modulos: ModuloType[] = [
    { Nombre: 'CATALOGOS', Etiqueta: 'Catalogos', Icono: FaList, Ruta: 'catalogos' },
    { Nombre: 'ARCHIVO', Etiqueta: 'Archivo', Icono: FaList, Ruta: 'archivo' },
    { Nombre: 'BANCOS', Etiqueta: 'Bancos', Icono: FaMoneyBill, Ruta: 'bancos' },
    { Nombre: 'TESORERIA', Etiqueta: 'Tesoreria', Icono: FaCoins, Ruta: 'tesoreria' },
    { Nombre: 'CAJAS', Etiqueta: 'Cajas', Icono: FaCoins, Ruta: 'cajas' },
    { Nombre: 'CREDITOS', Etiqueta: 'Créditos', Icono: FaCreditCard, Ruta: 'creditos' },
    { Nombre: 'DISTRIBUIDORES', Etiqueta: 'Socias', Icono: FaTicketAlt, Ruta: 'distribuidores' },
    { Nombre: 'MESA DE CREDITO', Etiqueta: 'Mesa de credito', Icono: FaClipboardList, Ruta: 'Mesadecredito' },
    { Nombre: 'PROSPECCION', Etiqueta: 'Prospección', Icono: FaUserPlus, Ruta: 'Prospeccion' },
    { Nombre: 'COBRANZA', Etiqueta: 'Cobranza', Icono: FaUserPlus, Ruta: 'Cobranza' },

]

// REALM ROLES
export const ModulosRealm: ModuloType[] = [
    { Nombre: 'ADMINISTRACION', Etiqueta: 'Administracion', Icono: FaCubes, Ruta: 'administracion' },
    { Nombre: 'SEGURIDAD', Etiqueta: 'Seguridad', Icono: FaUserShield, Ruta: 'seguridad' },
    { Nombre: 'ARCHIVO', Etiqueta: 'Archivo', Icono: FaUserShield, Ruta: 'archivo' },
]