export default function LoadMoreButton() {
  return (
    <button
      className="
        w-full
        rounded-[24px]
        border
        border-pink-300
        bg-pink-100/80
        py-3.5
        text-sm
        font-semibold
        text-purple-700
        shadow-sm
        transition
        hover:bg-pink-200/80
        active:scale-[0.99]
        cursor-pointer
      "
    >
      Load Older Feeds
    </button>
  );
}