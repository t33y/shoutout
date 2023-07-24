import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {InfinteTweetFeed }from "~/components/InfinteTweetFeed";
import { NewTweetForm } from "~/components/NewTweetForm";
import { api } from "~/utils/api";


const TABS = ["Recent", "Following"] as const
const Home: NextPage = () => {
  const session = useSession()
  const [selectedTab, setSelectedTab] = useState<(typeof TABS)[number]> ("Recent")
  return (
    <> 
    <header className=" text-lg border-b mb-2 px-4 font-bold"> Home</header>
    {(session.status === "authenticated") && (<div className="flex">
     {TABS.map(tab=>{
        return <button onClick={()=> setSelectedTab(tab)} key={tab} className={` hover:bg-gray-200 focus-visible:bg-gray-200 text-center flex-grow p-2 ${tab === selectedTab ? "font-bold border-b-4 border-blue-500":""}`} >
          {tab}
        </button>
      })}
    </div>
      )}
    <NewTweetForm/>
    {selectedTab === "Recent" ? <RecentTweet/> : <FollowingTweet/>}
    </>
  );
};

const RecentTweet = ()=>{
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({}, {getNextPageParam:(lastpage)=>lastpage.nextCursor})
  return <InfinteTweetFeed
    tweets={tweets.data?.pages.flatMap(page=>page.tweets)}
    isLoading={tweets.isLoading}
    isError={tweets.isError}
    hasMore={tweets.hasNextPage}
    fetchNewTweets={tweets.fetchNextPage}
    />
}

const FollowingTweet = ()=>{
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({isFollowing:true}, {getNextPageParam:(lastpage)=>lastpage.nextCursor})
  return <InfinteTweetFeed
    tweets={tweets.data?.pages.flatMap(page=>page.tweets)}
    isLoading={tweets.isLoading}
    isError={tweets.isError}
    hasMore={tweets.hasNextPage}
    fetchNewTweets={tweets.fetchNextPage}
    />
}

export default Home;

