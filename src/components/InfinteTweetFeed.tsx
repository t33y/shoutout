import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProfileImage } from "./ProfileImage";
import { signIn, useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import { IconHoverEffect } from "./IconHoverEffect";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  likedByMe: boolean;
  user: {
    image: string | null;
    id: string;
    name: string | null;
  };
};

type InfinteTweetFeedProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore?: boolean;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

export const InfinteTweetFeed = ({
  tweets,
  isLoading,
  isError,
  hasMore = false,
  fetchNewTweets,
}: InfinteTweetFeedProps) => {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error...</h1>;
  if (tweets == null || tweets?.length === 0)
    return (
      <h1 className=" my-4 text-center text-2xl text-gray-500">
        No Shout Outs
      </h1>
    );

  return (
    <ul>
      <InfiniteScroll
        dataLength={tweets.length}
        hasMore={hasMore}
        next={fetchNewTweets}
        loader={<LoadingSpinner />}
      >
        {tweets?.map((tweet) => {
          return (
            <TweetCard
              key={tweet.id}
              id={tweet.id}
              content={tweet.content}
              user={tweet.user}
              likedByMe={tweet.likedByMe}
              likesCount={tweet.likesCount}
              createdAt={tweet.createdAt}
            />
          );
        })}
      </InfiniteScroll>
    </ul>
  );
};
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

export const TweetCard = ({
  id,
  content,
  likedByMe,
  likesCount,
  user,
  createdAt,
}: Tweet) => {
  return (
    <li className=" my-4 flex gap-4 border-b px-4 py-4 ">
      <Link href={`/profiles/${user.id}`}>
        {" "}
        <ProfileImage src={user.image} />
      </Link>
      <div className=" flex flex-grow flex-col">
        <div className=" flex gap-1">
          <Link
            className=" text-lg font-bold outline-none hover:underline focus-visible:underline "
            href={`/profiles/${user.id}`}
          >
            {user.name}
          </Link>
          <span className=" text-gray-500">-</span>
          <span className=" text-gray-500">
            {dateFormatter.format(createdAt)}
          </span>
        </div>
        <p className=" whitespace-pre-wrap ">{content}</p>
        <HeartButton
          likedByMe={likedByMe}
          likesCount={likesCount}
          id={id}
          userId={user.id}
        />
      </div>
    </li>
  );
};

type HeartButtonProps = {
  id: string;
  likedByMe?: boolean;
  likesCount?: number;
  userId: string;
};

const HeartButton = ({
  likedByMe,
  likesCount,
  id,
  userId,
}: HeartButtonProps) => {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;
        if (oldData.pages[0]?.tweets == undefined) return;
        const modifier = addedLike ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likedByMe: addedLike,
                    likesCount: tweet.likesCount + modifier,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteProfileFeed.setInfiniteData(
        { userId },
        updateData
      );
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { isFollowing: true },
        updateData
      );
    },
  });
  const session = useSession();
  const handleClick = (id: { id: string }) => {
    toggleLike.mutate(id);
  };

  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;
  if (session.status !== "authenticated") {
    return (
      <button
        onClick={() => {
          void signIn();
        }}
        className=" my-1 flex cursor-pointer items-center gap-3 self-start text-gray-500"
      >
        <IconHoverEffect>
          <HeartIcon />
        </IconHoverEffect>
        <span>{likesCount}</span>
      </button>
    );
  }
  return (
    <button
      disabled={toggleLike.isLoading}
      onClick={() => handleClick({ id })}
      className={`group -ml-2 flex items-center gap-1 transition-colors duration-200 ${
        likedByMe
          ? " text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      } self-start`}
    >
      <IconHoverEffect red={true}>
        <HeartIcon
          className={`items-center transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      {toggleLike.isLoading ? <LoadingSpinner /> : <span>{likesCount}</span>}
    </button>
  );
};
