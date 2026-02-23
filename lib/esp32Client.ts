// ESP32 Client Service

const ESP32_IP = process.env.ESP32_IP || 'http://192.168.1.100';

export class ESP32Client {
  private baseUrl: string;

  constructor(ip?: string) {
    this.baseUrl = ip || ESP32_IP;
  }

  /**
   * Send command to ESP32 to control a relay
   */
  async sendCommand(relayNumber: number, action: 'ON' | 'OFF'): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relay: relayNumber,
          status: action === 'ON' ? 1 : 0,
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`ESP32 responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error communicating with ESP32:', error);
      return false;
    }
  }

  /**
   * Check if ESP32 is online
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new ESP32Client();
