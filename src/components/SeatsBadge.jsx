// Seats shown with text AND colour (not colour alone).
export default function SeatsBadge({ seatsLeft }) {
  if (seatsLeft === 0) return <span className="tag soldout">Full</span>;
  if (seatsLeft <= 3) return <span className="tag low">Only {seatsLeft} seats left</span>;
  return <span className="tag ok">{seatsLeft} seats left</span>;
}
