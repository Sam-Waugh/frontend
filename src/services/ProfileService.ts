import ApiService from './ApiService';
import { Child, ProfileForm, User, ApiResponse } from '../models';

class ProfileService {  // Create new child profile
  async createChildProfile(profileData: ProfileForm): Promise<ApiResponse<Child>> {
    return ApiService.post<Child>('/profiles/', profileData);
  }

  // Get all children for current user
  async getChildren(): Promise<ApiResponse<Child[]>> {
    return ApiService.get<Child[]>('/profiles/');
  }
  // Get specific child profile
  async getChildProfile(childId: string): Promise<ApiResponse<Child>> {
    return ApiService.get<Child>(`/profiles/${childId}`);
  }

  // Update child profile
  async updateChildProfile(childId: string, updates: Partial<ProfileForm>): Promise<ApiResponse<Child>> {
    return ApiService.put<Child>(`/profiles/${childId}`, updates);
  }

  // Delete child profile
  async deleteChildProfile(childId: string): Promise<ApiResponse<void>> {
    return ApiService.delete<void>(`/profiles/${childId}`);
  }

  // Upload child photo
  async uploadChildPhoto(childId: string, photoUri: string): Promise<ApiResponse<Child>> {
    const formData = new FormData();
    
    const filename = photoUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('photo', {
      uri: photoUri,
      name: filename,
      type,
    } as any);

    return ApiService.post<Child>(`/profiles/${childId}/photo`, formData);
  }

  // Get user profile
  async getUserProfile(): Promise<ApiResponse<User>> {
    return ApiService.get<User>('/auth/me');
  }
  // Update user preferences
  async updateUserPreferences(preferences: User['preferences']): Promise<ApiResponse<User>> {
    return ApiService.put<User>('/auth/preferences', { preferences });
  }
}

export default new ProfileService();
