import Navbar from "@/components/Navbar";
import CreatePost from "@/components/feeds/CreatePost";
import FeedList from "@/components/feeds/FeedList";
import LoadMoreButton from "@/components/feeds/LoadMoreButton";

export default function FeedPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen flex justify-center pb-8 px-4 sm:px-6">
        <div className="w-full max-w-2xl space-y-4">
          <CreatePost />
          <FeedList />
          <LoadMoreButton />
        </div>
      </main>
    </>
  );
}