import ApiService from './ApiService';
import { WeatherData, ResearchArticle, DoctorReport, ApiResponse, PaginatedResponse } from '../models';

class EnvironmentService {
  // Get environmental data for location
  async getEnvironmentData(location: string): Promise<ApiResponse<WeatherData>> {
    const response = await ApiService.get<any>(`/environment/${location}`);
    return {
      ...response,
      data: response.data ? this.transformEnvironmentData(response.data) : undefined
    };
  }

  // Get current location weather/pollen data using coordinates
  async getCurrentEnvironmentData(lat: number, lon: number): Promise<ApiResponse<WeatherData>> {
    const response = await ApiService.get<any>('/environment/current', { lat, lon });
    return {
      ...response,
      data: response.data ? this.transformEnvironmentData(response.data) : undefined
    };
  }

  // Get user's current location using browser geolocation API
  async getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Transform backend response to frontend WeatherData format
  private transformEnvironmentData(data: any): WeatherData {
    return {
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      temperature: data.temperature,
      humidity: data.humidity,
      airQuality: data.air_quality_index,
      uvIndex: data.uv_index,
      description: data.weather_conditions,
      pollenCount: data.pollen_count,
      pollenData: data.pollen_data,
      dailyPollenInfo: data.daily_pollen_info?.map((forecast: any) => ({
        date: forecast.date,
        pollenTypes: forecast.pollen_types?.map((pollen: any) => ({
          code: pollen.code,
          displayName: pollen.display_name,
          indexValue: pollen.index_value,
          category: pollen.category,
          color: pollen.color,
          inSeason: pollen.in_season
        })) || []
      })) || [],
      plantDescription: data.plant_description
    };
  }

  // Helper method to get pollen risk level for specific allergens
  getPollenRiskForAllergen(weatherData: WeatherData, allergen: string): string {
    if (!weatherData.dailyPollenInfo || weatherData.dailyPollenInfo.length === 0) {
      return 'unknown';
    }

    const todayPollen = weatherData.dailyPollenInfo[0];
    const relevantPollen = todayPollen.pollenTypes.find(pollen => 
      pollen.code.toLowerCase().includes(allergen.toLowerCase()) ||
      pollen.displayName.toLowerCase().includes(allergen.toLowerCase())
    );

    if (relevantPollen) {
      return relevantPollen.category.toLowerCase();
    }

    return 'unknown';
  }

  // Get overall pollen risk level for today
  getOverallPollenRisk(weatherData: WeatherData): string {
    if (!weatherData.dailyPollenInfo || weatherData.dailyPollenInfo.length === 0) {
      return weatherData.pollenCount || 'moderate';
    }

    const todayPollen = weatherData.dailyPollenInfo[0];
    if (todayPollen.pollenTypes.length === 0) {
      return 'low';
    }

    const maxRisk = Math.max(...todayPollen.pollenTypes.map(p => p.indexValue));
    
    if (maxRisk <= 1) return 'low';
    if (maxRisk <= 3) return 'moderate';
    return 'high';
  }
}

class ResearchService {
  // Get AI-summarized research articles
  async getResearchFeed(
    page: number = 1,
    limit: number = 10,
    conditions?: string[]
  ): Promise<ApiResponse<PaginatedResponse<ResearchArticle>>> {
    const params = {
      page,
      limit,
      conditions: conditions?.join(','),
    };

    return ApiService.get<PaginatedResponse<ResearchArticle>>('/research/feed', params);
  }

  // Get article by ID
  async getArticle(articleId: number): Promise<ApiResponse<ResearchArticle>> {
    return ApiService.get<ResearchArticle>(`/research/${articleId}`);
  }

  // Search articles
  async searchArticles(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<ResearchArticle>>> {
    return ApiService.get<PaginatedResponse<ResearchArticle>>('/research/search', {
      q: query,
      page,
      limit,
    });
  }
}

class ReportService {
  // Generate doctor report
  async generateDoctorReport(
    childId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<DoctorReport>> {
    return ApiService.post<DoctorReport>('/reports/generate', {
      child_id: childId,
      start_date: startDate,
      end_date: endDate,
    });
  }

  // Get existing reports
  async getReports(childId: number): Promise<ApiResponse<DoctorReport[]>> {
    return ApiService.get<DoctorReport[]>(`/reports/child/${childId}`);
  }

  // Download report as PDF
  async downloadReportPDF(reportId: number): Promise<ApiResponse<string>> {
    return ApiService.get<string>(`/reports/${reportId}/pdf`);
  }

  // Email report to doctor
  async emailReport(reportId: number, email: string): Promise<ApiResponse<void>> {
    return ApiService.post<void>(`/reports/${reportId}/email`, { email });
  }
}

// Export service instances
export const environmentService = new EnvironmentService();
export const researchService = new ResearchService();
export const reportService = new ReportService();
