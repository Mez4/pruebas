import classNames from "classnames"
import { isDesktop } from "./functions"
import { IAccion } from "../interfaces/redux/IAccion"

export const AppActions = {
    onInputStyleChange: "onInputStyleChange",
    onRipple: "onRipple",
    onLayoutModeChange: "onLayoutModeChange",
    onColorModeChange: "onColorModeChange",
    onWrapperClick: "onWrapperClick",
    onToggleMenuClick: "onToggleMenuClick",
    onMobileTopbarMenuClick: "onMobileTopbarMenuClick",
    onMenuItemClick: "onMenuItemClick",
}

export type AppState = {
    layoutMode: string,
    staticMenuInactive: boolean,
    overlayMenuActive: boolean,
    mobileMenuActive: boolean,
    mobileTopbarMenuActive: boolean,
    inputStyle: string,
    ripple: boolean,
    layoutColorMode: string
}

export const AppStateDefault: AppState = {
    layoutMode: 'static',
    layoutColorMode: 'light',
    inputStyle: 'outlined',
    ripple: true,
    staticMenuInactive: false,
    overlayMenuActive: false,
    mobileMenuActive: false,
    mobileTopbarMenuActive: false
}

/**
 * Generate our wrapper classname
 * @param {AppState} state Current app State 
 * @returns {String} className to use in our component
 */
export const generateClassName = (state: AppState): string => classNames('layout-wrapper', {
    'layout-overlay': state.layoutMode === 'overlay',
    'layout-static': state.layoutMode === 'static',
    'layout-static-sidebar-inactive': state.staticMenuInactive && state.layoutMode === 'static',
    'layout-overlay-sidebar-active': state.overlayMenuActive && state.layoutMode === 'overlay',
    'layout-mobile-sidebar-active': state.mobileMenuActive,
    'p-input-filled': state.inputStyle === 'filled',
    'p-ripple-disabled': state.ripple === false,
    'layout-theme-light': state.layoutColorMode === 'light'
});

/**
 * Modifies the state of our application
 * @param {AppState} state Current state of our application, inital load most come from user-profile 
 * @param {IAccion} action Generic action to perform in our application 
 * @returns {AppState} New state of our application
 */
export const reducer = (state: AppState, action: IAccion): AppState => {

    switch (action.type) {

        case AppActions.onInputStyleChange:
            return { ...state, inputStyle: action.Payload ?? 'outlined' }

        // On a ripple mode change
        case AppActions.onRipple:
            return { ...state, ripple: action.Payload ?? true }

        // On a layout mode change
        case AppActions.onLayoutModeChange:
            return { ...state, layoutMode: action.Payload ?? 'static' }

        // ON a color mode change
        case AppActions.onColorModeChange:
            return { ...state, layoutColorMode: action.Payload ?? 'light' }

        // On wrapper click (There is a change here where wrapperClick disables everything (even mobile menu on desktop and vice-versa))
        case AppActions.onWrapperClick:
            return { ...state, mobileTopbarMenuActive: false, overlayMenuActive: false, mobileMenuActive: false }

        // Toogle our sidebar action
        case AppActions.onToggleMenuClick:
            // On Mobile, we only change our mobileMenuActive
            if (!isDesktop()) return { ...state, mobileMenuActive: !state.mobileMenuActive, mobileTopbarMenuActive: false }

            // OnDesktop and with an overlay layout mode
            if (state.layoutMode === 'overlay') return { ...state, overlayMenuActive: !state.overlayMenuActive, mobileMenuActive: false, mobileTopbarMenuActive: false }

            // OnDesktop and with an static layout mode
            if (state.layoutMode === 'static') return { ...state, staticMenuInactive: !state.staticMenuInactive, mobileTopbarMenuActive: false }

            // If everything else fails, return our default state
            return state

        // On Mobile menu item click
        case AppActions.onMobileTopbarMenuClick:
            return { ...state, mobileTopbarMenuActive: !state.mobileTopbarMenuActive }

        // On a menu item click (Sidebar only)
        case AppActions.onMenuItemClick:
            if (state.mobileMenuActive || state.overlayMenuActive)
                return { ...state, mobileMenuActive: false, overlayMenuActive: false }
            return state

        // Action not found
        default:
            return state
    }
}