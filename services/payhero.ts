
import { PAYHERO_CONFIG } from '../constants';
import { PayHeroResponse } from '../types';

export const initiatePayment = async (amount: number, phone: string, reference: string): Promise<PayHeroResponse> => {
  let formattedPhone = phone.replace(/\s+/g, '').replace('+', '');
  
  if (formattedPhone.startsWith('0')) {
    formattedPhone = `254${formattedPhone.substring(1)}`;
  } else if (!formattedPhone.startsWith('254')) {
    formattedPhone = `254${formattedPhone}`;
  }

  const payload = {
    amount: amount, 
    phone_number: formattedPhone,
    channel_id: parseInt(PAYHERO_CONFIG.CHANNEL_ID, 10),
    provider: PAYHERO_CONFIG.PROVIDER,
    external_reference: reference,
    callback_url: PAYHERO_CONFIG.CALLBACK_URL
  };

  try {
    const response = await fetch(`${PAYHERO_CONFIG.BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PAYHERO_CONFIG.AUTH_TOKEN
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayHero API Initiation Error:", response.status, data);
      return {
        success: false,
        status: 'Failed',
        reference: reference,
        message: data.error_message || data.message || `Initiation Failed (${response.status})`
      };
    }

    return {
      success: true,
      status: data.status || 'Success',
      reference: reference,
      checkout_id: data.id || data.checkout_id || data.payment_id,
      message: data.message || 'STK Push sent! Please check your phone.'
    };
  } catch (error) {
    console.error("Network Exception:", error);
    return {
      success: false,
      status: 'Error',
      reference: reference,
      message: 'Network error. Please check your connection.'
    };
  }
};

export interface StatusResult {
  status: string;
  transactionCode?: string;
}

export const checkPaymentStatus = async (reference: string, checkoutId?: string): Promise<StatusResult> => {
  try {
    if (checkoutId) {
      const response = await fetch(`${PAYHERO_CONFIG.BASE_URL}/payments/${checkoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': PAYHERO_CONFIG.AUTH_TOKEN
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: data.status || 'Pending',
          transactionCode: data.transaction_code || data.mpesa_reference || data.checkout_id
        };
      }
    }

    const searchUrl = `${PAYHERO_CONFIG.BASE_URL}/payments?external_reference=${reference}`;
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': PAYHERO_CONFIG.AUTH_TOKEN
      }
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      const results = Array.isArray(searchData) ? searchData : (searchData.results || []);
      const match = results.find((r: any) => r.external_reference === reference);
      
      if (match) {
        return {
          status: match.status || 'Pending',
          transactionCode: match.transaction_code || match.mpesa_reference || match.checkout_id
        };
      }
    }
    
    return { status: 'Pending' };
  } catch (error) {
    return { status: 'Pending' };
  }
};

/**
 * Specifically search for a payment using a manual transaction code provided by the user.
 */
export const searchByTransactionCode = async (code: string): Promise<StatusResult | null> => {
  try {
    const searchUrl = `${PAYHERO_CONFIG.BASE_URL}/payments?transaction_code=${code.trim()}`;
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': PAYHERO_CONFIG.AUTH_TOKEN
      }
    });

    if (response.ok) {
      const data = await response.json();
      const results = Array.isArray(data) ? data : (data.results || []);
      // Look for any successful record matching this code
      const match = results.find((r: any) => 
        r.transaction_code === code.trim() || r.mpesa_reference === code.trim()
      );
      
      if (match) {
        return {
          status: match.status || 'Confirmed',
          transactionCode: match.transaction_code || match.mpesa_reference
        };
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};
