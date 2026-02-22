export function HistorySection({ history }) {
  return (
    <ul
      id="history"
      aria-live="polite"
      style={{
        textAlign: `left`,
      }}
    >
      {history.map((h) => (
        <li>
          Player({h.player}) vs CPU({h.cpu}): {h.msg}
        </li>
      ))}
    </ul>
  );
}
