import React from 'react'
import { Link } from 'react-router-dom'

// Context
type TopMenuContextType = {
    path?: string
}
const TopMenuContextDefault: TopMenuContextType = {}
const TopMenuContext = React.createContext(TopMenuContextDefault)

// Generate our component
type MenuType = { 
    children: any ,
    path: string
}
const TopMenu = ({ children, path }:MenuType ) => (
    <div className="flex-grow-1">
        <ul id="pcss3mm" className="pcss3mm pcss3mm-collapsable">
            <li className="opener">
                <a href="#/"><i className="icon-reorder"></i>MENÚ</a>
            </li>
            <TopMenuContext.Provider value={{ path }}>
                {children}
            </TopMenuContext.Provider>
        </ul>
    </div>
)

// Single Menu
type SingleMenuType = {
    children: any,
    path: string
}
const SingleMenu = ({ children, path }: SingleMenuType) => (
    <TopMenuContext.Consumer>
        {(value: TopMenuContextType) => (
            <li><Link to={path} className={`${ path === value.path && "active" }`}>{children}</Link></li>
        )}
    </TopMenuContext.Consumer>
)

// DropDown
type DropDownType = {
    label: any,
    children: any,
    path: string,
    right?: boolean
}
const DropDown = ({ label, children, path, right }: DropDownType) => (
    <TopMenuContext.Consumer>
        {(value: TopMenuContextType) => (
            <li className={`${right && "right"} dropdown`}>
                <a href="#/" className={`${ (value.path as string).indexOf(path) >= 0 && "active" }`}><i className="icon-star"></i>{label}</a><b></b>
                <div className="grid-container3">
                    <ul>
                        {children}
                    </ul>
                </div>
            </li>
        )}
    </TopMenuContext.Consumer>
)

type SingleButtonType = {
    children: any,
    FN(par:any): any,
    PAR: any
}
const SingleButton = ({ children, FN, PAR }: SingleButtonType) => (
    <li><a onClick={() => FN(PAR) } href="#/">{children}</a></li>
)

TopMenu.SingleMenu = SingleMenu
TopMenu.DropDown = DropDown
TopMenu.SingleButton = SingleButton
export default TopMenu