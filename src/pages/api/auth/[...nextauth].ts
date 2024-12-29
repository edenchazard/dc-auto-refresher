import type { TokenSet } from 'next-auth';
import { db } from '../../../app/db';
import { userTable } from '../../../../database/schema';
import { eq } from 'drizzle-orm';
import { ofetch } from 'ofetch';
import NextAuth from 'next-auth';

const callbackUrl = `${process.env.NEXT_PUBLIC_DOMAIN}${process.env.NEXT_PUBLIC_BASE_URL}/callback/dragcave`;
console.log(callbackUrl);
export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    {
      id: 'dragcave',
      name: 'Dragon Cave',
      type: 'oauth',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      checks: ['state', 'pkce'],
      authorization: {
        url: 'https://dragcave.net/oauth_login',
        params: {
          scope: 'identify dragons',
          redirect_uri: callbackUrl,
        },
      },
      token: {
        async request(context) {
          const params = new URLSearchParams();
          params.append('grant_type', 'authorization_code');
          params.append('code_verifier', context.checks.code_verifier ?? '');
          params.append('code', context.params.code ?? '');
          params.append('client_id', context.client.client_id as string);
          params.append(
            'client_secret',
            context.client.client_secret as string,
          );
          params.append('redirect_uri', callbackUrl);

          const tokens = await ofetch<{ tokens: TokenSet }>(
            'https://dragcave.net/api/oauth2/token',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: params,
            },
          );

          return { tokens };
        },
      },
      userinfo: 'https://dragcave.net/api/v2/me',
      profile({ data: profile }) {
        return {
          id: profile.user_id,
          username: profile.username,
        };
      },
    },
  ],
  events: {
    async signIn({ user, account }) {
      // Update the user's access token.
      /*       await db
        .update(userTable)
        .set({
          accessToken: encrypt(
            account?.access_token ?? '',
            accessTokenPassword,
          ),
        })
        .where(eq(userTable.id, parseInt(user.id + ''))); */
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.sessionToken = account.access_token;
        const userId = parseInt(account.providerAccountId);

        await db.insert(userTable).ignore().values({
          id: userId,
          username: user.username,
        });
      }

      if (user) {
        token.userId = parseInt(user.id);
      }

      // only update last activity if it's been more than 5 minutes
      const now = new Date();
      if (
        token.userId &&
        (token.lastActivityTimestamp ?? 0) < now.getTime() - 1000 * 60 * 5
      ) {
        token.lastActivityTimestamp = now.getTime();

        await db
          .update(userTable)
          .set({ last_activity: now })
          .where(eq(userTable.id, token.userId));
      }

      return token;
    },
    async session({ session, token }) {
      const userId = token.userId;
      const user = '';
      session.user.id = users.id;
      session.user.username = users.username;
      session.user.money = users.money;
      session.user.role = users.role;

      return session;
    },
    redirect() {
      return callbackUrl;
    },
  },
});
