import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Sanity Webhook Handler
 *
 * This endpoint receives webhooks from Sanity.io when content changes
 * and triggers a redeployment of the site on Vercel.
 *
 * Setup Instructions:
 * 1. Get your Vercel Deploy Hook URL from Vercel Dashboard
 * 2. Add VERCEL_DEPLOY_HOOK to your Vercel environment variables
 * 3. Configure Sanity webhook to POST to: https://your-domain.vercel.app/api/revalidate
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify the request is from Sanity (optional but recommended)
    const sanityWebhookSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (sanityWebhookSecret) {
      const signature = req.headers['sanity-webhook-signature'];

      if (signature !== sanityWebhookSecret) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ message: 'Invalid signature' });
      }
    }

    // Get the Deploy Hook URL from environment variables
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK;

    if (!deployHookUrl) {
      console.error('VERCEL_DEPLOY_HOOK environment variable not set');
      return res.status(500).json({
        message: 'Deploy hook not configured',
        error: 'VERCEL_DEPLOY_HOOK environment variable is missing'
      });
    }

    // Log the webhook payload for debugging
    console.log('Sanity webhook received:', {
      _type: req.body?._type,
      _id: req.body?._id,
      timestamp: new Date().toISOString()
    });

    // Trigger Vercel deployment
    const deployResponse = await fetch(deployHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!deployResponse.ok) {
      throw new Error(`Deploy hook failed: ${deployResponse.statusText}`);
    }

    const deployData = await deployResponse.json();

    return res.status(200).json({
      message: 'Deployment triggered successfully',
      deployment: deployData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook error:', error);

    return res.status(500).json({
      message: 'Failed to trigger deployment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
