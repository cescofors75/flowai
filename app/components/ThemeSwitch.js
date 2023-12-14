import { useColorMode, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

export  function ThemeSwitch (){
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";
    return (
      <IconButton
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={isDark ? <FaSun /> : <FaMoon />}
        title="Cambiar el tema Light/Dark"
      />
    );
  };
  
