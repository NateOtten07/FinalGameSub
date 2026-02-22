import { capitalize } from "../../utils/string_formatting";

export function MoveButton({ label, onClick }) {
  return (
    <button data-move={label} onClick={onClick}>
      {capitalize(label)}
    </button>
  );
}
