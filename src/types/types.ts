import React, {
  ChangeEventHandler,
  MouseEvent,
  KeyboardEvent,
  KeyboardEventHandler,
} from "react";

export type KeyboardInputHandler = React.KeyboardEventHandler<
  HTMLTextAreaElement | HTMLInputElement
>;
export type InputHandler = ChangeEventHandler<HTMLInputElement>;
export type ButtonEventHandler = MouseEvent<HTMLButtonElement>;
export type msgBoxColor = "error" | "info" | "success" | "";
