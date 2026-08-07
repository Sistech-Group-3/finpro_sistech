import Navbar from "@/components/Navbar";
import CreatePost from "@/components/feeds/CreatePost";
import FeedList from "@/components/feeds/FeedList";
import LoadMoreButton from "@/components/feeds/LoadMoreButton";

export default function FeedPage() {
  return (
    <div className="min-h-screen w-full bg-[#FBD9EC]">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-[9999]">
        <Navbar />
      </header>

      {/* Page */}
      <main className="w-full flex justify-center pt-20 pb-10">
        <div className="w-full max-w-[430px]">
          <div className="px-5 space-y-4">
            <CreatePost />
            <FeedList />
            <LoadMoreButton />
          </div>
        </div>
      </main>
    </div>
  );
}