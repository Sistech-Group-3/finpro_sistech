"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2, ShieldCheck, AlertCircle, Send } from "lucide-react";

type Comment = {
  id: number;
  user: string;
  text: string;
};

type FeedCardProps = {
  author: string;
  verified?: boolean;
  critical?: boolean;
  time: string;
  location: string;
  title?: string;
  content: string;
  image?: string;
  helpful: number;
  discuss: number;
};

export default function FeedCard({
  author,
  verified = false,
  critical = false,
  time,
  location,
  title,
  content,
  image,
  helpful: initialHelpful,
  discuss: initialDiscuss,
}: FeedCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, user: "Sarah Jenkins", text: "Thanks for sharing this info! Stay safe everyone." },
    { id: 2, user: "Local Watch", text: "Noted, patrols are heading there now." },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    if (isLiked) {
      setHelpfulCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([...comments, { id: Date.now(), user: "You", text: newComment }]);
    setNewComment("");
  };

  return (
    <div className="rounded-[24px] border border-pink-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 sm:px-6 sm:pt-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-gray-950">
              {author}
            </span>

            {verified && (
              <span className="flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white tracking-wide">
                <ShieldCheck className="h-3 w-3" />
                VERIFIED
              </span>
            )}
          </div>

          <span className="mt-0.5 text-xs text-gray-400">
            {time} • {location}
          </span>
        </div>

        {critical && (
          <span className="flex items-center gap-1 rounded-full bg-[#3F209A] px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-white tracking-wide shadow-xs shrink-0">
            <AlertCircle className="h-3 w-3 text-pink-300" />
            CRITICAL ALERT
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-3.5 sm:px-6 sm:py-4">
        {title && (
          <h3 className="mb-2.5 text-base sm:text-xl font-bold text-gray-900 leading-snug">
            {title}
          </h3>
        )}

        <p className="text-xs sm:text-base leading-relaxed text-gray-600 whitespace-pre-line">
          {content}
        </p>

        {image && (
          <div className="mt-3.5 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <img
              src={image}
              alt="Feed attachment"
              className="h-48 sm:h-64 w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between border-t border-pink-100/80 px-5 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-medium text-gray-500">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition cursor-pointer ${
            isLiked ? "text-pink-600 font-bold" : "hover:text-pink-600"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-pink-600 text-pink-600" : ""}`} />
          <span>Helpful ({helpfulCount})</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 hover:text-pink-600 transition cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Discuss ({comments.length})</span>
        </button>

        <button
          onClick={() => alert("Link copied to clipboard!")}
          className="hover:text-pink-600 transition cursor-pointer p-1"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Comment Section (Collapsible) */}
      {showComments && (
        <div className="bg-pink-50/40 border-t border-pink-100 p-4 sm:p-5 space-y-3">
          <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-xl bg-white p-3 shadow-xs border border-pink-100/60">
                <p className="text-xs font-semibold text-purple-900">{comment.user}</p>
                <p className="text-xs text-gray-700 mt-0.5">{comment.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border border-pink-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-pink-400 text-gray-800"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl bg-[#4C28BC] px-4 py-2 text-white hover:bg-[#3D1F9E] transition cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}