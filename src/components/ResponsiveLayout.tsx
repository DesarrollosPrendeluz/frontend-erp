import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";


interface ResponsiveViewProps {
  mobileView: React.ReactNode;
  desktopView: React.ReactNode;
}

const ResponsiveView: React.FC<ResponsiveViewProps> = ({ mobileView, desktopView }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return <>{isMobile ? mobileView : desktopView} </>;
}

export default ResponsiveView;
