interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private authToken: string | null = null;
  private baseUrl = ""; // Use proxy in development
  private directBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.induslabs.io";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("Attempting login with credentials:", credentials);

      const attemptLogin = async (baseUrl: string) => {
        const formData = new FormData();
        formData.append("username", credentials.username);
        formData.append("password", credentials.password);

        console.log("Sending form data request...");
        let response = await fetch(`${baseUrl}/api/user/token`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok && response.status === 422) {
          console.log("Form data failed, trying JSON format...");
          response = await fetch(`${baseUrl}/api/user/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });
        }

        return response;
      };

      let response: Response | null = null;
      try {
        response = await attemptLogin(this.baseUrl);
      } catch (error) {
        console.warn("Proxy login failed, trying direct API.", error);
      }

      if (!response || !response.ok) {
        response = await attemptLogin(this.directBaseUrl);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed:", response.status, response.statusText, errorText);
        throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: AuthResponse = await response.json();
      console.log("Login successful, received data:", data);

      this.authToken = data.access_token;

      if (this.authToken && typeof window !== "undefined") {
        localStorage.setItem("auth_token", this.authToken);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("token_type", data.token_type);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  getAuthToken(): string | null {
    if (!this.authToken && typeof window !== "undefined") {
      this.authToken = localStorage.getItem("auth_token");
    }
    return this.authToken;
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  logout(): void {
    this.authToken = null;
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
  }

  async autoLogin(): Promise<boolean> {
    try {
      await this.login({
        username: "aaryan@gmail.com",
        password: "IndusAI@123",
      });
      return true;
    } catch (error) {
      console.error("Auto-login failed:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
