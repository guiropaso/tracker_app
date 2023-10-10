import { NextAuthOptions } from "next-auth";
import { db } from './db'
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import {nanoid} from 'nanoid'   

export const authOptions: NextAuthOptions = {
    //adapter: PrismaAdapter(db),

    session: {
        strategy: 'jwt'
    },

    pages: {
        signIn: '/sign-in'
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],

    callbacks: {

        async signIn({profile}) {
            
            if(!profile?.email) {
                console.log('email: ', profile?.email)
                throw new Error('No profile')
            }

            try {

                const dbUser = await db.user.upsert({
                    where: {
                        email: profile?.email
                    },
                    create: {
                        email: profile?.email,
                        name: profile?.name,
                        avatar: profile?.picture
                    },
                    update: {
                        name: profile?.name,
                        avatar: profile?.picture
                    }
                })

                if(dbUser) {
                    return true
                } else {
                    return false
                }
            } catch(error) {
                console.error(error)
                return false
            }

        },

        async session({session, token}){
            session.user.id = token.id
            
            return session
        },

        async jwt({token,user,profile}) {
            
            
            
            if(profile) {
                console.log('JWT cb profile: ' ,profile)
                const user = await db.user.findUnique({
                    where: {
                        email: profile.email,
                    },
                })
                if(!user) {
                    throw new Error('No user found')
                }
                token.id = user.id
            }
            
            return token









            // const dbUser = await db.user.findFirst({
            //     where: {
            //         email: token.email,
            //     },
            // })
            
            // console.log('Initial dbUser: ',dbUser)

            // if(!dbUser) {
            //     console.log('If not dbUser entered')
            //     console.log('User as comes from Google: ',user)
            //     token.id = user!.id
            //     return token
            // }

            // if(!dbUser.username) {
            //     console.log('If not username entered')
            //     await db.user.update({
            //         where: {
            //             id: dbUser.id,
            //         },
            //         data: {
            //             username: nanoid(10)
            //         }
            //     })
            // }

            // return {
            //     id: dbUser.id,
            //     name: dbUser.name,
            //     email: dbUser.email,
            //     picture: dbUser.image,
            //     username: dbUser.username,
            // }
        },

    }
}