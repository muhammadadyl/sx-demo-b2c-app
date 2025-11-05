/**
 * Validates and returns Azure B2C configuration from environment variables
 * @throws Error if any required environment variables are missing
 */
function getAzureConfig() {
  const config = {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: import.meta.env.VITE_AZURE_AUTHORITY,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    knownAuthority: import.meta.env.VITE_AZURE_KNOWN_AUTHORITY,
  } as const;

  // Validate all required environment variables are present
  const missingVars = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => `VITE_AZURE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return config;
}

export const azureConfig = getAzureConfig();