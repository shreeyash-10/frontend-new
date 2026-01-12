import { authService } from './authService';

export interface CountryCode {
  country: string;
  code: string;
}

export interface CountryCodesResponse {
  success: boolean;
  data: CountryCode[];
  message?: string;
  error?: string;
}

class CountryService {
  private baseUrl = ''; // Use proxy in development
  private cachedCountries: CountryCode[] | null = null;
  private cacheExpiry: number | null = null;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  async fetchCountryCodes(): Promise<CountryCodesResponse> {
    try {
      // Check if we have valid cached data
      if (this.cachedCountries && this.cacheExpiry && Date.now() < this.cacheExpiry) {
        return {
          success: true,
          data: this.cachedCountries,
          message: 'Country codes loaded from cache'
        };
      }

      console.log('Fetching country codes from API...');
      
      // Ensure we're authenticated
      if (!authService.isAuthenticated()) {
        console.log('Not authenticated, attempting auto-login...');
        const loginSuccess = await authService.autoLogin();
        if (!loginSuccess) {
          throw new Error('Authentication failed. Please check credentials.');
        }
      }

      const response = await fetch(`${this.baseUrl}/api/user/country_codes`, {
        method: 'GET',
        headers: authService.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data: CountryCode[] = await response.json();
      console.log('Country codes API Response:', data);

      // Cache the results
      this.cachedCountries = data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return {
        success: true,
        data,
        message: 'Country codes loaded successfully'
      };
    } catch (error) {
      console.error('Country codes API failed:', error);
      
      // Return fallback countries if API fails
      const fallbackCountries: CountryCode[] = [
        { country: "India", code: "+91" },
        { country: "United States", code: "+1" },
        { country: "United Kingdom", code: "+44" },
        { country: "UAE", code: "+971" },
        { country: "Singapore", code: "+65" },
        { country: "Germany", code: "+49" }
      ];

      return {
        success: false,
        data: fallbackCountries,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Using fallback country codes due to API error'
      };
    }
  }

  // Get cached countries if available
  getCachedCountries(): CountryCode[] | null {
    if (this.cachedCountries && this.cacheExpiry && Date.now() < this.cacheExpiry) {
      return this.cachedCountries;
    }
    return null;
  }

  // Clear cache (useful for testing or forcing refresh)
  clearCache(): void {
    this.cachedCountries = null;
    this.cacheExpiry = null;
  }
}

// Export a singleton instance
export const countryService = new CountryService();
