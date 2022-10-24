export interface MenuItemProps {
    title: string,
    icon?: undefined|JSX.Element
    onClick?: () => void
}

export default function MenuItem(props: MenuItemProps) {
    return props
}