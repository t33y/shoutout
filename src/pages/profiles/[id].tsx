import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import ErrorPage from "next/error";
import { ProfileImage } from "../../components/ProfileImage";
import Head from "next/head";
import Link from "next/link";
import { IconHoverEffect } from "~/components/IconHoverEffect";
import { VscArrowLeft } from "react-icons/vsc";
import { InfinteTweetFeed } from "~/components/InfinteTweetFeed";
import { Button } from "../../components/Button";
import { useSession } from "next-auth/react";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });

  if (profile == null || profile.name == null)
    return <ErrorPage statusCode={404} />;

  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const trpcUtils = api.useContext();
  const toggleFollow = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;

        const modifier = addedFollow ? 1 : -1;

        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + modifier,
        };
      });
    },
  });

  return (
    <>
      <Head>
        <title> {`Shout-Out - ${profile.name}`} </title>
      </Head>
      <header className=" sticky top-24 z-10 flex gap-2 border-b bg-white px-2 py-4 dark:bg-slate-700">
        <div className="flex items-center justify-center">
          <Link className=" mr-2" href={".."}>
            <IconHoverEffect>
              <VscArrowLeft className=" h-6 w-6" />
            </IconHoverEffect>
          </Link>
          <h1 className=" text-lg font-bold"> {profile.name}</h1>
        </div>
      </header>
      <div className="flex flex-col items-center gap-4 border-b bg-white px-4 py-8 dark:bg-slate-500 dark:text-white">
        <ProfileImage
          src={profile.image}
          className=" h-32 w-32 flex-shrink-0"
        />
        <div className=" ml-2  flex-grow">
          <div className="flex items-center justify-center">
            <Link className=" mr-2" href={".."}>
              <IconHoverEffect>
                <VscArrowLeft className=" h-6 w-6" />
              </IconHoverEffect>
            </Link>
            <h1 className=" text-lg font-bold"> {profile.name}</h1>
          </div>
          <div className=" text-gray-500 dark:text-white">
            {profile.tweetsCount}{" "}
            {getPlural(profile.tweetsCount, "shout out", "shout outs")} -{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "follower", "followers")} -{" "}
            {profile.followsCount} following
          </div>
        </div>
        <FollowButton
          isLoading={toggleFollow.isLoading}
          isFollowing={profile.isFollowing}
          userId={id}
          onClick={() => toggleFollow.mutate({ userId: id })}
        />
      </div>
      <InfinteTweetFeed
        tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
        isLoading={tweets.isLoading}
        isError={tweets.isError}
        hasMore={tweets.hasNextPage}
        fetchNewTweets={tweets.fetchNextPage}
      />
    </>
  );
};

const FollowButton = ({
  isLoading,
  isFollowing,
  userId,
  onClick,
}: {
  isLoading: boolean;
  isFollowing: boolean;
  userId: string;
  onClick: () => void;
}) => {
  const session = useSession();

  if (session.status !== "authenticated" || session.data.user.id === userId)
    return null;

  return (
    <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {" "}
      {isFollowing ? "Unfollow" : "Follow"}{" "}
    </Button>
  );
};
const pluralRules = new Intl.PluralRules();
const getPlural = (count: number, singular: string, plural: string) => {
  return pluralRules.select(count) === "one" ? singular : plural;
};
export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const id = context.params?.id;
  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export default ProfilePage;
