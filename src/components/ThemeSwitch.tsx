import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

function ThemeSwitch() {
  const [theme, setTheme] = useState("Light");

  const handleClick = () => {
    if (theme === "Light") {
      setTheme("Dark");
      localStorage.setItem("colorTheme", "Dark");
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "black";
    } else {
      setTheme("Light");
      localStorage.setItem("colorTheme", "Light");
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "white";
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("colorTheme");
    if (
      storedTheme === "Dark" ||
      (!storedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("Dark");
      localStorage.setItem("colorTheme", "Dark");
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "blacK";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "white";
    }
  }, []);

  return (
    <Tooltip
      title={theme === "Light" ? "Change to Dark Mode" : "Change to Light Mode"}
      arrow
    >
      <button
        onClick={handleClick}
        className=" flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white transition-all hover:bg-black/10"
      >
        {theme == "Light" ? <BsMoon /> : <BsSun />}
      </button>
    </Tooltip>
  );
}

export default ThemeSwitch;
