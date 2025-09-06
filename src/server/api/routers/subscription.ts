import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { whop } from "~/lib/whop";
import { eq } from "drizzle-orm";
import { subscriptions } from "~/server/db/schema";

export const subscriptionRouter = createTRPCRouter({
  current: protectedProcedure
    .query(async ({ ctx }) => {
      // Get current user's subscription from database
      const subscription = await ctx.db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, ctx.session.user.id),
        orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
      });

      return subscription;
    }),

  // Check Whop membership status
  checkWhopMembership: protectedProcedure
    .input(z.object({
      productId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.email) {
          return { hasAccess: false, memberships: [] };
        }

        // Get user by email from Whop
        const user = await whop.users.getByEmail(ctx.session.user.email);
        
        if (!user) {
          return { hasAccess: false, memberships: [] };
        }

        const memberships = user.memberships || [];
        const validMemberships = memberships.filter((membership: any) => {
          if (!membership.valid) return false;
          if (input.productId && membership.product_id !== input.productId) return false;
          return true;
        });

        return {
          hasAccess: validMemberships.length > 0,
          memberships: validMemberships,
          whopUser: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        };
      } catch (error) {
        console.error('Error checking Whop membership:', error);
        return { hasAccess: false, memberships: [] };
      }
    }),

  // Create Whop payment session
  createWhopPayment: protectedProcedure
    .input(z.object({
      productId: z.string(),
      planId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session.user.email) {
          throw new Error("User email is required");
        }

        // Create payment with Whop SDK
        const payment = await whop.payments.chargeUser({
          userId: ctx.session.user.email, // Whop uses email as identifier
          amount: 0, // Amount determined by product
          currency: 'usd',
          productId: input.productId,
          planId: input.planId,
          metadata: {
            mongermaps_user_id: ctx.session.user.id,
            mongermaps_email: ctx.session.user.email,
            source: 'mongermaps_subscription',
          },
        });

        return {
          success: true,
          paymentId: payment.id,
          checkoutUrl: payment.checkout_session?.url || payment.url,
        };
      } catch (error) {
        console.error('Error creating Whop payment:', error);
        throw new Error('Failed to create payment session');
      }
    }),

  // Sync local subscription with Whop membership
  syncWithWhop: protectedProcedure
    .input(z.object({
      whopUserId: z.string(),
      membershipId: z.string(),
      productId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify the membership exists and is valid
        const whopUser = await whop.users.getUser(input.whopUserId);
        
        if (whopUser.email !== ctx.session.user.email) {
          throw new Error("Email mismatch between accounts");
        }

        const membership = whopUser.memberships?.find(
          (m: any) => m.id === input.membershipId && m.valid
        );

        if (!membership) {
          throw new Error("Valid membership not found");
        }

        // Create or update local subscription record
        const existingSubscription = await ctx.db.query.subscriptions.findFirst({
          where: eq(subscriptions.userId, ctx.session.user.id),
        });

        if (existingSubscription) {
          // Update existing subscription
          await ctx.db.update(subscriptions)
            .set({
              type: "WHOP_MEMBERSHIP",
              status: "ACTIVE",
              whopUserId: input.whopUserId,
              whopMembershipId: input.membershipId,
              whopProductId: input.productId,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.id, existingSubscription.id));
        } else {
          // Create new subscription
          await ctx.db.insert(subscriptions).values({
            userId: ctx.session.user.id,
            type: "WHOP_MEMBERSHIP",
            status: "ACTIVE",
            whopUserId: input.whopUserId,
            whopMembershipId: input.membershipId,
            whopProductId: input.productId,
            startDate: new Date(membership.created_at),
            amount: 0, // Amount not tracked for Whop memberships
          });
        }

        return { success: true };
      } catch (error) {
        console.error('Error syncing with Whop:', error);
        throw new Error('Failed to sync subscription');
      }
    }),

  // Get subscription status for UI
  getStatus: protectedProcedure
    .query(async ({ ctx }) => {
      // Check both local database and Whop
      const localSubscription = await ctx.db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, ctx.session.user.id),
        orderBy: (subscriptions, { desc }) => [desc(subscriptions.createdAt)],
      });

      // Also check Whop membership
      let whopMembership = null;
      try {
        if (ctx.session.user.email) {
          const user = await whop.users.getByEmail(ctx.session.user.email);
          if (user?.memberships) {
            whopMembership = user.memberships.find((m: any) => m.valid);
          }
        }
      } catch (error) {
        console.error('Error checking Whop membership:', error);
      }

      return {
        localSubscription,
        whopMembership,
        hasAccess: !!(localSubscription?.status === "ACTIVE" || whopMembership?.valid),
      };
    }),
});