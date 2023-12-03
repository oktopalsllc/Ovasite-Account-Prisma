import Stripe from 'stripe';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const stripeKey = process.env.STRIPE_SECRET_KEY

export const PLANS = [
  {
    name: 'Free',
    slug: 'free',
    numberOfOrgs: 1,
    numberOfEmployees: 5,
    numberOfProjects: 1,
    numberOfForms: 5,
    numberOfSubmmissions: 100,
    offlineSubmission: true,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: '',
      },
    },
  },
  {
    name: 'Community',
    slug: 'community',
    numberOfOrgs: 3,
    numberOfEmployees: 40,
    numberOfProjects: 10,
    numberOfForms: 100,
    numberOfSubmmissions: 1000,
    offlineSubmission: true,
    price: {
      amount: 20,
      priceIds: {
        test: 'price_1O5Z5KKbQRs1dkxvC34iDfoS',
        production: '',
      },
    },
  },
  {
    name: 'Pro',
    slug: 'pro',
    numberOfOrgs: 5,
    numberOfEmployees: 70,
    numberOfProjects: 20,
    numberOfForms: 500,
    numberOfSubmmissions: 10000,
    offlineSubmission: true,
    price: {
      amount: 50,
      priceIds: {
        test: 'price_1O5Z6vKbQRs1dkxv49exxLRO',
        production: '',
      },
    },
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    numberOfOrgs: 'unlimited',
    numberOfEmployees: 'unlimited',
    numberOfProjects: 'unlimited',
    numberOfForms: 'unlimited',
    numberOfSubmmissions: 'unlimited',
    offlineSubmission: true,
    price: {
      amount: 100,
      priceIds: {
        test: 'price_1O5Z9TKbQRs1dkxvCDhzfObd',
        production: '',
      },
    },
  },
]

export const stripe = new Stripe(stripeKey ?? '', {
  apiVersion: '2023-08-16',
  typescript: false,
});

export const addNewCustomer = async (email) => {
	const customer = await stripe.customers.create({
		email,
		description: 'New Customer'
	});
  return customer
}

export const getCustomerByID = async (id) => {
	const customer = await stripe.customers.retrieve(id);
  return customer
}

export async function getUserSubscriptionPlan(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const PLANS = await prisma.subscription.findMany({
    include:{ price: true },
  });
  
  if (!user.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCurrentPeriodEnd: null,
    }
  }

  const isSubscribed = Boolean(
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd && // 86400000 = 1 day
    user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  )

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.testId === user.stripePriceId)
    : null

  let isCanceled = false
  if (isSubscribed && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    stripeSubscriptionId: user.stripeSubscriptionId,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    stripeCustomerId: user.stripeCustomerId,
    isSubscribed,
    isCanceled,
  }
};

