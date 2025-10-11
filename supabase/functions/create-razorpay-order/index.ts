// supabase/functions/create-razorpay-order/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req: Request) => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount } = await req.json()
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keyId || !keySecret) {
      throw new Error('Razorpay API keys are not set in environment variables.')
    }

    // Razorpay API requires Basic Authentication. Use btoa for Base64 encoding.
    const credentials = `${keyId}:${keySecret}`
    const base64Credentials = btoa(credentials) // Use btoa() instead of Buffer
    const authHeader = `Basic ${base64Credentials}`

    const orderOptions = {
      amount: amount * 100, // Amount in paisa
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    }

    // Make a direct API call to Razorpay
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(orderOptions),
    })

    if (!response.ok) {
      const errorBody = await response.json()
      throw new Error(`Razorpay API Error: ${errorBody.error.description}`)
    }

    const order = await response.json()

    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Use 500 for internal errors
    })
  }
})