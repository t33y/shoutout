import { useSession } from "next-auth/react";
import { string, z } from "zod";
import type { createTRPCContext } from '../trpc';
import {createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";
import type { inferAsyncReturnType } from "@trpc/server";

export const tweetRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure.input(
    z.object({userId:z.string(),
      limit:z.number().optional(), 
      cursor:z.object({id:z.string(), createdAt:z.date()}).optional()
    }))
    .query(async ({input:{limit = 10 , cursor, userId}, ctx})=>{  
      
      return await getInfiniteFeed({
        whereClause: {userId} ,
        limit, cursor, ctx})

    }) ,
  infiniteFeed: publicProcedure.input(
    z.object({isFollowing:z.boolean().optional(),
      limit:z.number().optional(), 
      cursor:z.object({id:z.string(), createdAt:z.date()}).optional()
    }))
    .query(async ({input:{limit = 3 , cursor, isFollowing}, ctx})=>{  
      
      const currentUserId = ctx.session?.user.id
      return await getInfiniteFeed({
        whereClause: currentUserId == null || !isFollowing ? undefined : {user:{followers:{some:{id: currentUserId}}}} ,
        limit, cursor, ctx})

    }) ,
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input: {content}, ctx }) => {
      const tweet = await ctx.prisma.tweet.create({ 
        data:{content,  userId:ctx.session.user.id}
      })

      void ctx.ssgRevalidate?.(`/profiles/${ctx.session.user.id}`)

      return tweet;
    }),
    toggleLike : protectedProcedure.input(z.object({id : z.string()})).mutation(async ({input:{id}, ctx})=>{
      
      const data = {tweetId: id, userId: ctx.session.user.id}
      const existingLike = await ctx.prisma.like.findUnique({where:{userId_tweetId: data}})

      if(existingLike != null ){
        await ctx.prisma.like.delete({where:{userId_tweetId: data }})
        return {addedLike: false}
      }else {
        await ctx.prisma.like.create({data})
        return {addedLike: true}
      }
    }) 
});

const getInfiniteFeed = async ({whereClause, limit , cursor, ctx}:{whereClause?: Prisma.TweetWhereInput; 
  limit: number; 
  cursor:{id: string; createdAt: Date} | undefined;
  ctx:inferAsyncReturnType <typeof createTRPCContext> })=>{  
     
    const currentUserId = ctx.session?.user.id

  const data = await ctx.prisma.tweet.findMany({
    take:limit + 1,
    cursor: cursor? {createdAt_id:cursor} : undefined,
    orderBy: [{createdAt:"desc" }, {id:"desc"}],
    where: whereClause,
    select:{
      id:true,
      content:true,
      createdAt:true,
      likes: currentUserId == null ?  false: {where:{userId: currentUserId}} ,
      _count:{select:{likes:true}},
      user: {select:{id:true, image:true, name:true}}
    },
  })

  let nextCursor: typeof cursor | undefined
  if (data.length > limit){
    const nextItem = data.pop()
    if(nextItem != null){
      nextCursor = {id:nextItem.id, createdAt:nextItem.createdAt}
    }
  }

  return {tweets: data.map((tweet)=>{
    return {
      id: tweet.id,
      content: tweet.content,
      createdAt: tweet.createdAt,
      likesCount: tweet._count.likes,
      likedByMe: tweet.likes?.length > 0,
      user: tweet.user
    }
  }), nextCursor}

}