import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";

function setTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  return <Form />;
}

function Form() {
  const [inputValue, setInputValue] = useState("");
  const session = useSession();
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    setTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useContext();

  useLayoutEffect(() => {
    setTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  if (session.status !== "authenticated") return null;

  const createTweet = api.tweet.create.useMutation({
    onSuccess(newTweet) {
      setInputValue("");
      if (session.status !== "authenticated") return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCachedTweet = {
          ...newTweet,
          likedByMe: false,
          likesCount: 0,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCachedTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createTweet.mutate({ content: inputValue });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-b px-4 py-2 "
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          ref={inputRef}
          className=" flex-grow resize-none overflow-hidden rounded-sm p-4 text-lg outline-none"
          placeholder="Make a shout out..."
        />
      </div>
      <Button
        type="submit"
        small
        className=" self-end sm:px-4  sm:py-2"
        gray={false}
      >
        {" "}
        Shout Out
      </Button>
    </form>
  );
}
