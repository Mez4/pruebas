import React from 'react'
/**
 * Detalle del menú
 */
 type MenuBarraTituloTipo = {
    Titulo: JSX.Element | string,
    children: JSX.Element | JSX.Element[],
    badge?: string,
    badge_class?: string
    styleButton?: {}
}

/**
 * Mostramos un menu en la barra de titulo
 * @param param Detalle del menú para mostrar
 */
const MenuBarra = ({ Titulo, children, badge, badge_class, styleButton }: MenuBarraTituloTipo) => {
    const [open, setOpen] = React.useState(false)
    return (
        <div className="dropdown d-inline-block" onMouseLeave={() => { setOpen(false) }} onClick={() => { if (open === true) setOpen(false) }}>
            <button style={styleButton} onClick={() => setOpen(!open)} type="button" className="btn header-item noti-icon waves-effect me-2" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {Titulo}
            </button>
            <div className={`dropdown-menu dropdown-menu-end ${open && 'show'}`} style={{ top: '20px' , position: 'absolute', margin: "0px", transform: "translate3d(-100px, 72px, 0px)", zIndex: 100 }} data-popper-placement="bottom-end">
                {children}
            </div>
        </div>

    )
}

export default MenuBarra