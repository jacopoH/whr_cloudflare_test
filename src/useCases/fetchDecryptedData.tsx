// import {json_type} from '../../domain/dataEntity'
export async function fetchDecryptedData() {
  const getBaseUrl = () => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Get the current origin (protocol + hostname + port)
      return window.location.origin;
    }
    
    // For server-side rendering, we can fallback to a default or use other Next.js context
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  };
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/data`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  return res.json(); // Returns decrypted data as JSON
}


