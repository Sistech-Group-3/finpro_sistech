import FeedCard from "./FeedCard";

const feeds = [
  {
    id: 1,
    author: "Police Dept.",
    verified: true,
    critical: true,
    time: "2 hours ago",
    location: "Downtown",
    title: "Power outage reported in 5th Street Alleyway",
    content:
      "Street lighting is currently down between Broadway and Maple. Police presence has increased in the area. We recommend taking an alternative well-lit route if walking alone tonight.",
    helpful: 42,
    discuss: 12,
  },
  {
    id: 2,
    author: "Maria G.",
    verified: false,
    critical: false,
    time: "4 hours ago",
    location: "Riverside",
    content:
      "\"Just a heads up, the transit app is showing incorrect schedules for the late-night bus today. I had to wait 20 minutes alone. Better to call a rideshare or use the SafetyGuard Walk-With-Me feature.\"",
    image: "",
    helpful: 86,
    discuss: 5,
  },
  {
    id: 3,
    author: "Anonymous User",
    verified: false,
    critical: false,
    time: "6 hours ago",
    location: "Park District",
    content:
      "Found this broken gate in the north park entrance. Reported it to the city but be careful if you usually exit through here after dark as it's wide open.",
    image: "/images/broken-gate.jpg",
    helpful: 12,
    discuss: 2,
  },
];

export default function FeedList() {
  return (
    <div className="space-y-4">
      {feeds.map((feed) => (
        <FeedCard
          key={feed.id}
          author={feed.author}
          verified={feed.verified}
          critical={feed.critical}
          time={feed.time}
          location={feed.location}
          title={feed.title}
          content={feed.content}
          image={feed.image}
          helpful={feed.helpful}
          discuss={feed.discuss}
        />
      ))}
    </div>
  );
}