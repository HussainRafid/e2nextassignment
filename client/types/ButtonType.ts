interface ButtonProps {
  text: string;
  action?: () => void;
  type?: "button" | "submit";
  icon?:string;
  status?:"primary" | "accent" | "error"
  isDisabled?:boolean
}

export default ButtonProps