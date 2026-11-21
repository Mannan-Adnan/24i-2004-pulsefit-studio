// Shows the class picture (an emoji tile), or a clear fallback when it is missing.
export default function ClassImage({ emoji, title, large = false }) {
  const className = large ? 'item-image large' : 'item-image';

  if (!emoji) {
    return (
      <div className={className + ' missing'} role="img" aria-label={`No picture available for ${title}`}>
        <span>No picture</span>
      </div>
    );
  }

  return (
    <div className={className} role="img" aria-label={`Picture for ${title}`}>
      <span aria-hidden="true">{emoji}</span>
    </div>
  );
}
