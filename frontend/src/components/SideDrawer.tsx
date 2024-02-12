import { Drawer } from '@mui/material'
import React from 'react'
import { Anchor } from '../type/SideDrawer'

type SideDrawerProps = {
    anchor: Anchor;
    open: boolean;
    toggleDrawer: (anchor: Anchor,open: boolean) => (e: React.MouseEvent) => void;
    list: JSX.Element
}

const SideDrawer: React.FC<SideDrawerProps> = ({anchor,open,toggleDrawer, list}) => {
  return (
    <Drawer anchor={anchor} open={open} onClick={toggleDrawer(anchor, false)}>
		{list}
	</Drawer>
  )
}

export default SideDrawer