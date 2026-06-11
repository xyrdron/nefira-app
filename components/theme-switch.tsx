"use client";

import { FC } from "react";
import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: {
    base?: string;
    control?: string;
  };
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const isSelected = theme === "light" || isSSR;

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <Switch
      isSelected={isSelected}
      aria-label={`Switch to ${isSelected ? "dark" : "light"} mode`}
      onChange={handleToggle}
      className={clsx(
        "px-px transition-opacity hover:opacity-80 cursor-pointer",
        className,
        classNames?.base,
      )}
    >
      <Switch.Control
        className={clsx(
          "w-auto h-auto bg-transparent rounded-lg flex items-center justify-center pt-px px-0 mx-0",
          "!text-default-500 group-data-[selected=true]:bg-transparent",
          classNames?.control
        )}
      >
        {isSelected ? (
          <SunFilledIcon size={22} />
        ) : (
          <MoonFilledIcon size={22} />
        )}
      </Switch.Control>
    </Switch>
  );
};